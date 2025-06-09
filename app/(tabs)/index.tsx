import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Alert,
  BackHandler,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProductCard from "@/components/home/ProductCard";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import images from "@/constants/images";
import { useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/category/categoriesSlice";
import { fetchProducts } from "@/store/product/productsSlice";
import borderRadius from "@/style/borderRadius";
import { CategoryItem, Product, SubCategoryItem } from "@/interfaces";
import { fontFamilies } from "@/style/fontFamilies";
import { commonStyles } from "@/style/commonStyle";
import { CategoriresCard } from "@/components/categoriesCard";
import ImageSlider from "@/components/home/ImageSlider";
import bannerData from "../../assets/data/banner.json";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";

const HomeScreen: React.FC = () => {
  const [likedProductItems, setLikedProductItems] = useState<string[]>([]);
  const [activeProductTab, setActiveProductTab] = useState<string>("All");
  const [productSearchQuery, setProductSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: any) => state.categories);

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: any) => state.products);

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch(fetchCategories());
  //     dispatch(fetchProducts({}));
  //   }, [dispatch])
  // );

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({}));
  }, [dispatch]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (router.canGoBack()) {
          router.back();
          return true;
        } else {
          if (Platform.OS === "ios") {
            router.navigate("/(tabs)");
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
        categoriesError ||
          productsError ||
          "Failed to fetch data. Please try again.",
        [
          {
            text: "Retry",
            onPress: () => {
              dispatch(fetchCategories());
              dispatch(fetchProducts({}));
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
  }, [categoriesError, productsError, dispatch]);

  const tabs = [
    "All",
    ...categories.slice(0, 3).map((cat: any) => cat.name),
    "Categories",
  ];

  useEffect(() => {
    if (!activeProductTab && tabs.length > 0) {
      setActiveProductTab("All");
    }
  }, [tabs, activeProductTab]);

  const getFilteredProducts = () => {
    let filtered = products;

    if (
      activeProductTab &&
      activeProductTab !== "All" &&
      activeProductTab !== "Categories" &&
      tabs.includes(activeProductTab)
    ) {
      const activeCategory = categories.find(
        (cat: any) => cat.name.toLowerCase() === activeProductTab.toLowerCase()
      );
      if (activeCategory) {
        const subCategoryIds = activeCategory.sub_categories.map(
          (sub: any) => sub.id
        );
        filtered = filtered.filter((product: Product) =>
          product.categories.some(
            (cat) => cat === activeCategory.id || subCategoryIds.includes(cat)
          )
        );
      }
    }

    if (selectedCategory) {
      filtered = filtered.filter((product: Product) =>
        product.categories.includes(selectedCategory)
      );
    }

    if (productSearchQuery) {
      filtered = filtered.filter((product: Product) =>
        product.title.toLowerCase().includes(productSearchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const toggleProductLike = (id: string) => {
    setLikedProductItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
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
  );

  const isLoading = categoriesLoading || productsLoading;
  const hasError = categoriesError || productsError;

  return (
    <View style={styles.container}>
      <SafeAreaViewWrapper>
        <FullScreenLoader visible={isLoading} />
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <View style={commonStyles.searchContainer}>
          <Text style={commonStyles.searchContainerText}>Shop</Text>
          <View style={commonStyles.searchInputContainer}>
            <TextInput
              placeholder="Search"
              style={commonStyles.searchInput}
              placeholderTextColor={staticColors.gray200}
              value={productSearchQuery}
              onChangeText={setProductSearchQuery}
              onFocus={() => router.navigate("/product-search")}
            />
            <TouchableOpacity>
              <Ionicons
                name="camera-outline"
                size={20}
                color={staticColors.blue400}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageSlider slides={bannerData} />
          <CategoriresCard categoryList={categories} />

          {hasError && <Text style={styles.errorText}>Error: {hasError}</Text>}

          <FlatList
            data={getFilteredProducts()}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
              ...spacingStyles.my20,
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {isLoading ? "Loading products..." : "No products Available"}
                </Text>
              </View>
            )}
          />
        </ScrollView>
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
