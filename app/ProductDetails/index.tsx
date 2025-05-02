import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
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
import SimilarProducts from "@/components/productDetails/SimilarProducts";
import { Profile } from "../../types/types";
import BrandRating from "@/components/productDetails/BrandRating";
import ViewSimilarModal from "@/modal/ViewSimilarModal";
import ProductList from "@/components/productDetails/ProductList";

const { width: screenWidth } = Dimensions.get("window");

const ProductDetailsScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const [liked, setLiked] = useState(false);
  const [product, setProduct] = useState<Profile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

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
      const normalizedProduct: Profile = {
        id: rawProductData.id,
        images: rawProductData.images,
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

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(index);
  };

  const handleListScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > 1200);
  };

  const handleLikePress = () => {
    setLiked((prev) => !prev);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleViewSimilar = () => {
    setIsModalVisible(true);
  };

  const handleBackToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setShowBackToTop(false);
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

  const dummyData = [{ key: "dummy" }];

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        ref={flatListRef}
        data={dummyData}
        keyExtractor={(item) => item.key}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        onScroll={handleListScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={handleGoBack}
                style={styles.backButton}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={colors.primaryColor}
                />
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
                  onPress={handleLikePress}
                  style={styles.iconButton}
                >
                  <FontAwesome
                    name={liked ? "heart" : "heart-o"}
                    size={20}
                    color={liked ? "red" : colors.primaryColor}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Image Carousel */}
            <FlatList
              horizontal
              pagingEnabled
              data={product.images}
              keyExtractor={(_, index) => index.toString()}
              onScroll={handleScroll}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            />
            {/* Dot Indicators */}
            <View style={styles.dotContainer}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        activeIndex === index
                          ? staticColors.darkGray
                          : staticColors.borderLight,
                    },
                  ]}
                />
              ))}
            </View>

            {/* View Similar & Rating */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.viewSimilarButton}
                onPress={handleViewSimilar}
              >
                <Ionicons name="grid-outline" size={20} color="#000" />
                <Text style={styles.viewSimilarText}>View Similar</Text>
              </TouchableOpacity>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>{renderStars()}</View>
                <Text style={styles.ratingCount}>
                  ({product.star.toFixed(1)})
                </Text>
              </View>
            </View>

            {/* Title & Price */}
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

            <Text style={styles.heading}>Similar Products</Text>
            <SimilarProducts currentProduct={product} />

            <BrandRating />
            <Text style={styles.heading}>Products you may like</Text>
            <ProductList />
          </>
        }
      />
      {showBackToTop ? (
        <TouchableOpacity
          style={styles.backToTopButton}
          onPress={handleBackToTop}
        >
          <Ionicons name="arrow-up" size={24} color={colors.whiteColor} />
          <Text style={styles.backToTopText}>Back to Top</Text>
        </TouchableOpacity>
      ) : (
        <BottonActions />
      )}
      <ViewSimilarModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        currentProduct={product}
      />
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
    width: screenWidth,
    height: 450,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    ...spacingStyles.mx2,
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
    bottom: 40,
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
    bottom: 40,
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
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    ...spacingStyles.mb10,
    color: staticColors.cardTitleColor,
    ...spacingStyles.px15,
  },
  backToTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: colors.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  backToTopText: {
    color: colors.whiteColor,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default ProductDetailsScreen;
