import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { CategoriresCard } from "../categoriesCard";
import { useSelector } from "react-redux";
import { SafeAreaViewWrapper } from "../common/SafeAreaView/SafeAreaViewWrapper";
import ProductCard from "../home/ProductCard";
import images from "@/constants/images";
import { Product } from "@/interfaces";
import ProfileHeaderBar from "./ProfileHeaderBar/ProfileHeaderBar";
import gapSizes from "@/style/gapSizes";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";

const UserProfile = () => {
  const [likedProductItems, setLikedProductItems] = useState<string[]>([]);

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

  const toggleProductLike = (id: string) => {
    setLikedProductItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const isLoading = productsLoading;

  return (
    <View style={styles.container}>
      <ProfileHeaderBar title="category" profileImage={images.genderFemale} titleStyle={styles.profileHeaderTitle} />
      <CategoriresCard categoryList={categories} />
      <View style={styles.allProductsContainer}>
        <Text style={styles.headingText}>Just for you</Text>
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          scrollEnabled={false}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: gapSizes.sm,
    ...spacingStyles.px12,
    backgroundColor: staticColors.white,
  },
  profileHeaderTitle: {
    ...spacingStyles.pb5,
    ...spacingStyles.px15,
    backgroundColor: staticColors.primaryBlue,
    color: staticColors.white,
    fontFamily: fontFamilies.ralewayMedium,
    borderRadius: borderRadius.r16,
    fontSize: fontSizes.base,
    textAlign: "center",
  },
  headingText: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
  },
  allProductsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: gapSizes.lg,
  },
  emptyContainer: {
    ...spacingStyles.p20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: staticColors.textLightGray,
  },
  flatListContent: {
    padding: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    ...spacingStyles.mb10,
  },
});

export default UserProfile;
