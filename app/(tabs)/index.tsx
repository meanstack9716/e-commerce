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
  ScrollView,
  Image,
  Platform,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import ProductCard from "@/components/home/ProductCard";
import { router, useNavigation } from "expo-router";
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
import PocketFriendlyBargain from "@/components/home/PocketFriendlyBargain";
interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  star: number;
  categories: string[];
}

interface Category {
  id: string;
  title: string;
  imageUrl: string;
  isActive?: boolean;
}

interface ProductData {
  categories: {
    All: Category[];
    Men: Category[];
    Women: Category[];
  };
  products: Product[];
}

const HomeScreen: React.FC = () => {
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const productData = data as ProductData;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
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

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const tabs = ["All", "Men", "Women", "Kids", "Categories"];

  const handleUserIconPress = () => {
    router.push("/profile");
  };

  const toggleLike = (id: string) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId || null);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
    {...item}
    liked={likedItems.includes(item.id)}
    onLikePress={() => toggleLike(item.id)}
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
              color={colors.primaryColor}
            />
            <Text style={[styles.addressText, { marginLeft: insets.left }]}>
              Add Delivery Address
            </Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={colors.primaryColor}
          />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Image
              source={require("../../assets/images/favicon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Search products..."
              style={styles.searchInput}
              placeholderTextColor={staticColors.lightGray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <Ionicons name="search" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleUserIconPress}
          >
            <MaterialIcons
              name="notifications-none"
              size={22}
              color={colors.primaryColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="heart" size={22} color={colors.primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleUserIconPress}
          >
            <FontAwesome6
              name="user-circle"
              size={22}
              color={colors.primaryColor}
            />
          </TouchableOpacity>
        </View>

        <Navbar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <FlatList
          data={getFilteredProducts()}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
    backgroundColor: staticColors.homebackgroundColor,
  },
  contentWrapper: {
    flex:1
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
    gap:8
  },
  addressText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primaryColor,
    ...spacingStyles.mx5
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
    ...spacingStyles.px10
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: staticColors.lightColor,
    borderWidth: 1,
    borderRadius: 12,
    ...spacingStyles.px10,
    backgroundColor: colors.whiteColor,
    justifyContent: "space-between",
  },

  logo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    ...spacingStyles.mr10
  },

  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 12,
    color: staticColors.cardTitleColor,
  },
  iconButton: {
    ...spacingStyles.ml15
  },
  flatListContent: {
    ...spacingStyles.px10
  },
  columnWrapper: {
    justifyContent: "space-between",
    ...spacingStyles.mb10
  },
});

export default HomeScreen;
