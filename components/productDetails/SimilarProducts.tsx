import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router"; 
import data from "@/assets/data/products.json";
import { Profile } from "../../types/types";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";

const SimilarProducts = ({ currentProduct }: { currentProduct: Profile }) => {
  if (!currentProduct) return null;

  const rawProducts = data.products || data;

  const allProducts: Profile[] = rawProducts.map((item) => ({
    ...item,
    title: item.title ?? "Untitled Product",
  }));
  

  const similar = allProducts.filter((product) => {
    if (product.id === currentProduct.id) return false;

    const sharedCategory = product.categories.some((cat) =>
      currentProduct.categories.includes(cat)
    );

    return sharedCategory;
  });

  const limitedSimilar = similar.slice(0, 6);

  if (limitedSimilar.length === 0) return null;

  const truncateTitle = (title: string) => {
    const words = title.split(" ");
    if (words.length > 2) {
      return `${words.slice(0, 2).join(" ")}...`;
    }
    return title;
  };

  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/ProductDetails", 
      params: { id: productId },
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={limitedSimilar}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleProductPress(item.id)}
          >
            <View style={styles.imageContainer}>
              {item.images && item.images.length > 0 ? (
                <Image 
                  source={{ uri: item.images[0] }} 
                  style={styles.image} 
                />
              ) : (
                <View style={[styles.image, styles.noImageContainer]}>
                  <Text style={styles.noImageText}>No image</Text>
                </View>
              )}
              <View style={styles.ratingContainer}>
                <Text style={styles.star}>{item.star} ★</Text>
              </View>
            </View>
            <Text style={styles.title}>{truncateTitle(item.title)}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add to Bag</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px15,
  },
  card: {
    ...spacingStyles.mr10,
    width: 150,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 190,
    borderRadius: 10,
  },
  noImageContainer: {
    backgroundColor: staticColors.backgroundMuted,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: staticColors.lightGray,
    fontSize: 12,
  },
  ratingContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: staticColors.whiteColor,
    ...spacingStyles.px5,
    ...spacingStyles.py2,
    borderRadius: 4,
  },
  star: {
    fontSize: 12,
    color: staticColors.shadowColor,
    fontWeight: "bold",
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    ...spacingStyles.mt5,
    ...spacingStyles.mx5,
    color: staticColors.cardTitleColor,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    ...spacingStyles.mt2,
    ...spacingStyles.mx5,
    color: "#000",
  },
  addButton: {
    paddingVertical: 6,
    borderRadius: 20,
    ...spacingStyles.m5,
    borderWidth: 1,
    borderColor: staticColors.primaryColor,
  },
  addButtonText: {
    color: staticColors.primaryColor,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SimilarProducts;