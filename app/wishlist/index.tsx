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
import { fontFamilies } from "@/style/fontFamilies";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";

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
  console.log(clothingItems, ">>>>>>")
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
          <TouchableOpacity
            style={styles.removeButtonOverlay}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Ionicons name="trash" size={20} color="red" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemDetailsNew}>
          <Text style={styles.itemTitle}>{item.brand}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>

          <View style={styles.optionRow}>
            <Text style={styles.optionButton}>Pink</Text>
            <Text style={styles.optionButton}>M</Text>
            <TouchableOpacity
              style={styles.cartIconWrapper}
              onPress={() => handleMoveToBag(item.id)}
            >
              <Ionicons name="add-outline" size={20} color="#2A52BE" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

    );
  };

  return (
    <SafeAreaViewWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color={staticColors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
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
    </SafeAreaViewWrapper>
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
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
    ...spacingStyles.ml10,
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

  // Final cleaned-up itemContainer (horizontal card layout)
  itemContainer: {
    flexDirection: "row",
    borderRadius: borderRadius.r5,
    padding: 10,
    marginVertical: 6,

    alignItems: "center",
    width: "100%"
  },

  imageContainer: {
    backgroundColor: staticColors.white,
    shadowColor: staticColors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: "relative",
    ...spacingStyles.mr15
  },

  image: {
    width: 120,
    height: 110,
    borderRadius: 10,
  },

  removeButtonOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: staticColors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
  },

  itemDetailsNew: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 13,
    color: staticColors.darkGray,
    marginBottom: 4,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    marginBottom: 8,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  optionButton: {
    ...spacingStyles.py6,
    ...spacingStyles.px15,
    borderRadius: 2,
    backgroundColor: "#f0f0ff",
    fontSize: fontSizes.base,
    color: "#333",
  },

  cartIconWrapper: {
    marginLeft: "auto",
    padding: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#2A52BE",
    backgroundColor: "#fff",
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
});


export default WishlistScreen;
