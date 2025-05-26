import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProductCard from "@/components/home/ProductCard";
import bannerData from "../../assets/data/banner.json";
import promotionalData from "../../assets/data/promotionalData.json";
import Navbar from "@/components/home/Navbar";
import CategoryGrid from "@/components/home/CategoryGrid";
import ImageSlider from "@/components/home/ImageSlider";
import PromotionalCards from "@/components/home/PromotionalCards";
import OfferCardCarousel from "@/components/home/OfferCardCarousel";
import BrandCard from "@/components/home/BrandCard";
import OfferPriceCard from "@/components/home/OfferPriceCard";
import PocketFriendlyBargain from "@/components/home/PocketFriendlyCategory";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import {fontSizes, fontWeights} from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import { Product } from "@/types/types";
import images from "@/constants/images";
import { useAppDispatch } from "@/store/hooks";
import { fetchCategories } from "@/store/category/categoriesSlice";
import { fetchProducts } from "@/store/product/productsSlice";
import borderRadius from "@/style/borderRadius";

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

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
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
              dispatch(fetchProducts());
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

  const handleUserIconPress = () => {
    router.navigate("/profile");
  };

  const toggleProductLike = (id: string) => {
    setLikedProductItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId || null);
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

  const ListHeader = () => (
    <>
      {activeProductTab !== "Categories" && (
        <CategoryGrid
          activeTab={activeProductTab}
          onCategorySelect={handleCategorySelect}
        />
      )}
      {/* <ImageSlider slides={bannerData} /> */}
      {/* <PromotionalCards cards={promotionalData.promotionalCards} /> */}
      {/* <OfferCardCarousel /> */}
      {/* <BrandCard /> <OfferPriceCard /> <PocketFriendlyBargain /> */}
    </>
  );

  const isLoading = categoriesLoading || productsLoading;
  const hasError = categoriesError || productsError;

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[
          styles.contentWrapper,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <FullScreenLoader visible={isLoading} />
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <View style={styles.addressContainer}>
          <View style={styles.addressTextContainer}>
            <FontAwesome6
              name="location-dot"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.addressText, { marginLeft: insets.left }]}>
              Add Delivery Address
            </Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Search products..."
              style={styles.searchInput}
              placeholderTextColor={staticColors.lightGray}
              value={productSearchQuery}
              onChangeText={setProductSearchQuery}
            />
            <TouchableOpacity>
              <Ionicons
                name="search"
                size={20}
                color={staticColors.lightGray}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleUserIconPress}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleUserIconPress}
          >
            <FontAwesome6 name="user-circle" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {hasError && <Text style={styles.errorText}>Error: {hasError}</Text>}
        {tabs.length > 1 && !hasError && (
          <Navbar
            tabs={tabs}
            activeTab={activeProductTab}
            setActiveTab={setActiveProductTab}
          />
        )}

        <FlatList
          data={getFilteredProducts()}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isLoading ? "Loading products..." : "No products Available"}
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgPrimary,
  },
  contentWrapper: {
    flex: 1,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.px10,
    ...spacingStyles.mb10,
  },
  addressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.md,
  },
  addressText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary,
    ...spacingStyles.mx5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
    ...spacingStyles.px10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: staticColors.lightGray,
    borderWidth: 1,
    borderRadius: borderRadius.r12,
    ...spacingStyles.px10,
    backgroundColor: colors.white,
    justifyContent: "space-between",
  },
  logo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    ...spacingStyles.mr10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
  },
  iconButton: {
    ...spacingStyles.ml15,
  },
  flatListContent: {
    ...spacingStyles.px5
  },
  columnWrapper: {
    justifyContent: "space-between",
    ...spacingStyles.mb10,
  },
  errorText: {
    color: staticColors.discountText,
    textAlign: "center",
    ...spacingStyles.my10,
    fontSize: fontSizes.md,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: staticColors.textLightGray,
  },
});

export default HomeScreen;
