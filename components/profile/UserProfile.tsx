import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { CategoriresCard } from "../categoriesCard";
import { useSelector } from "react-redux";
import { SafeAreaViewWrapper } from "../common/SafeAreaView/SafeAreaViewWrapper";
import ProductCard from "../home/ProductCard";

import { fontFamilies } from "@/style/fontFamilies";

import images from "@/constants/images";
import { Product } from "@/interfaces";
import ProfileHeaderBar from "./ProfileHeaderBar/ProfileHeaderBar";

const UserProfile = () => {
  const [likedProductItems, setLikedProductItems] = useState<string[]>([]);

  const handleOrder = () => {
    router.push({
      pathname: "/cart",
    });
  };
  const handleAccount = () => {
    router.push({
      pathname: "/accountManage",
    });
  };

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
    <SafeAreaViewWrapper style={styles.container}>
      <ProfileHeaderBar title="category" profileImage={images.genderFemale}/>
      <CategoriresCard categoryList={categories} />
      <View style={styles.allProductsContainer}>
        <Text style={styles.headingText}>Just For You</Text>
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

    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 10
  },
  headingText: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
    ...spacingStyles.pb10,
  },
  allProductsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: staticColors.textLightGray,
  },
  flatListContent: {
    ...spacingStyles.px5,
  },
  columnWrapper: {
    justifyContent: "space-between",
    ...spacingStyles.mb10,
  },
});

export default UserProfile;
