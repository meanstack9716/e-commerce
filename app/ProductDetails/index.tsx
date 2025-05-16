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
import { useDispatch, useSelector } from "react-redux";
import colors from "@/style/staticColors";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import MegaDealBadge from "@/components/productDetails/MegaDealBadge";
import SizeSelector from "@/components/productDetails/SizeSelector";
import DeliveryCheck from "@/components/productDetails/DeliveryCheck";
import ReturnPolicy from "./ReturnPolicy";
import SimilarProducts from "@/components/productDetails/SimilarProducts";
import { Product } from "../../types/types";
import BrandRating from "@/components/productDetails/BrandRating";
import ViewSimilarModal from "@/modal/ViewSimilarModal";
import ProductList from "@/components/productDetails/ProductList";
import ProductActionButtons from "@/components/productDetails/ProductActionButtons";
import fontSizes from "@/style/fontSizes";
import gapSizes from "@/style/gapSizes";
import { AppDispatch, RootState } from "@/store/store";
import {
  clearSelectedProduct,
  fetchProductById,
} from "@/store/product/productsSlice";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { addToCartApi, addToCartLocally } from "@/store/cart/cartSlice";
import { useAppSelector } from "@/store/hooks";

const { width: screenWidth } = Dimensions.get("window");
const screenHeight = Dimensions.get("window").height;
const ProductDetailsScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedProduct: product,
    selectedProductLoading: loading,
    selectedProductError: error,
  } = useSelector((state: RootState) => state.products);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined
  );
  const [selectedColorName, setSelectedColorName] = useState<
    string | undefined
  >(undefined);
  const [isProductLiked, setIsProductLiked] = useState(false);
  const [isViewSimilarModalVisible, setViewSimilarModalVisible] =
    useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const imageCarouselRef = useRef<FlatList>(null);
  const screenHeight = Dimensions.get("window").height;

  const isAuthenticatedUser = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id as string));
    }

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  // const renderStars = () => {
  //   if (!product) return null;
  //   return (
  //     <FontAwesome
  //       key="full-star"
  //       name="star"
  //       size={16}
  //       color={staticColors.lightYellow}
  //       style={styles.starIcon}
  //     />
  //   );
  // };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(index);
  };

  const handleListScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > screenHeight * 1.5);
  };

  const handleLikePress = () => {
    setIsProductLiked((prev) => !prev);
  };

  const handleGoBack = () => {
    router.back();
  };

  // const handleViewSimilar = () => {
  //   setViewSimilarModalVisible(true);
  // };

  const handleBackToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setShowBackToTop(false);
  };

  const handleColorSelect = (colorData: {
    color: string;
    colorName?: string;
    images: string[];
  }) => {
    setSelectedColor(colorData.color);
    setSelectedColorName(colorData.colorName);
    setDisplayImages(colorData.images);
    setActiveIndex(0);
    if (imageCarouselRef.current) {
      imageCarouselRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCartLocally({
          product,
          selectedSize,
          selectedColor,
          colorName: selectedColorName,
          isAuthenticated: isAuthenticatedUser,
        })
      );

      if (isAuthenticatedUser) {
        dispatch(
          addToCartApi({
            product,
            selectedSize,
            selectedColor,
          })
        ).unwrap();
        router.navigate("/cart");
      } else {
        router.navigate("/cart");
      }
    }
  };

  if (loading || error) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <FullScreenLoader visible={loading} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dummyData = [{ key: "dummy" }];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top },
        { paddingBottom: insets.bottom },
      ]}
    >
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
                <Ionicons name="arrow-back" size={20} color={colors.primary} />
              </TouchableOpacity>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons
                    name="bag-handle-outline"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleLikePress}
                  style={styles.iconButton}
                >
                  <FontAwesome
                    name={isProductLiked ? "heart" : "heart-o"}
                    size={20}
                    color={isProductLiked ? colors.DarkRed : colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Image Carousel */}
            <FlatList
              ref={imageCarouselRef}
              horizontal
              pagingEnabled
              data={
                displayImages.length > 0 ? displayImages : product?.images || []
              }
              keyExtractor={(_, index) => `image-${index}`}
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
            {(displayImages.length > 1 || displayImages.length === 0) && (
              <View style={styles.dotContainer}>
                {(displayImages.length > 0
                  ? displayImages
                  : product?.images || []
                ).map((_, index) => (
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
            )}

            {/* View Similar & Rating */}
            {/* <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.viewSimilarButton}
                onPress={handleViewSimilar}
              >
                <Ionicons
                  name="grid-outline"
                  size={20}
                  color={staticColors.black}
                />
                <Text style={styles.viewSimilarText}>View Similar</Text>
              </TouchableOpacity>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>{renderStars()}</View>
                <Text style={styles.ratingCount}>
                  ({product.star.toFixed(1)})
                </Text>
              </View>
            </View> */}

            {/* Title & Price */}
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{product.title}</Text>
              <Text>{product.description}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.discountedPrice}>
                  ₹{product.final_price}
                </Text>
                <Text style={styles.price}>₹{product.price}</Text>
                <Text style={styles.discount}>
                  ({product.discount_percent}% OFF)
                </Text>
              </View>
            </View>
            {/* <MegaDealBadge /> */}
            <SizeSelector
              product={product}
              onColorSelect={handleColorSelect}
              onSizeSelect={setSelectedSize}
            />
            {/* <DeliveryCheck />
            <ReturnPolicy /> */}

            {/* <Text style={styles.heading}>Similar Products</Text>
            <SimilarProducts currentProduct={product} /> */}
            {/* 
            <BrandRating />
            <Text style={styles.heading}>Products you may like</Text>
            <ProductList /> */}
          </>
        }
      />

      {showBackToTop ? (
        <TouchableOpacity
          style={[styles.backToTopButton, { bottom: insets.bottom + 10 }]}
          onPress={handleBackToTop}
        >
          <Ionicons name="arrow-up" size={24} color={colors.white} />
          <Text style={styles.backToTopText}>Back to Top</Text>
        </TouchableOpacity>
      ) : (
        <ProductActionButtons
          onAddToCart={handleAddToCart}
          onWishlist={handleLikePress}
        />
      )}
      {/* <ViewSimilarModal
        visible={isViewSimilarModalVisible}
        onClose={() => setViewSimilarModalVisible(false)}
        currentProduct={product}
      /> */}
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgMuted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.primary,
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
    gap: gapSizes.md,
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
    ...spacingStyles.mt10,
    gap: gapSizes.xs,
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
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.py5,
    ...spacingStyles.px10,
    borderRadius: 10,
    position: "absolute",
    left: 15,
    bottom: 40,
  },
  viewSimilarText: {
    ...spacingStyles.ml5,
    fontSize: fontSizes.sm,
    color: staticColors.shadowColor,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.bgSecondary,
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
    fontSize: fontSizes.xs,
  },
  detailsContainer: {
    ...spacingStyles.px15,
    ...spacingStyles.ml5,
    ...spacingStyles.pt15,
    ...spacingStyles.pb10,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.md,
  },
  discountedPrice: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: colors.primary,
  },
  price: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: fontSizes.sm,
    color: colors.brightRed,
    fontWeight: "bold",
  },
  heading: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    ...spacingStyles.mb10,
    color: staticColors.primary,
    ...spacingStyles.px15,
  },
  backToTopButton: {
    position: "absolute",
    bottom: 0,
    right: 20,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.py10,
    ...spacingStyles.px15,
    borderRadius: 25,
  },
  backToTopText: {
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: "bold",
    ...spacingStyles.ml5,
  },
});

export default ProductDetailsScreen;
