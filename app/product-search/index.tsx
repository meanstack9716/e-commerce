import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react"; 
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { useSelector } from "react-redux";
import { Product } from "@/interfaces";
import { useAppDispatch } from "@/store/hooks";
import { fetchProducts, resetProducts } from "@/store/product/productsSlice";
import ProductCard from "@/components/home/ProductCard";
import images from "@/constants/images";
import staticColors from "@/style/staticColors";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";

const ProductSearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const products = useSelector((state: any) => state.products.data);
  const loading = useSelector((state: any) => state.products.loading);
  const error = useSelector((state: any) => state.products.error); 
  const params = useLocalSearchParams();

  const parsedParams = useMemo(
    () => ({
      subCategories: params.subCategories
        ? JSON.parse(params.subCategories as string)
        : [],
      sizes: params.sizes ? JSON.parse(params.sizes as string) : [],
      colors: params.colors ? JSON.parse(params.colors as string) : [],
      priceMin: params.priceMin
        ? parseInt(params.priceMin as string)
        : undefined,
      priceMax: params.priceMax
        ? parseInt(params.priceMax as string)
        : undefined,
    }),
    [
      params.subCategories,
      params.sizes,
      params.colors,
      params.priceMin,
      params.priceMax,
    ]
  );

  const { subCategories, sizes, colors, priceMin, priceMax } = parsedParams;

  useEffect(() => {
    const hasFilters =
      subCategories.length > 0 ||
      sizes.length > 0 ||
      colors.length > 0 ||
      priceMin ||
      priceMax;

    if (hasFilters) {
      setIsSearchSubmitted(true);
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
        })
      );
    }
  }, [dispatch, subCategories, sizes, colors, priceMin, priceMax]);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setIsSearchSubmitted(true);
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
        })
      );
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchSubmitted(false);
    dispatch(resetProducts());
    router.setParams({
      subCategories: JSON.stringify([]),
      sizes: JSON.stringify([]),
      colors: JSON.stringify([]),
      priceMin: undefined,
      priceMax: undefined,
    });
  };

  const handleProductFilter = () => {
    router.push("/product-filter");
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
          loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
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
    color: staticColors.errorColor || "red",
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
});
