import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { Product } from "@/interfaces";
import { useAppDispatch } from "@/store/hooks";
import { fetchRecommendedKeywords } from "@/store/product/productsSlice";
import images from "@/constants/images";
import staticColors from "@/style/staticColors";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import {
  LIST_LIMIT,
  PRODUCT_RANGE_MAX_PRICE,
  PRODUCT_RANGE_MIN_PRICE,
  RECOMMENDED_KEYWORD_LIMIT,
} from "@/constants/constants";
import ProductFilter from "@/components/productFilter/ProductFilter";
import ProductCard from "@/components/home/ProductCard";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import ProductCardSkeleton from "@/components/common/ProductCardSkeleton";
import {
  clearSearchHistory,
  getSearchHistory,
  saveSearchQuery,
} from "@/utils/searchStorage";
import SearchSuggestions from "@/components/search/searchHistory/SearchSuggestions";
import {
  fetchSearchProducts,
  resetSearchProducts,
} from "@/store/product/searchProductsSlice";

const ProductSearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [setFilter, setSetFilter] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [productFilters, setProductFilters] = useState({
    subCategories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    priceMin: PRODUCT_RANGE_MIN_PRICE,
    priceMax: PRODUCT_RANGE_MAX_PRICE as number | null,
  });
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const {
    data: filteredData,
    loading,
    error,
    lastPage,
  } = useSelector((state: any) => state.searchProducts);
  const allProducts = useSelector((state: any) => state.products.data);
  const limit = LIST_LIMIT;
  const hasMore = filteredData.length > 0 && page < lastPage;
  const { recommendedKeywords } = useSelector((state: any) => state.products);
  const { subCategories, sizes, colors, priceMin, priceMax } = productFilters;
  const { subSubCategoryId } = useLocalSearchParams();

  useEffect(() => {
    const loadSearchHistory = async () => {
      const history = await getSearchHistory();
      setSearchHistory(history);
    };
    loadSearchHistory();
    dispatch(fetchRecommendedKeywords({ limit: RECOMMENDED_KEYWORD_LIMIT }));
  }, [dispatch]);

  useEffect(() => {
    if (subSubCategoryId && typeof subSubCategoryId === "string") {
      setIsSearchSubmitted(true);
      setPage(1);
      dispatch(resetSearchProducts());
      dispatch(
        fetchSearchProducts({
          params: {
            subSubCategoryIds: subSubCategoryId,
            sizes: "",
            colors: "",
            page: 1,
            limit,
          },
        })
      );
    }
  }, [subSubCategoryId]);

  useEffect(() => {
    const hasFilters =
      subCategories.length > 0 ||
      sizes.length > 0 ||
      colors.length > 0 ||
      priceMin !== PRODUCT_RANGE_MIN_PRICE ||
      priceMax !== PRODUCT_RANGE_MAX_PRICE;

    if (hasFilters && isSearchSubmitted) {
      setIsSearchSubmitted(true);
      setPage(1);
      dispatch(resetSearchProducts());
      const params = {
        subCategoryIds: subCategories.join(","),
        sizes: sizes.join(","),
        colors: colors.join(","),
        minPrice: priceMin,
        maxPrice: priceMax,
        page: 1,
        limit,
      };
      dispatch(fetchSearchProducts({ params }));
    }
  }, [dispatch, subCategories, sizes, colors, priceMin, priceMax]);

  const handleSearchSubmit = async () => {
    try {
      await saveSearchQuery(searchTerm);
      const updatedHistory = await getSearchHistory();
      setSearchHistory(updatedHistory);
      setIsSearchSubmitted(true);
      setPage(1);
      dispatch(resetSearchProducts());
      const params = {
        searchTerm: searchTerm,
        subCategoryIds: subCategories.join(","),
        sizes: sizes.join(","),
        colors: colors.join(","),
        page: 1,
        limit,
      };
      dispatch(fetchSearchProducts({ params }));
    } catch (error) {
      setIsSearchSubmitted(false);
    }
  };

  const handleHistoryItemPress = async (query: string) => {
    setSearchTerm(query);
    setIsSearchSubmitted(true);
    setPage(1);
    dispatch(resetSearchProducts());
    const params = {
      searchTerm: query,
      subCategoryIds: "",
      sizes: "",
      colors: "",
      page: 1,
      limit,
    };
    dispatch(fetchSearchProducts({ params }));
  };

  const handleClearSearchHistory = async () => {
    await clearSearchHistory();
    setSearchHistory([]);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchSubmitted(false);
    setPage(1);
    setProductFilters({
      subCategories: [],
      sizes: [],
      colors: [],
      priceMin: PRODUCT_RANGE_MIN_PRICE,
      priceMax: PRODUCT_RANGE_MAX_PRICE,
    });
    dispatch(resetSearchProducts());
  };

  const handleProductFilter = () => {
    setSetFilter(true);
  };

  const handleApplyFilters = (newFilters: {
    subCategories: string[];
    sizes: string[];
    colors: string[];
    priceMin: number;
    priceMax: number | null;
  }) => {
    setProductFilters(newFilters);
    setIsSearchSubmitted(true);
    setPage(1);
    const params = {
      searchTerm,
      subCategoryIds: newFilters.subCategories.join(","),
      sizes: newFilters.sizes.join(","),
      colors: newFilters.colors.join(","),
      minPrice: newFilters.priceMin,
      maxPrice: newFilters.priceMax,
      page: 1,
      limit,
    };

    dispatch(fetchSearchProducts({ params }));
  };

  const handleClearFilters = () => {
    setProductFilters({
      subCategories: [],
      sizes: [],
      colors: [],
      priceMin: PRODUCT_RANGE_MIN_PRICE,
      priceMax: PRODUCT_RANGE_MAX_PRICE,
    });
    setPage(1);
  };

  const loadMoreProducts = async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);

    const shouldIncludePriceFilters =
      priceMin !== PRODUCT_RANGE_MIN_PRICE ||
      priceMax !== PRODUCT_RANGE_MAX_PRICE;

    dispatch(
      fetchSearchProducts({
        params: {
          searchTerm,
          subCategoryIds: subCategories.join(","),
          sizes: sizes.join(","),
          colors: colors.join(","),
          page: nextPage,
          limit,
          ...(shouldIncludePriceFilters && {
            minPrice: priceMin,
            maxPrice: priceMax,
          }),
        },
      })
    );
  };

  const renderSkeletonItem = () => <ProductCardSkeleton />;

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <FlatList
        data={Array.from({ length: 4 })}
        renderItem={renderSkeletonItem}
        keyExtractor={(_, index) => `footer-skeleton-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.footerSkeletonContainer}
      />
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      {...item}
      onPress={() =>
        router.navigate({
          pathname: "/ProductDetails",
          params: { id: item.id },
        })
      }
    />
  );

  return (
    <SafeAreaViewWrapper>
      <View style={styles.container}>
        <View style={commonStyles.searchContainer}>
          <Text style={commonStyles.searchContainerText}>Shop</Text>
          <View style={commonStyles.searchInputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Search"
                placeholderTextColor={staticColors.gray200}
                value={searchTerm}
                onChangeText={(text) => setSearchTerm(text)}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
                style={[
                  styles.searchInput,
                  searchTerm ? styles.searchInputWithText : null,
                ]}
              />
              {searchTerm ? (
                <TouchableOpacity
                  onPress={clearSearch}
                  style={styles.clearIcon}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={staticColors.darkGray}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* <TouchableOpacity>
              <Ionicons
                name="camera-outline"
                size={22}
                color={staticColors.blue400}
              />
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity onPress={handleProductFilter}>
            <Ionicons
              name="options-outline"
              size={22}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
        </View>

        <SearchSuggestions
          title="Search history"
          searchList={searchHistory}
          onSuggestionPress={handleHistoryItemPress}
          onClearHistory={handleClearSearchHistory}
        />
        <SearchSuggestions
          title="Recommended"
          searchList={recommendedKeywords}
          onSuggestionPress={handleHistoryItemPress}
        />

        {isSearchSubmitted ? (
          loading && page === 1 ? (
            <FlatList
              data={Array.from({ length: 5 })}
              renderItem={renderSkeletonItem}
              keyExtractor={(_, index) => `skeleton-${index}`}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.productList}
            />
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.productList}
              onEndReached={loadMoreProducts}
              onEndReachedThreshold={0.2}
              ListFooterComponent={renderFooter}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Image
                source={images.noProductFound}
                style={styles.noResultsImage}
                resizeMode="contain"
              />
            </View>
          )
        ) : null}

        {setFilter && (
          <View style={styles.filterOverlay}>
            <ProductFilter
              subCategories={productFilters.subCategories}
              sizes={productFilters.sizes}
              colors={productFilters.colors}
              priceMin={productFilters.priceMin}
              priceMax={productFilters.priceMax}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              onClose={() => setSetFilter(false)}
            />
          </View>
        )}
      </View>
    </SafeAreaViewWrapper>
  );
};

export default ProductSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...spacingStyles.px10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    fontWeight: "500",
  },
  searchInputWithText: {
    color: staticColors.blue300,
  },
  clearIcon: {
    ...spacingStyles.mx5,
  },
  productList: {
    ...spacingStyles.py2,
  },
  row: {
    justifyContent: "space-between",
    ...spacingStyles.mb10,
  },
  loadingContainer: {
    ...spacingStyles.p10,
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    fontSize: fontSizes.base,
    color: staticColors.errorColor,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsImage: {
    width: 200,
    height: 200,
  },
  filterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: staticColors.white,
    zIndex: 10,
  },
  footerSkeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    ...spacingStyles.px5,
  },
});
