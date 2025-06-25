import React, { useCallback, useEffect, useState } from "react";
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
import { router, useFocusEffect } from "expo-router";
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
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const [isLoading, setIsLoading] = useState(true);

  const handleBack = () => {
    router.back();
  };

  useFocusEffect(
    useCallback(() => {
      const loadWishlistData = async () => {
        try {
          if (isAuthenticated && token) {
            await dispatch(fetchWishlist()).unwrap();
          }
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error as string,
          });
        } finally {
          setIsLoading(false);
        }
      };

      loadWishlistData();
    }, [isAuthenticated, token, dispatch])
  );

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
      };
    });

  const renderWishlistItem = ({
    item,
  }: {
    item: (typeof clothingItems)[0] & { reviews?: { rating: string }[] };
  }) => {
    if (!item.id) return null;
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <TouchableOpacity
            style={styles.removeButtonOverlay}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color={staticColors.brightRed}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.itemDetailsNew}>
          <Text style={styles.itemTitle}>{item.brand}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>${item.price}</Text>
            {item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>${item.originalPrice}</Text>
            )}
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionButton}>{item.color}</Text>
            <Text style={styles.optionButton}>{item.size}</Text>
            <TouchableOpacity
              style={styles.cartIconWrapper}
              onPress={() => handleMoveToBag(item.id)}
            >
              <Ionicons name="cart-outline" size={20} color="black" />
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
          contentContainerStyle={styles.flatList}
        />
      )}
      <Toast />
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.p10,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
    ...spacingStyles.ml20,
  },
  flatList: {
    ...spacingStyles.py5,
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: "row",
    borderRadius: borderRadius.r5,
    marginVertical: 6,
    alignItems: "center",
    width: "100%",
    backgroundColor: staticColors.white,
    marginBottom: 10,
  },
  imageContainer: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.mr15,
    padding: 5,
    position: "relative",
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 130,
    height: 125,
    borderRadius: borderRadius.r10,
  },
  removeButtonOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 28,
    height: 28,
    borderRadius: borderRadius.r14,
    backgroundColor: staticColors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  itemDetailsNew: {
    flex: 1,
    gap: 8,
  },
  itemTitle: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    ...spacingStyles.mb4,
    fontFamily: fontFamilies.ralewayBold,
  },
  itemPrice: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    ...spacingStyles.mb8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  originalPrice: {
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
    textDecorationLine: "line-through",
    ...spacingStyles.mb4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionButton: {
    ...spacingStyles.py6,
    ...spacingStyles.px15,
    borderRadius: borderRadius.r5,
    backgroundColor: "#f0f0ff",
    fontSize: fontSizes.sm,
    color: "#333",
  },
  cartIconWrapper: {
    marginLeft: "auto",
    ...spacingStyles.p5,
    borderRadius: borderRadius.r5,
    borderWidth: 1,
    backgroundColor: staticColors.white,
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: staticColors.DarkRed,
    textAlign: "center",
    ...spacingStyles.p10,
  },
});

export default WishlistScreen;
