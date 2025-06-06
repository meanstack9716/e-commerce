import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {fontSizes, fontWeights} from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { textTruncate } from "@/utils/textTruncate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  deleteSelectedItems,
  fetchCartItemsApi,
  moveToWishlist,
  removeFromCart,
  removeFromCartApi,
  toggleItemSelection,
} from "@/store/cart/cartSlice";
import { CartItem } from "@/types/types";
import EmptyShoppingBagMessage from "./EmptyShoppingBagMessage";
import ProductDeleteConfirmationModal from "@/modal/ProductDeleteConfirmationModal";
import QuantitySelectionModal from "@/modal/QuantitySelectionModal";
import SizeSelectionModal from "@/modal/SizeSelectionModal";
import borderRadius from "@/style/borderRadius";

const ProductInfoSection: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(
    null
  );
  const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);
  const [selectedCartItemForSize, setSelectedCartItemForSize] =
    useState<CartItem | null>(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [confirmationModalDetails, setConfirmationModalDetails] = useState<{
    message: string;
    onPrimaryAction: () => void;
    onSecondaryAction: () => void;
  }>({
    message: "",
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  });

  const selectedItems = cartItems.filter((item) => item.isSelected).length;
  const totalPrice = cartItems
    .filter((item) => item.isSelected)
    .reduce((sum, item) => sum + item.final_price * (item.quantity || 1), 0)
    .toLocaleString("en-IN");

  const toggleAllItems = () => {
    const shouldSelect = selectedItems === 0;
    cartItems.forEach((item) => {
      if (item.isSelected !== shouldSelect) {
        dispatch(
          toggleItemSelection({
            id: item.id,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            isAuthenticated,
          })
        );
      }
    });
  };

  const handleRemoveItemConfirmationModal = (item: CartItem) => {
    setConfirmationModalDetails({
      message: "Are you sure you want to move this item from bag?",
      onPrimaryAction: () => {
        // dispatch(
        //   moveToWishlist({
        //     ids: [item.id],
        //     selectedSizes: [item.selectedSize || ""],
        //     selectedColors: [item.selectedColor || ""],
        //     isAuthenticated,
        //   })
        // );
        setIsConfirmationModalVisible(false);
      },
      onSecondaryAction: async () => {
        setIsLoading(true);
        try {
          if (isAuthenticated) {
            await dispatch(
              removeFromCartApi({
                ids: [item.id],
              })
            ).unwrap();

            dispatch(
              removeFromCart({
                id: item.id,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                isAuthenticated,
              })
            );

            await dispatch(fetchCartItemsApi()).unwrap();
          } else {
            dispatch(
              removeFromCart({
                id: item.id,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                isAuthenticated,
              })
            );
          }
        } catch (error) {
          console.error("Failed to remove item:", error);
        } finally {
          setIsLoading(false);
          setIsConfirmationModalVisible(false);
        }
      },
    });

    setIsConfirmationModalVisible(true);
  };

  const handleDeleteSelectedProduct = () => {
    if (selectedItems > 0) {
      const selectedItemIds = cartItems
        .filter((item) => item.isSelected)
        .map((item) => item.id);
      const selectedSizes = cartItems
        .filter((item) => item.isSelected)
        .map((item) => item.selectedSize || "");
      const selectedColors = cartItems
        .filter((item) => item.isSelected)
        .map((item) => item.selectedColor || "");

      setConfirmationModalDetails({
        message: `Are you sure you want to remove ${selectedItems} item(s) from bag?`,
        onPrimaryAction: () => {
          // dispatch(
          //   moveToWishlist({
          //     ids: selectedItemIds,
          //     selectedSizes,
          //     selectedColors,
          //     isAuthenticated,
          //   })
          // );
          setIsConfirmationModalVisible(false);
        },
        onSecondaryAction: async () => {
          setIsLoading(true);
          try {
            if (isAuthenticated) {
              await dispatch(
                removeFromCartApi({
                  ids: selectedItemIds,
                })
              ).unwrap();

              dispatch(deleteSelectedItems({ isAuthenticated }));

              await dispatch(fetchCartItemsApi()).unwrap();
            } else {
              dispatch(deleteSelectedItems({ isAuthenticated }));
            }
          } catch (error) {
            console.error("Failed to delete selected items:", error);
          } finally {
            setIsLoading(false);
            setIsConfirmationModalVisible(false);
          }
        },
      });
      setIsConfirmationModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsConfirmationModalVisible(false);
    setConfirmationModalDetails({
      message: "",
      onPrimaryAction: () => {},
      onSecondaryAction: () => {},
    });
  };

  const handleOpenQuantityModal = (item: CartItem) => {
    setSelectedCartItem(item);
    setIsQuantityModalVisible(true);
  };

  const handleOpenSizeModal = (item: CartItem) => {
    setSelectedCartItemForSize(item);
    setIsSizeModalVisible(true);
  };
  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <TouchableOpacity
        style={styles.cartItem}
        onPress={() =>
          router.navigate({
            pathname: "/ProductDetails",
            params: { id: item.productId},
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.images[0] }}
            style={styles.cartItemImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[
              styles.checkboxImage,
              {
                borderColor:
                  selectedItems > 0
                    ? staticColors.discountText
                    : staticColors.black,
                backgroundColor: item.isSelected
                  ? staticColors.discountText
                  : staticColors.white,
              },
            ]}
            onPress={() =>
              dispatch(
                toggleItemSelection({
                  id: item.id,
                  selectedSize: item.selectedSize,
                  selectedColor: item.selectedColor,
                  isAuthenticated,
                })
              )
            }
          >
            {item.isSelected && (
              <Ionicons name="checkmark" size={16} color={staticColors.white} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.cartItemDetails}>
          <View style={styles.titleContainer}>
            <Text style={styles.cartItemTitle} numberOfLines={1}>
              {textTruncate(item.title, 2)}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveItemConfirmationModal(item)}
            >
              <Ionicons
                name="close-outline"
                size={22}
                color={staticColors.textSubtitle}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.cartItemDescription} numberOfLines={1}>
            {textTruncate(item.description, 5)}
          </Text>
          <Text numberOfLines={1} style={styles.cartSellerItem}>
            Sold by: {item.seller?.business_name || "Unknown Seller"}
          </Text>

          <View style={styles.sizeQtyContainer}>
            {item.selectedSize && (
              <TouchableOpacity
                style={styles.sizeContainer}
                onPress={() => handleOpenSizeModal(item)}
              >
                <Text style={styles.sizeQtyText}>
                  Size: {item.selectedSize}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={12}
                  color={staticColors.textSubtitle}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.qtyContainer}
              onPress={() => handleOpenQuantityModal(item)}
            >
              <Text style={styles.sizeQtyText}>Qty: {item.quantity || 1}</Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={staticColors.textSubtitle}
              />
            </TouchableOpacity>

            {item.selectedColor && (
              <View style={styles.colorContainer}>
                <Text style={styles.sizeQtyText}>Color: {item.colorName}</Text>
              </View>
            )}
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.cartItemPrice}>₹{item.final_price}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            {item.discount_percent && (
              <LinearGradient
                colors={[staticColors.sorftPink, staticColors.lightPink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.discountTextGradient}
              >
                <Text style={styles.discountText}>
                  {item.discount_percent} % OFF
                </Text>
              </LinearGradient>
            )}
          </View>

          <View style={styles.returnPolicy}>
            <Ionicons
              name="refresh-outline"
              size={12}
              color={staticColors.darkGray}
            />
            <Text style={styles.returnPolicyText}>
              <Text style={styles.dayText}>7 days</Text> return available
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={toggleAllItems}
          style={[
            styles.checkbox,
            {
              borderColor:
                selectedItems > 0
                  ? staticColors.discountText
                  : staticColors.shadowColor,
              backgroundColor:
                selectedItems > 0
                  ? staticColors.discountText
                  : staticColors.white,
            },
          ]}
        >
          {selectedItems === cartItems.length && cartItems.length > 0 ? (
            <Ionicons
              name="checkmark"
              size={17}
              color={staticColors.white}
              style={styles.headerCheckbox}
            />
          ) : selectedItems > 0 && selectedItems < cartItems.length ? (
            <Ionicons
              name="remove-outline"
              size={17}
              color={staticColors.white}
              style={styles.headerCheckbox}
            />
          ) : null}
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {selectedItems}/{cartItems.length} ITEMS SELECTED (₹{totalPrice})
        </Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color={staticColors.textSubtitle}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={handleDeleteSelectedProduct}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={staticColors.textSubtitle}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons
            name="heart-outline"
            size={20}
            color={staticColors.textSubtitle}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <EmptyShoppingBagMessage />
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item, index) =>
            item.cartItemId || `${item.id}-${index}`
          }
          contentContainerStyle={styles.cartList}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={10}
        />
      )}

      <ProductDeleteConfirmationModal
        visible={isConfirmationModalVisible}
        title="Add to Wishlist"
        message={confirmationModalDetails.message}
        // primaryButtonText="ADD TO WISHLIST"
        primaryButtonText="CANCEL"
        secondaryButtonText="REMOVE"
        onFirstButtonPress={confirmationModalDetails.onPrimaryAction}
        onSecondButtonPress={confirmationModalDetails.onSecondaryAction}
        onClose={handleCloseModal}
        isLoading={isLoading}
      />

      {selectedCartItem && (
        <QuantitySelectionModal
          visible={isQuantityModalVisible}
          onClose={() => setIsQuantityModalVisible(false)}
          item={selectedCartItem}
        />
      )}

      {selectedCartItemForSize && (
        <SizeSelectionModal
          visible={isSizeModalVisible}
          onClose={() => setIsSizeModalVisible(false)}
          item={selectedCartItemForSize}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.p15,
    backgroundColor: staticColors.white,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartItemDescription: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
  },
  cartSellerItem: {
    fontSize: fontSizes.xs,
    color: staticColors.textSecondary,
    ...spacingStyles.mt2,
    ...spacingStyles.mb5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCheckbox: {
    ...spacingStyles.mr5,
  },
  headerText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: staticColors.textSubtitle,
  },
  headerRight: {
    flexDirection: "row",
  },
  headerIcon: {
    ...spacingStyles.ml15,
  },
  cartList: {
    ...spacingStyles.pb10,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r8,
    ...spacingStyles.p8,
    ...spacingStyles.m10,
  },
  imageContainer: {
    position: "relative",
  },
  cartItemImage: {
    width: 115,
    height: 140,
    borderRadius: borderRadius.r8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.r4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mr10,
  },
  checkboxImage: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.r4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 5,
    left: 5,
  },
  cartItemDetails: {
    flex: 1,
    ...spacingStyles.ml10,
    gap: 2
  },
  cartItemTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.textSecondary,
    ...spacingStyles.mb5,
  },

  Text: {
    fontSize: fontSizes.xs,
    color: staticColors.shadowColor,
    ...spacingStyles.mb5,
  },
  sizeQtyContainer: {
    flexDirection: "row",
    ...spacingStyles.mb5,
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.px5,
    ...spacingStyles.py5,
    borderRadius: borderRadius.r4,
    ...spacingStyles.mr5,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.px5,
    ...spacingStyles.py5,
    borderRadius: borderRadius.r4,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.px5,
    ...spacingStyles.py5,
    borderRadius: borderRadius.r4,
    ...spacingStyles.mr5,
  },
  sizeQtyText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: staticColors.textSubtitle,
    ...spacingStyles.mr5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb5,
  },
  cartItemPrice: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.textSubtitle,
    ...spacingStyles.mr5,
  },
  price: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
    textDecorationLine: "line-through",
    ...spacingStyles.mr10,
  },
  discountTextGradient: {
    ...spacingStyles.py2,
    ...spacingStyles.px5,
    borderRadius: borderRadius.r4,
  },
  discountText: {
    fontSize: fontSizes.s,
    color: staticColors.discountText,
  },
  returnPolicy: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb5,
  },
  returnPolicyText: {
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
    ...spacingStyles.ml5,
  },
  dayText: {
    fontWeight:fontWeights.semiBold,
  },
});

export default ProductInfoSection;
