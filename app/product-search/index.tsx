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
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { Product } from "@/interfaces";
import { useAppDispatch } from "@/store/hooks";
import { fetchProducts, resetProducts } from "@/store/product/productsSlice";
import images from "@/constants/images";
import staticColors from "@/style/staticColors";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import {
  PRODUCT_LIMIT,
  PRODUCT_RANGE_MAX_PRICE,
  PRODUCT_RANGE_MIN_PRICE,
} from "@/constants/constants";
import ProductFilter from "@/components/productFilter/ProductFilter";
import ProductCard from "@/components/home/ProductCard";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import ProductCardSkeleton from "@/components/common/ProductCardSkeleton";

const ProductSearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [setFilter, setSetFilter] = useState(false);
  const [productFilters, setProductFilters] = useState({
    subCategories: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    priceMin: PRODUCT_RANGE_MIN_PRICE,
    priceMax: PRODUCT_RANGE_MAX_PRICE as number | null,
  });
  const dispatch = useAppDispatch();
  const products = useSelector((state: any) => state.products.data);
  const loading = useSelector((state: any) => state.products.loading);
  const error = useSelector((state: any) => state.products.error);
  const [page, setPage] = useState(1);
  const { subCategories, sizes, colors, priceMin, priceMax } = productFilters;
  const hasMore = useSelector(
    (state: any) => state.products.pagination.hasMore
  );
  const limit = PRODUCT_LIMIT;

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
      dispatch(resetProducts());
      dispatch(
        fetchProducts({
          params: {
            subCategoryIds: subCategories,
            sizes,
            colors,
            minPrice: priceMin,
            maxPrice: priceMax,
          },
          page: 1,
          limit,
        })
      );
    }
  }, [dispatch, subCategories, sizes, colors, priceMin, priceMax]);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setIsSearchSubmitted(true);
      setPage(1);
      dispatch(resetProducts());
      dispatch(
        fetchProducts({
          params: {
            searchTerm: searchTerm,
            subCategoryIds: subCategories,
            sizes,
            colors,
            minPrice: priceMin,
            maxPrice: priceMax,
          },
          page: 1,
          limit,
        })
      );
    }
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
    dispatch(resetProducts());
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
    dispatch(resetProducts());
    dispatch(
      fetchProducts({
        params: {
          searchTerm: searchTerm,
          subCategoryIds: newFilters.subCategories,
          sizes: newFilters.sizes,
          colors: newFilters.colors,
          minPrice: newFilters.priceMin,
          maxPrice: newFilters.priceMax,
        },
        page: 1,
        limit,
      })
    );
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

  const loadMoreProducts = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(
        fetchProducts({
          params: {
            searchTerm: searchTerm,
            subCategoryIds: subCategories,
            sizes,
            colors,
            minPrice: priceMin,
            maxPrice: priceMax,
          },
          page: nextPage,
          limit,
        })
      );
    }
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

            <TouchableOpacity>
              <Ionicons
                name="camera-outline"
                size={22}
                color={staticColors.blue400}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleProductFilter}>
            <Ionicons
              name="options-outline"
              size={22}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
        </View>

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
          ) : products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.productList}
              onEndReached={loadMoreProducts}
              onEndReachedThreshold={0.5}
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
  loadingText: {
    textAlign: "center",
    fontSize: fontSizes.base,
    color: staticColors.darkGray,
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
