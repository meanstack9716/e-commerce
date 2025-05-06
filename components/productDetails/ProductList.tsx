import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Dimensions, StyleSheet, Text } from "react-native";
import ProductCard from "../home/ProductCard";
import ProductTab from "./ProductTab";
import {
  categories,
  products as allProductsRaw,
} from "../../assets/data/products.json";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Profile } from "@/types/types";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 22;
const ProductScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [filteredProducts, setFilteredProducts] = useState<Profile[]>([]);
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);
  const router = useRouter();
  const { id: currentProductId } = useLocalSearchParams();

  const normalizeProducts = useCallback((): Profile[] => {
    return allProductsRaw.map((product: any) => {
      const normalizedTitle = product.title || product[" title"] || "Untitled";
      return {
        id: product.id,
        images: product.images,
        title: normalizedTitle,
        price: product.price,
        star: product.star,
        categories: product.categories || [],
      };
    });
  }, []);

  useEffect(() => {
    const allProducts = normalizeProducts();
    const currentProduct = allProducts.find(
      (product: Profile) => product.id === currentProductId
    );

    if (activeTab === "ALL") {
      setFilteredProducts(allProducts);
    } else if (activeTab === "Similar" && currentProduct) {
      const filtered = allProducts.filter((product: Profile) => {
        if (product.id === currentProduct.id) return false;
        return product.categories.some((cat: string) =>
          currentProduct.categories.includes(cat)
        );
      });
      setFilteredProducts(filtered);
    } else if (activeTab === "Your Next") {
      setFilteredProducts([]);
    } else {
      const filtered = allProducts.filter((product: Profile) =>
        product.categories.includes(activeTab.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [activeTab, normalizeProducts, currentProductId]);

  const toggleLike = (id: string) => {
    setLikedProductIds((prev: string[]) =>
      prev.includes(id)
        ? prev.filter((itemId: string) => itemId !== id)
        : [...prev, id]
    );
  };

  const renderHeader = () => (
    <ProductTab activeTab={activeTab} setActiveTab={setActiveTab} />
  );
  const renderContent = () => {
    if (activeTab === "Your Next Favourites") {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Based on your preferences, we'll recommend your next favourite
            products here soon!
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredProducts}
        renderItem={({ item }: { item: Profile }) => (
          <ProductCard
            id={item.id}
            images={item.images}
            title={item.title}
            price={item.price}
            star={item.star}
            liked={likedProductIds.includes(item.id)}
            onLikePress={() => toggleLike(item.id)}
            onPress={() =>
              router.push({
                pathname: "/ProductDetails",
                params: { id: item.id },
              })
            }
            cardWidth={cardWidth}
          />
        )}
        keyExtractor={(item: Profile) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<View style={styles.emptyList}></View>}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    ...spacingStyles.px15,
    ...spacingStyles.mb10,
  },
  contentContainer: {
    ...spacingStyles.py10,
    ...spacingStyles.pb10,
  },
  emptyList: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.p20,
  },
  messageText: {
    fontSize: fontSizes.sm,
    textAlign: "center",
    color: staticColors.textLightGray,
  },
});

export default ProductScreen;
