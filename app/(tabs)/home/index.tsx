import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
  Alert,
  BackHandler,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { router, useFocusEffect } from "expo-router";
import ProductCard from "@/components/home/ProductCard";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import { useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/category/categoriesSlice";
import { fetchProducts } from "@/store/product/productsSlice";
import { Product } from "@/interfaces";
import { fontFamilies } from "@/style/fontFamilies";
import { commonStyles } from "@/style/commonStyle";
import { CategoriresCard } from "@/components/categoriesCard";
import ImageSlider from "@/components/home/ImageSlider";
import bannerData from "../../../assets/data/banner.json";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import ProductCardSkeleton from "@/components/common/ProductCardSkeleton";
import { LIST_LIMIT } from "@/constants/constants";

const HomeScreen: React.FC = () => {
  const [likedProductItems, setLikedProductItems] = useState<string[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const dispatch = useAppDispatch();
  const limit = LIST_LIMIT;

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: any) => state.categories);

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    lastPage,
  } = useSelector((state: any) => state.products);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchCategories());
      setPage(1);
      setIsLoadingMore(false);
      dispatch(fetchProducts({ params: { page: 1, limit } }));
    }, [dispatch, limit])
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (router.canGoBack()) {
          router.back();
          return true;
        } else {
          if (Platform.OS === "ios") {
            router.navigate("/(tabs)/(profile)");
          } else {
            BackHandler.exitApp();
          }
          return true;
        }
      }
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (categoriesError || productsError) {
      Alert.alert(
        "Error",
        String(
          categoriesError ||
            productsError ||
            "Failed to fetch data. Please try again."
        ),
        [
          {
            text: "Retry",
            onPress: () => {
              dispatch(fetchCategories());
              setPage(1);
              setIsLoadingMore(false);
              dispatch(fetchProducts({ params: { page: 1, limit } }));
            },
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  }, [categoriesError, productsError, dispatch, limit]);

  const toggleProductLike = useCallback((id: string) => {
    setLikedProductItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!productsLoading && page < lastPage && !isLoadingMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchProducts({ params: { page: nextPage, limit } })).finally(
        () => {
          setIsLoadingMore(false);
        }
      );
    }
  }, [productsLoading, page, lastPage, isLoadingMore, dispatch, limit]);

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        {...item}
        liked={likedProductItems.includes(item.id)}
        onLikePress={() => toggleProductLike(item.id)}
        onPress={() =>
          router.navigate({
            pathname: "/ProductDetails",
            params: { id: item.id },
          })
        }
      />
    ),
    [likedProductItems, toggleProductLike]
  );

  const renderSkeletonItem = useCallback(() => <ProductCardSkeleton />, []);

  const renderHeader = useCallback(
    () => (
      <View>
        <View style={commonStyles.searchContainer}>
          <Text style={commonStyles.searchContainerText}>Shop</Text>
          <View style={commonStyles.searchInputContainer}>
            <TextInput
              placeholder="Search"
              style={commonStyles.searchInput}
              placeholderTextColor={staticColors.gray200}
              value={productSearchQuery}
              onChangeText={setProductSearchQuery}
              onFocus={() => router.navigate("/home/product-search")}
            />
          </View>
        </View>
        <ImageSlider slides={bannerData} />
        <CategoriresCard categoryList={categories} />
      </View>
    ),
    [categories, productSearchQuery]
  );

  const isLoading = categoriesLoading || productsLoading;

  return (
    <View style={styles.container}>
      <SafeAreaViewWrapper>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <FlatList
          ref={flatListRef}
          data={
            productsLoading && products.length === 0
              ? Array(4).fill({})
              : products
          }
          numColumns={2}
          keyExtractor={(item, index) =>
            productsLoading && products.length === 0
              ? `skeleton-${index}`
              : item.id
          }
          renderItem={
            productsLoading && products.length === 0
              ? renderSkeletonItem
              : renderProductItem
          }
          ListHeaderComponent={renderHeader}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={1.0}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 10,
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            ...spacingStyles.my20,
          }}
          ListFooterComponent={() =>
            productsLoading && products.length > 0 ? (
              <View style={{ paddingVertical: 20 }}>
                <FlatList
                  data={Array.from({ length: 4 })}
                  renderItem={renderSkeletonItem}
                  keyExtractor={(_, index) => `footer-skeleton-${index}`}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    ...spacingStyles.my20,
                  }}
                />
              </View>
            ) : null
          }
          ListEmptyComponent={() =>
            !productsLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products Available</Text>
              </View>
            ) : null
          }
        />
      </SafeAreaViewWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.px12,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "column",
    gap: gapSizes.lg,
  },
  headingWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...spacingStyles.pt10,
    ...spacingStyles.px4,
    gap: gapSizes.xl,
  },
  headingText: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
  },
  seeAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: gapSizes.sm,
  },
  seeAllText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayBold,
  },
  categoryCountText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.ralewayExtraBold,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  errorText: {
    color: staticColors.discountText,
    textAlign: "center",
    ...spacingStyles.my10,
    fontSize: fontSizes.md,
  },
  emptyContainer: {
    ...spacingStyles.p20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: staticColors.textLightGray,
  },
});

export default HomeScreen;
