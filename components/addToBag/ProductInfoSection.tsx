import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
  const { cartItems, clearCart, toggleItemSelection } = useCart();

  // Calculate total price and selected items
  const selectedItems = cartItems.filter(item => item.isSelected).length;
  const totalPrice = cartItems
    .filter(item => item.isSelected)
    .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
    .toLocaleString("en-IN");

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
        {/* Image and Checkbox Container */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.images[0] }}
            style={styles.cartItemImage}
            resizeMode="cover"
          />
          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleItemSelection(item.id)}
          >
            <Ionicons
              name={item.isSelected ? "checkmark" : "square-outline"}
              size={16}
              color={item.isSelected ? "#FF3F6C" : "#666"}
            />
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={styles.cartItemDetails}>
          <Text style={styles.cartItemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.sellerText} numberOfLines={1} ellipsizeMode="tail">
            Sold by: {item.seller || "Unknown Seller"}
          </Text>

          {/* Size and Quantity */}
          <View style={styles.sizeQtyContainer}>
            {item.selectedSize && (
              <View style={styles.sizeContainer}>
                <Text style={styles.sizeQtyText}>
                  Size: {item.selectedSize}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#333" />
              </View>
            )}
            <View style={styles.qtyContainer}>
              <Text style={styles.sizeQtyText}>
                Qty: {item.quantity}
              </Text>
              <Ionicons name="chevron-down" size={12} color="#333" />
            </View>
          </View>

          {/* Price and Discount */}
          <View style={styles.priceContainer}>
            <Text style={styles.cartItemPrice}>₹{parseFloat(item.price).toLocaleString("en-IN")}</Text>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>
                ₹{parseFloat(item.originalPrice).toLocaleString("en-IN")}
              </Text>
            )}
            {discount && <Text style={styles.discountText}>{discount}</Text>}
          </View>

          {/* Return Policy */}
          <View style={styles.returnPolicy}>
            <Ionicons name="refresh-outline" size={12} color="#666" />
            <Text style={styles.returnPolicyText}>7 days return available</Text>
          </View>

     
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="checkmark" size={16} color="#FF3F6C" style={styles.headerCheckbox} />
          <Text style={styles.headerText}>
            {selectedItems}/{cartItems.length} ITEMS SELECTED (₹{totalPrice})
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="share-social-outline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="trash-outline" size={20} color="#333" onPress={clearCart} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="heart-outline" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {cartItems.length === 0 ? (
        <NothingShoppingBagContent />
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cartList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCheckbox: {
    marginRight: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 15,
  },
  cartList: {
    padding: 15,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
  },
  cartItemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  checkbox: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FF3F6C",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  sellerText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  sizeQtyContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  sizeQtyText: {
    fontSize: 12,
    color: "#333",
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
    color: "#333",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountText: {
    fontSize: 12,
    color: "#FF3F6C",
    backgroundColor: "#FFE6E6",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  returnPolicy: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  returnPolicyText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityNumber: {
    fontSize: 14,
    color: "#333",
    marginHorizontal: 10,
  },
  removeButton: {
    marginLeft: 10,
  },
  removeButtonText: {
    color: "#FF3F6C",
    fontSize: 14,
  },
});

export default ProductInfoSection;