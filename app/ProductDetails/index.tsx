import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/style/staticColors";
import staticColors from "@/style/staticColors";
import data from "../../assets/data/products.json";
import spacingStyles from "@/style/spacingStyles";
import MegaDealBadge from "@/components/productDetails/MegaDealBadge";
import SizeSelector from "@/components/productDetails/SizeSelector";
import BottonActions from "@/components/productDetails/BottonActions";
import DeliveryCheck from "@/components/productDetails/DeliveryCheck";
import ReturnPolicy from "./ReturnPolicy";

interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  star: number;
  categories: string[];
}

const ProductDetailsScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const [liked, setLiked] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const insets = useSafeAreaInsets();

  const originalPrice = product
    ? (parseFloat(product.price) * 1.15).toFixed(2)
    : "0";
  const discount = product
    ? (parseFloat(originalPrice) - parseFloat(product.price)).toFixed(2)
    : "0";

  useEffect(() => {
    const products = data.products || data;
    const rawProductData = products.find((p) => p.id === id);

    if (rawProductData) {
      const normalizedProduct: Product = {
        id: rawProductData.id,
        image: rawProductData.image,
        title: rawProductData.title || "Product Title",
        price: rawProductData.price,
        star: rawProductData.star,
        categories: rawProductData.categories || [],
      };

      setProduct(normalizedProduct);
    }
  }, [id]);

  const renderStars = () => {
    if (!product) return null;
    return (
      <FontAwesome
        key="full-star"
        name="star"
        size={16}
        color="#FFD700"
        style={styles.starIcon}
      />
    );
  };

  const handleLikePress = () => {
    setLiked((prev) => !prev);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primaryColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.primaryColor} />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="bag-handle-outline"
                size={20}
                color={colors.primaryColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleLikePress}
            >
              <FontAwesome
                name={liked ? "heart" : "heart-o"}
                size={20}
                color={liked ? "red" : colors.primaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.viewSimilarButton}>
            <Ionicons name="grid-outline" size={20} color="#000" />
            <Text style={styles.viewSimilarText}>View Similar</Text>
          </TouchableOpacity>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars()}</View>
            <Text style={styles.ratingCount}>({product.star.toFixed(1)})</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>MRP ₹{originalPrice}</Text>
            <Text style={styles.discountedPrice}>₹{product.price}</Text>
            <Text style={styles.discount}>(Rs.{discount} OFF)</Text>
          </View>
        </View>
        <MegaDealBadge />
        <SizeSelector
          product={product}
          originalPrice={originalPrice}
          onSizeChartOpen={() => {}}
        />
        <DeliveryCheck />
        <ReturnPolicy />
      </ScrollView>
      <BottonActions />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.lightColor,
   
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.primaryColor,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.p10,
  },
  backButton: {
    ...spacingStyles.p2,
  },
  headerRight: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    ...spacingStyles.ml15,
  },
  image: {
    width: "100%",
    height: 500,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.px15,
    ...spacingStyles.mb15,
    position: "relative",
  },
  viewSimilarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.backgroundSecondary,
    ...spacingStyles.py5,
    ...spacingStyles.px10,
    borderRadius: 10,
    position: "absolute",
    left: 15,
    bottom: 20,
  },
  viewSimilarText: {
    ...spacingStyles.ml5,
    fontSize: 14,
    color: staticColors.shadowColor,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.backgroundSecondary,
    ...spacingStyles.py5,
    ...spacingStyles.px10,
    borderRadius: 10,
    position: "absolute",
    right: 15,
    bottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    ...spacingStyles.m2,
  },
  ratingCount: {
    fontSize: 12,
  },
  detailsContainer: {
    ...spacingStyles.px15,
    ...spacingStyles.ml5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryColor,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: staticColors.lightGray,
  },
  discount: {
    fontSize: 14,
    color: colors.offerColor,
    fontWeight: "bold",
  },
});

export default ProductDetailsScreen;
