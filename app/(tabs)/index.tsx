import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import ProductCard from "@/components/home/ProductCard";
import { router } from "expo-router";
import data from "../../assets/data/products.json";
import Navbar from "@/components/home/Navbar";
import CategoryGrid from "@/components/home/CategoryGrid";
import ImageSlider from "@/components/home/ImageSlider";
import bannerData from "../../assets/data/banner.json";
import PromotionalCards from "@/components/home/PromotionalCards";
import promotionalData from "../../assets/data/promotionalData.json";
import OfferCardCarousel from "@/components/home/OfferCardCarousel";
import colors from "@/style/staticColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import spacingStyles from "@/style/spacingStyles";
import BrandCard from "@/components/home/BrandCard";
import staticColors from "@/style/staticColors";
import OfferPriceCard from "@/components/home/OfferPriceCard";
import PocketFriendlyBargain from "@/components/home/PocketFriendlyCategory";
import { Profile, ProductData } from "@/types/types";
import fontSizes from "@/style/fontSizes";
import gapSizes from "@/style/gapSizes";
import images from "@/constants/images";

const HomeScreen: React.FC = () => {
  const [likedProductItems, setLikedProductItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [productSearchQuery, setProductSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const productData = data as ProductData;
  const insets = useSafeAreaInsets();
  const getFilteredProducts = () => {
    let filtered = productData.products;

    if (activeTab !== "All") {
      const tabLower = activeTab.toLowerCase();
      filtered = filtered.filter((product) =>
        product.categories.includes(tabLower)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) =>
        product.categories.includes(selectedCategory)
      );
    }

    if (productSearchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(productSearchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const tabs = ["All", "Men", "Women", "Kids", "Categories"];

  const handleUserIconPress = () => {
    router.push("/profile");
  };

  const toggleProductLike = (id: string) => {
    setLikedProductItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId || null);
  };

  const renderProductItem = ({ item }: { item: Profile }) => (
    <ProductCard
      {...item}
      liked={likedProductItems.includes(item.id)}
      onLikePress={() => toggleProductLike(item.id)}
      onPress={() => router.push({
        pathname: "/ProductDetails",
        params: { id: item.id }
      })}
    />
  );
  

  const ListHeader = () => (
    <>
      {activeTab !== "Categories" && (
        <CategoryGrid
          activeTab={activeTab}
          onCategorySelect={handleCategorySelect}
        />
      )}
      <ImageSlider slides={bannerData} />
      <PromotionalCards cards={promotionalData.promotionalCards} />
      <OfferCardCarousel />
      <BrandCard />
      <OfferPriceCard />
      <PocketFriendlyBargain />
    </>
  );

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

        <Navbar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <FlatList
          data={getFilteredProducts()}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
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
    fontWeight: "500",
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
    borderRadius: 12,
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
    ...spacingStyles.px10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    ...spacingStyles.mb10,
  },
});

export default HomeScreen;