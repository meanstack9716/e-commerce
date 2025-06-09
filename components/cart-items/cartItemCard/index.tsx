import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartItemCardProps } from "./CartItemCard.types";
import gapSizes from "@/style/gapSizes";
import { router } from "expo-router";

const CardItemCard: React.FC<CartItemCardProps> = ({
  cartItem,
  from = "cart",
  onPressDelete,
  selectedItems,
  onToggleSelect,
  onQuantityChange,
}) => {
  const selectedImages = cartItem.product.gallery?.filter(
    (img) => img.color === cartItem.selected_color_name
  );
  const product = cartItem.product;
  return (
    <TouchableOpacity style={styles.cardContainer}  
          onPress={() =>
            router.navigate({
              pathname: "/ProductDetails",
              params: { id: product.id },
            })
          }
    >
      <View style={styles.imageContainer}>
        <Image
          src={
            selectedImages && selectedImages.length
              ? selectedImages[0].img_url
              : product.thumbnail_url
          }
          alt={product.title}
          style={styles.productImage}
        />
        <TouchableOpacity
          style={styles.deleteItemContainer}
          onPress={() => onPressDelete && onPressDelete(cartItem.id)}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color={staticColors.brightRed}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onToggleSelect && onToggleSelect(cartItem.id)}
          style={styles.checkBoxContainer}
        >
          <View
            style={[
              styles.checkbox,
              selectedItems &&
                selectedItems.includes(cartItem.id) &&
                styles.selectedCheckbox,
            ]}
          >
            {selectedItems && selectedItems.includes(cartItem.id) && (
              <Text style={styles.checkmark}>✔</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.productDetailsContainer}>
        <View style={styles.productInfoSection}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <View style={styles.productDetails}>
            <Text style={styles.productColor}>
              {cartItem.selected_color_name},
            </Text>
            <Text style={styles.productColor}>
              Size {cartItem.selected_size}
            </Text>
          </View>
        </View>
        <View style={styles.productPrizeContainer}>
          <Text style={styles.productPrize}>₹ {product.final_price}</Text>
          {from === "cart" && (
            <View style={styles.productQuantityContainer}>
              <TouchableOpacity
                disabled={cartItem.quantity === 0}
                onPress={() =>
                  onQuantityChange &&
                  onQuantityChange(cartItem.quantity - 1, cartItem.id)
                }
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={32}
                  color={
                    cartItem.quantity === 0
                      ? staticColors.blue200
                      : staticColors.blue500
                  }
                />
              </TouchableOpacity>
              <View style={styles.quantityWrap}>
                <Text style={styles.productQuantity}>{cartItem.quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  onQuantityChange &&
                  onQuantityChange(cartItem.quantity + 1, cartItem.id)
                }
              >
                <Ionicons
                  name="add-circle-outline"
                  size={32}
                  color={staticColors.blue500}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    ...spacingStyles.py10,
    flexDirection: "row",
  },
  imageContainer: {
    borderRadius: borderRadius.r10,
    overflow: "hidden",
    backgroundColor: staticColors.white,
    height: 130,
    width: "40%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
    ...spacingStyles.p5,
    ...spacingStyles.ml4,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: borderRadius.r6,
  },
  deleteItemContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.circle,
  },
  checkBoxContainer: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    backgroundColor: staticColors.white,
    borderColor: staticColors.black,
    borderRadius: borderRadius.r4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: staticColors.white,
    fontSize: fontSizes.xs,
  },

  selectedCheckbox: {
    backgroundColor: staticColors.primaryBlue,
  },
  checkboxChecked: {
    backgroundColor: staticColors.blue500,
    borderColor: staticColors.blue500,
  },
  productDetailsContainer: {
    width: "60%",
    justifyContent: "space-between",
    ...spacingStyles.pl15,
    ...spacingStyles.py2,
  },
  productInfoSection: {
    width: "90%",
  },
  productTitle: {
    // fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
  },
  productDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: gapSizes.sm,
    ...spacingStyles.mt5,
  },
  productColor: {
    fontSize: fontSizes.base,
  },
  productPrizeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mr6,
    ...spacingStyles.pb5,
  },
  productPrize: {
    fontFamily: fontFamilies.ralewayBold,
    fontSize: fontSizes.md,
  },
  productQuantityContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: gapSizes.sm,
  },
  quantityWrap: {
    borderRadius: borderRadius.r10,
    backgroundColor: staticColors.blue100,
    ...spacingStyles.px12,
    ...spacingStyles.py4,
  },
  productQuantity: {
    fontFamily: fontFamilies.ralewayBold,
    fontSize: fontSizes.md,
  },
});

export default CardItemCard;
