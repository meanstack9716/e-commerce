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
import { AppDispatch, RootState } from "@/store/store";
import {
  clearSelectedProduct,
  fetchProductById,
} from "@/store/product/productsSlice";
import { addToCartApi, addToCartLocally } from "@/store/cart/cartSlice";
import { useAppSelector } from "@/store/hooks";
import colors from "@/style/staticColors";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import MegaDealBadge from "@/components/productDetails/MegaDealBadge";
import SizeSelector from "@/components/productDetails/SizeSelector";
import SimilarProducts from "@/components/productDetails/SimilarProducts";
import ProductList from "@/components/productDetails/ProductList";
import BrandRating from "@/components/productDetails/BrandRating";
import DeliveryCheck from "@/components/productDetails/DeliveryCheck";
import ProductActionButtons from "@/components/productDetails/ProductActionButtons";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import ReturnPolicy from "./ReturnPolicy";
import { Product } from "../../types/types";
import ViewSimilarModal from "@/modal/ViewSimilarModal";
import borderRadius from "@/style/borderRadius";
import { LinearGradient } from "expo-linear-gradient";
import RatingReview from "@/components/productDetails/RatingReview";
import { fontFamilies } from "@/style/fontFamilies";

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
      }
      router.push("/cart");
    }
  };

  if (loading || error) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <FullScreenLoader visible={loading} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dummyData = [{ key: "dummy" }];

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>
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
                ).map((_, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        isActive && styles.activeDot,
                        {
                          backgroundColor: isActive
                            ? staticColors.primaryBlue
                            : staticColors.RoyalBlue,
                        },
                      ]}
                    />
                  );
                })}
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
              <View style={styles.priceContainer}>
                <View>
                  <Text style={styles.discountedPrice}>
                    ₹{product.final_price}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.price}>₹{product.price}</Text>
                  <LinearGradient
                    colors={[staticColors.BoldPink, staticColors.HotRed]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.discountWrapper}
                  >
                    <Text style={styles.discountText}>
                      ({product.discount_percent})%
                    </Text>
                  </LinearGradient>
                </View>
              </View>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
            {/* <MegaDealBadge /> */}
            <SizeSelector
              product={product}
              onColorSelect={handleColorSelect}
              onSizeSelect={setSelectedSize}
              price={product.final_price}
            />
            {product.reviews && product.reviews.length > 0 ? (
              <RatingReview
                review={product.reviews[0]}
                productId={product.id}
              />
            ) : (
              <></>
            )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
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
  headerRight: {
    flexDirection: "row",
    gap: gapSizes.md,
  },
  iconButton: {
    ...spacingStyles.ml15,
  },
  image: {
    width: screenWidth,
    height: 430,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    top: -15,
    gap: gapSizes.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mx2,
  },
  activeDot: {
    width: 40,
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
    borderRadius: borderRadius.r10,
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
    borderRadius: borderRadius.r10,
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
    ...spacingStyles.pt5,
    ...spacingStyles.pb10,
  },
  row: {
    flexDirection: "row",
    gap: gapSizes.md,
    ...spacingStyles.mb10,
  },
  title: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayeBold,
    ...spacingStyles.pb2,
  },
  description: {
    fontFamily: fontFamilies.nunitoSans,
    fontWeight: fontWeights.normal,
    fontSize: fontSizes.sm,
    color: staticColors.black,
  },
  priceContainer: {
    flexDirection: "column",
  },
  discountedPrice: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.raleway,
    fontWeight: fontWeights.extraBold,
    color: colors.primary,
  },
  price: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.raleway,
    fontWeight: fontWeights.extraBold,
    color: colors.PastelRose,
    textDecorationLine: "line-through",
  },
  discountWrapper: {
    paddingHorizontal: 7,
    paddingTop: 4,
    ...spacingStyles.pb2,
    borderRadius: borderRadius.r5,
    alignSelf: "flex-start",
  },

  discountText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.raleway,
    fontWeight: fontWeights.bold,
    color: staticColors.white,
  },
  heading: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
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
    borderRadius: borderRadius.r24,
  },
  backToTopText: {
    color: colors.white,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.ml5,
  },
});

export default ProductDetailsScreen;
