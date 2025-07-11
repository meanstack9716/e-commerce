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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { textTruncate } from "@/utils/textTruncate";
import { commonStyles } from "@/style/commonStyle";
import borderRadius from "@/style/borderRadius";
import { useAppDispatch } from "@/store/hooks";
import { SimilarProduct, SimilarProductsProps } from "./SimilarProduct.types";
import { fontFamilies } from "@/style/fontFamilies";
import { fetchSimilarProducts } from "@/store/similarProduct/SimilarProductSlice";

const SimilarProducts = ({
  currentProduct,
  handleAddToCart,
}: SimilarProductsProps) => {
  const dispatch = useAppDispatch();

  const {
    data: similarProducts,
    loading,
    error,
  }: {
    data: SimilarProduct[];
    loading: boolean;
    error: string | null;
  } = useSelector((state: RootState) => state.similarProducts);

  const productColor = currentProduct.gallery?.[0]?.color;

  useEffect(() => {
    if (currentProduct?.id) {
      dispatch(
        fetchSimilarProducts({
          productId: currentProduct.id,
          color: productColor,
        })
      );
    }
  }, [dispatch, currentProduct]);

  const limitedProducts = similarProducts
    .filter((product) => product.id !== currentProduct.id)
    .slice(0, 15);

  const navigateToProductDetails = (productId: string) => {
    router.navigate({
      pathname: "/ProductDetails",
      params: { id: productId },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={staticColors.lightGray} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (limitedProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No similar products found.</Text>
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
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} />
              ) : (
                <View
                  style={[styles.image, commonStyles.imagePlaceholderContainer]}
                >
                  <Text style={commonStyles.imagePlaceholderText}>
                    No image
                  </Text>
                </View>
              )}
            </View>

            <Text style={[commonStyles.cardTitle, styles.title]}>
              {textTruncate(item.name || "Untitled Product")}
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
