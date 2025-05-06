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
import fontSizes from "@/style/fontSizes";
import { textTruncatHelper } from "@/utils/textTruncatHelpers";
import { commonStyles } from "@/style/commonStyle";
import { FontAwesome } from "@expo/vector-icons";

const SimilarProducts = ({ currentProduct }: { currentProduct: Profile }) => {
  if (!currentProduct) return null;

  const allProductData = data.products || data;

  const allProducts: Profile[] = allProductData.map((item) => ({
    ...item,
    title: item.title ?? "Untitled Product",
  }));

  const similarProducts = allProducts.filter((product) => {
    if (product.id === currentProduct.id) return false;

    const sharedCategory = product.categories.some((cat) =>
      currentProduct.categories.includes(cat)
    );

    return sharedCategory;
  });

  const limitedSimilar = similarProducts.slice(0, 6);
  if (limitedSimilar.length === 0) return null;

  const navigateToProductDetails = (productId: string) => {
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
            onPress={() => navigateToProductDetails(item.id)}
          >
            <View style={commonStyles.imageContainer}>
              {item.images && item.images.length > 0 ? (
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              ) : (
                <View
                  style={[styles.image, commonStyles.imagePlaceholderContainer]}
                >
                  <Text style={commonStyles.imagePlaceholderText}>
                    No image
                  </Text>
                </View>
              )}
              <View style={commonStyles.ratingContainer}>
                <Text >
                  {item.star}{" "}
                  <FontAwesome
                    name="star"
                    size={14}
                    color={staticColors.lightYellow}
                  />
                </Text>
              </View>
            </View>
            <Text style={[commonStyles.cardTitle , styles.title]}>{textTruncatHelper(item.title)}</Text>
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
  image: {
    width: "100%",
    height: 190,
    borderRadius: 10,
  },
  title: {
    ...spacingStyles.mt5,
    ...spacingStyles.mx5,
  },
  price: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    ...spacingStyles.mt2,
    ...spacingStyles.mx5,
    color: staticColors.black,
  },
  addButton: {
    ...spacingStyles.py5,
    borderRadius: 20,
    ...spacingStyles.m5,
    borderWidth: 1,
    borderColor: staticColors.primary,
  },
  addButtonText: {
    color: staticColors.primary,
    textAlign: "center",
    fontSize: fontSizes.xs,
    fontWeight: "bold",
  },
});

export default SimilarProducts;
