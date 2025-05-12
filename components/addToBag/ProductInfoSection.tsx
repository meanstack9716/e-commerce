import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import EmptyShoppingBagMessage from "./EmptyShoppingBagMessage";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import ProductDeleteConfirmationModal from "@/modal/ProductDeleteConfirmationModal";
import fontSizes from "@/style/fontSizes";
import { textTruncate } from "@/utils/textTruncate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  deleteSelectedItems,
  moveToWishlist,
  removeFromCart,
  toggleItemSelection,
} from "@/store/cart/cartSlice";
import { Product } from "@/types/types";

const ProductInfoSection: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

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
    .reduce(
      (sum, item) => sum + parseFloat(item.price) * (item.quantity || 1),
      0
    )
    .toLocaleString("en-IN");

  const toggleAllItems = () => {
    const shouldSelect = selectedItems === 0;
    cartItems.forEach((item) => {
      if (item.isSelected !== shouldSelect) {
        dispatch(toggleItemSelection({ id: item.id, isAuthenticated }));
      }
    });
  };

  const handleRemoveItemConfirmationModal = (itemId: string) => {
    setConfirmationModalDetails({
      message: "Do you want to add this item to your wishlist?",
      onPrimaryAction: () => {
        dispatch(moveToWishlist({ ids: [itemId], isAuthenticated }));
        setIsConfirmationModalVisible(false);
      },
      onSecondaryAction: () => {
        dispatch(removeFromCart({ id: itemId, isAuthenticated }));
        setIsConfirmationModalVisible(false);
      },
    });
    setIsConfirmationModalVisible(true);
  };

  const handleDeleteSelectedProduct = () => {
    if (selectedItems > 0) {
      const selectedItemIds = cartItems
        .filter((item) => item.isSelected)
        .map((item) => item.id);
      setConfirmationModalDetails({
        message: `Do you want to add ${selectedItems} item(s) to your wishlist?`,
        onPrimaryAction: () => {
          dispatch(moveToWishlist({ ids: selectedItemIds, isAuthenticated }));
          setIsConfirmationModalVisible(false);
        },
        onSecondaryAction: () => {
          dispatch(deleteSelectedItems({ isAuthenticated }));
          setIsConfirmationModalVisible(false);
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

  const renderCartItem = ({ item }: { item: Product }) => {
    return (
      <View style={styles.cartItem}>
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
              dispatch(toggleItemSelection({ id: item.id, isAuthenticated }))
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
              {textTruncate(item.title, 4)}
            </Text>
            <TouchableOpacity
              style={styles.cutIcon}
              onPress={() => handleRemoveItemConfirmationModal(item.id)}
            >
              <Ionicons
                name="close-outline"
                size={22}
                color={staticColors.textSubtitle}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={styles.sellerText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Sold by: {item.seller || "Unknown Seller"}
          </Text>

          <View style={styles.sizeQtyContainer}>
            {item.selectedSize && (
              <View style={styles.sizeContainer}>
                <Text style={styles.sizeQtyText}>
                  Size: {item.selectedSize}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={12}
                  color={staticColors.textSubtitle}
                />
              </View>
            )}
            <View style={styles.qtyContainer}>
              <Text style={styles.sizeQtyText}>Qty: {item.quantity || 1}</Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={staticColors.textSubtitle}
              />
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.cartItemPrice}>
              ₹{parseFloat(item.price).toLocaleString("en-IN")}
            </Text>
            {item.discount && (
              <Text style={styles.discountText}>{item.discount}</Text>
            )}
          </View>

          <View style={styles.returnPolicy}>
            <Ionicons
              name="refresh-outline"
              size={12}
              color={staticColors.darkGray}
            />
            <Text style={styles.returnPolicyText}>7 days return available</Text>
          </View>
        </View>
      </View>
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
          {selectedItems === cartItems.length && cartItems.length > 0 && (
            <Ionicons
              name="checkmark"
              size={17}
              color={staticColors.white}
              style={styles.headerCheckbox}
            />
          )}
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
          keyExtractor={(item) => item.id}
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
        primaryButtonText="ADD TO WISHLIST"
        secondaryButtonText="REMOVE"
        onFirstButtonPress={confirmationModalDetails.onPrimaryAction}
        onSecondButtonPress={confirmationModalDetails.onSecondaryAction}
        onClose={handleCloseModal}
      />
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
    ...spacingStyles.p20,
    backgroundColor: staticColors.white,
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
    fontWeight: "500",
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
    borderRadius: 8,
    ...spacingStyles.p10,
    ...spacingStyles.m10,
  },
  imageContainer: {
    position: "relative",
  },
  cartItemImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mr10,
  },
  checkboxImage: {
    width: 20,
    height: 20,
    borderRadius: 4,
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
  },
  cartItemTitle: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    color: staticColors.textSecondary,
    ...spacingStyles.mb5,
  },
  sellerText: {
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
    borderRadius: 4,
    ...spacingStyles.mr10,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.px5,
    ...spacingStyles.py5,
    borderRadius: 4,
    ...spacingStyles.mr10,
  },
  sizeQtyText: {
    fontSize: fontSizes.xs,
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
    fontWeight: "bold",
    color: staticColors.textSubtitle,
    ...spacingStyles.mr10,
  },
  discountText: {
    fontSize: fontSizes.xs,
    color: staticColors.discountText,
    backgroundColor: staticColors.lightPink,
    ...spacingStyles.py5,
    ...spacingStyles.px5,
    borderRadius: 4,
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cutIcon: {
    ...spacingStyles.ml5,
  },
});

export default ProductInfoSection;
