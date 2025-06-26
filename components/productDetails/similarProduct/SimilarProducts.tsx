import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/product/productsSlice";
import { RootState } from "@/store/store";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { textTruncate } from "@/utils/textTruncate";
import { commonStyles } from "@/style/commonStyle";
import { FontAwesome } from "@expo/vector-icons";
import borderRadius from "@/style/borderRadius";
import { useAppDispatch } from "@/store/hooks";
import { SimilarProductsProps } from "./SimilarProduct.types";
import { fontFamilies } from "@/style/fontFamilies";

const SimilarProducts = ({
  currentProduct,
  handleAddToCart,
}: SimilarProductsProps) => {
  const dispatch = useAppDispatch();
  const {
    data: allProducts,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ params: { page: 1, limit: 15 } }));
  }, [dispatch]);

  if (!currentProduct) {
    return (
      <View style={styles.container}>
        <Text>No product provided.</Text>
      </View>
    );
  }

  // Limit to 15 products
  const limitedProducts = allProducts
    .filter((product) => product.id !== currentProduct.id)
    .slice(0, 15);

  // Handle navigation to product details
  const navigateToProductDetails = (productId: string) => {
    router.navigate({
      pathname: "/ProductDetails",
      params: { id: productId },
    });
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={staticColors.lightGray}></ActivityIndicator>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  // Render if no products are found
  if (limitedProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No products found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={limitedProducts}
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
                <Text style={styles.ratingText}>
                  {item.star || "N/A"}{" "}
                  <FontAwesome
                    name="star"
                    size={12}
                    color={staticColors.lightYellow}
                  />
                </Text>
              </View>
            </View>
            <Text style={[commonStyles.cardTitle, styles.title]}>
              {textTruncate(item.title || "Untitled Product")}
            </Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
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
    ...spacingStyles.mb20,
  },
  card: {
    ...spacingStyles.mr10,
    width: 160,
    borderRadius: borderRadius.r8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 190,
    borderRadius: borderRadius.r10,
  },
  title: {
    ...spacingStyles.mt5,
    ...spacingStyles.mx5,
  },
  price: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mt2,
    ...spacingStyles.mx5,
    color: staticColors.black,
  },
  ratingText: { fontSize: fontSizes.xs },
  addButton: {
    ...spacingStyles.py5,
    borderRadius: borderRadius.r12,
    ...spacingStyles.m5,
    borderWidth: 1,
    borderColor: staticColors.primaryBlue,
    alignItems: "center",
    alignContent: "center",
  },
  addButtonText: {
    color: staticColors.primaryBlue,
    textAlign: "center",
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayeSemiBold,
  },
});

export default SimilarProducts;
