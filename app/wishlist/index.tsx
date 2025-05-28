import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchWishlist,
  removeWishlistItem,
  moveToCart,
} from "@/store/wishlist/wishlistSlice";
import { fetchCartItemsApi } from "@/store/cart/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import { WishlistItem } from "@/types/types";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";

const WishlistScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.wishlist
  );

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    dispatch(fetchWishlist()).then((result) => {
      if (fetchWishlist.rejected.match(result)) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.payload as string,
        });
      }
    });
  }, [dispatch]);

  const handleRemoveItem = (id: string) => {
    if (!id) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid item ID",
      });
      return;
    }
    dispatch(removeWishlistItem(id)).then((result) => {
      if (removeWishlistItem.fulfilled.match(result)) {
        Toast.show({
          type: "success",
          text1: "Item removed from wishlist",
        });
      } else if (removeWishlistItem.rejected.match(result)) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.payload as string,
        });
      }
    });
  };

  const handleMoveToBag = (id: string) => {
    if (!id) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Invalid item ID",
      });
      return;
    }
    dispatch(moveToCart(id)).then((result) => {
      if (moveToCart.fulfilled.match(result)) {
        Toast.show({
          type: "success",
          text1: "Item moved to cart",
        });
        dispatch(fetchCartItemsApi()).then((cartResult) => {
          if (fetchCartItemsApi.fulfilled.match(cartResult)) {
            router.navigate("/cart");
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to fetch cart items",
            });
          }
        });
      } else if (moveToCart.rejected.match(result)) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.payload as string,
        });
      }
    });
  };

  const clothingItems = items
    .filter((item: WishlistItem) => item.id)
    .map((item: WishlistItem) => {
      const selectedImage =
        item.product.gallery?.find(
          (galleryItem) => galleryItem.color === item.selected_color_name
        )?.img_url || item.product.thumbnail_url;

      return {
        id: item.id,
        image: selectedImage,
        brand: item.product.title || "",
        price: item.product.final_price,
        originalPrice: item.product.price,
        discount: `${item.product.discount_percent}% OFF`,
        color: item.selected_color_name || item.selected_color || "N/A",
        size: item.selected_size || "N/A",
        reviews: item.product.reviews || [],
      };
    });

  const renderWishlistItem = ({
    item,
  }: {
    item: (typeof clothingItems)[0] & { reviews?: { rating: string }[] };
  }) => {
    if (!item.id) return null;

    const reviews = item.reviews || [];
    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce(
              (sum, review) => sum + parseFloat(review.rating),
              0
            ) / reviews.length
          ).toFixed(1)
        : "N/A";

    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {reviews.length > 0 && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{averageRating}</Text>
              <Ionicons name="star" size={10} color={staticColors.darkGreen} />
            </View>
          )}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Ionicons name="close" size={16} color={staticColors.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.brand}>{item.brand}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
            <Text style={styles.discount}>({item.discount})</Text>
          </View>
          <TouchableOpacity
            style={styles.moveToBagButton}
            onPress={() => handleMoveToBag(item.id)}
          >
            <Text style={styles.moveToBagText}>MOVE TO BAG</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color={staticColors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <Text style={styles.headerSubtitle}>{items.length} Items</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons
              name="bag-outline"
              size={20}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={staticColors.primary}
          style={styles.loader}
        />
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}

      {!loading && !error && items.length === 0 && (
        <View style={styles.emptyWishlistContainer}>
          <Text style={styles.emptyWishlistTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptyWishlistSubtitle}>
            Save items that you like in your wishlist. Review them anytime and
            easily move them to the bag.
          </Text>
          <TouchableOpacity
            style={styles.shopNowButton}
            onPress={() => router.navigate("/(tabs)")}
          >
            <Text style={styles.shopNowText}>SHOP NOW</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && items.length > 0 && (
        <FlatList
          data={clothingItems}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item.id || `fallback-${Math.random()}`}
          numColumns={2}
          contentContainerStyle={styles.flatList}
        />
      )}
      <Toast />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");
const itemWidth = width / 2 - 10;
const itemImageHeight = itemWidth * 1.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.p10,
    borderBottomWidth: 1,
    borderBottomColor: staticColors.borderLight,
  },
  headerTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mx10,
  },
  headerSubtitle: {
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
  },
  headerIcons: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  flatList: {
    ...spacingStyles.py5,
  },
  itemContainer: {
    flex: 0,
    width: itemWidth,
    ...spacingStyles.m5,
    borderRadius: borderRadius.r5,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    height: itemImageHeight,
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    borderWidth: 1,
    backgroundColor: staticColors.lightGray,
    borderColor: staticColors.borderLight,
    borderRadius: borderRadius.circle,
    ...spacingStyles.p2,
  },
  itemDetails: {
    ...spacingStyles.pt2,
  },
  brand: {
    ...spacingStyles.px10,
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    fontWeight: fontWeights.medium,
    ...spacingStyles.my2,
  },
  priceContainer: {
    ...spacingStyles.px10,
    ...spacingStyles.pb10,
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mr5,
  },
  originalPrice: {
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
    textDecorationLine: "line-through",
    ...spacingStyles.mr5,
  },
  discount: {
    fontSize: fontSizes.s,
    color: staticColors.discountText,
  },
  moveToBagButton: {
    ...spacingStyles.mt10,
    ...spacingStyles.p5,
    borderTopWidth: 1,
    borderTopColor: staticColors.borderLight,
    alignItems: "center",
  },
  moveToBagText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.black,
    color: staticColors.primary,
    ...spacingStyles.py5,
  },
  loader: {
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  errorText: {
    color: staticColors.errorColor,
    textAlign: "center",
    ...spacingStyles.mt25,
    fontSize: fontSizes.base,
  },
  emptyWishlistContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.p20,
  },
  emptyWishlistTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
    ...spacingStyles.mb10,
  },
  emptyWishlistSubtitle: {
    fontSize: fontSizes.md,
    color: staticColors.textLightGray,
    lineHeight: 25,
    textAlign: "center",
    ...spacingStyles.mb25,
  },
  shopNowButton: {
    backgroundColor: staticColors.white,
    ...spacingStyles.px25,
    ...spacingStyles.py10,
    borderRadius: borderRadius.r5,
    borderWidth: 1,
    borderColor: staticColors.primary,
    alignItems: "center",
  },
  shopNowText: {
    fontSize: fontSizes.sm,
    color: staticColors.primary,
    fontWeight: fontWeights.semiBold,
  },
  ratingContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.lightGray,
    ...spacingStyles.py2,
    ...spacingStyles.px10,
    borderRadius: borderRadius.r10,
    gap: gapSizes.sm,
  },
  ratingText: {
    fontSize: fontSizes.sm,
    color: staticColors.primary,
    fontWeight: fontWeights.semiBold,
  },
});

export default WishlistScreen;
