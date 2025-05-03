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
import { useCart } from "./cartContext";
import NothingShoppingBagContent from "./NothingShoppingBagContent";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import ConfirmationModal from "@/modal/ConfirmationModal";

type CartItem = {
  id: string;
  title: string;
  price: string;
  images: string[];
  quantity: number;
  selectedSize?: string;
  seller?: string;
  originalPrice?: string;
  isSelected?: boolean;
};

const ProductInfoSection: React.FC = () => {
  const {
    cartItems,
    toggleItemSelection,
    removeFromCart,
    deleteSelectedItems,
    moveToWishlist,
  } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);

  const selectedItems = cartItems.filter((item) => item.isSelected).length;
  const totalPrice = cartItems
    .filter((item) => item.isSelected)
    .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
    .toLocaleString("en-IN");

  const toggleAllItems = () => {
    const shouldSelect = selectedItems === 0;
    cartItems.forEach((item) => {
      if (item.isSelected !== shouldSelect) {
        toggleItemSelection(item.id);
      }
    });
  };

  const handleRemoveClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setModalVisible(true);
  };

  const confirmRemove = () => {
    if (selectedItemId) {
      removeFromCart(selectedItemId);
    }
    setModalVisible(false);
    setSelectedItemId(null);
  };

  const handleMoveToWishlist = () => {
    if (selectedItemId) {
      moveToWishlist([selectedItemId]);
    }
    setModalVisible(false);
    setSelectedItemId(null);
  };

  const handleDeleteSelectedClick = () => {
    if (selectedItems > 0) {
      setDeleteAllModalVisible(true);
    }
  };

  const confirmDeleteSelected = () => {
    deleteSelectedItems();
    setDeleteAllModalVisible(false);
  };

  const moveSelectedToWishlist = () => {
    const selectedItemIds = cartItems
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    if (selectedItemIds.length > 0) {
      moveToWishlist(selectedItemIds);
    }
    setDeleteAllModalVisible(false);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const discount = item.originalPrice
      ? (
          ((parseFloat(item.originalPrice) - parseFloat(item.price)) /
            parseFloat(item.originalPrice)) *
          100
        ).toFixed(0) + "% OFF"
      : null;

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
                  selectedItems > 0 ? staticColors.offerColor : "#000000",
                backgroundColor: item.isSelected
                  ? staticColors.offerColor
                  : staticColors.whiteColor,
              },
            ]}
            onPress={() => toggleItemSelection(item.id)}
          >
            {item.isSelected && (
              <Ionicons
                name="checkmark"
                size={16}
                color={staticColors.whiteColor}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.cartItemDetails}>
          <View style={styles.titleContainer}>
            <Text style={styles.cartItemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <TouchableOpacity
              style={styles.cutIcon}
              onPress={() => handleRemoveClick(item.id)}
            >
              <Ionicons
                name="close-outline"
                size={22}
                color={staticColors.cardTitleColor}
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
                  color={staticColors.cardTitleColor}
                />
              </View>
            )}
            <View style={styles.qtyContainer}>
              <Text style={styles.sizeQtyText}>Qty: {item.quantity}</Text>
              <Ionicons
                name="chevron-down"
                size={12}
                color={staticColors.cardTitleColor}
              />
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.cartItemPrice}>
              ₹{parseFloat(item.price).toLocaleString("en-IN")}
            </Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>
                ₹{parseFloat(item.originalPrice).toLocaleString("en-IN")}
              </Text>
            )}
            {discount && <Text style={styles.discountText}>{discount}</Text>}
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
                  ? staticColors.offerColor
                  : staticColors.shadowColor,
              backgroundColor:
                selectedItems > 0
                  ? staticColors.offerColor
                  : staticColors.whiteColor,
            },
          ]}
        >
          {selectedItems === cartItems.length && cartItems.length > 0 && (
            <Ionicons
              name="checkmark"
              size={17}
              color={staticColors.whiteColor}
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
            color={staticColors.cardTitleColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={handleDeleteSelectedClick}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={staticColors.cardTitleColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons
            name="heart-outline"
            size={20}
            color={staticColors.cardTitleColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <NothingShoppingBagContent />
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

      <ConfirmationModal
        visible={modalVisible}
        title="Add to Wishlist"
        message="Do you want to add this item to your wishlist?"
        firstButtonText="ADD TO WISHLIST"
        secondButtonText="REMOVE"
        onFirstButtonPress={handleMoveToWishlist}
        onSecondButtonPress={confirmRemove}
      />

      <ConfirmationModal
        visible={deleteAllModalVisible}
        title="Add to Wishlist"
        message={`Do you want to add ${selectedItems} item(s) to your wishlist?`}
        firstButtonText="ADD TO WISHLIST"
        secondButtonText="REMOVE"
        onFirstButtonPress={moveSelectedToWishlist}
        onSecondButtonPress={confirmDeleteSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.backgroundSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.p20,
    backgroundColor: staticColors.whiteColor,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCheckbox: {
    ...spacingStyles.mr5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: staticColors.cardTitleColor,
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
    backgroundColor: staticColors.whiteColor,
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
    fontSize: 14,
    fontWeight: "bold",
    color: staticColors.cardTitleColor,
    marginBottom: 5,
  },
  sellerText: {
    fontSize: 12,
    color: staticColors.shadowColor,
    marginBottom: 5,
  },
  sizeQtyContainer: {
    flexDirection: "row",
    ...spacingStyles.mb5,
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.backgroundSecondary,
    ...spacingStyles.px5,
    ...spacingStyles.py5,
    borderRadius: 4,
    ...spacingStyles.mr10,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.backgroundSecondary,
    ...spacingStyles.px5,
    ...spacingStyles.py5,
    borderRadius: 4,
    ...spacingStyles.mr10,
  },
  sizeQtyText: {
    fontSize: 12,
    color: staticColors.cardTitleColor,
    marginRight: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: staticColors.cardTitleColor,
    ...spacingStyles.mr10,
  },
  originalPrice: {
    fontSize: 12,
    color: staticColors.lightGray,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountText: {
    fontSize: 12,
    color: staticColors.offerColor,
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
    fontSize: 12,
    color: staticColors.lightGray,
    ...spacingStyles.ml5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cutIcon: {
    marginLeft: 5,
  },
});

export default ProductInfoSection;
