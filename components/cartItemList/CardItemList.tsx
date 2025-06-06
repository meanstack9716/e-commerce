import React from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import { fontSizes, fontWeights } from "@/style/typography";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { CartItemsListProps } from "./cardItem.types";
import { commonStyles } from "@/style/commonStyle";
import { CartItem } from "@/interfaces";
import { fontFamilies } from "@/style/fontFamilies";

const CartItemsList: React.FC<CartItemsListProps> = ({ cartItems }) => {
  const renderCartItem = ({ item }: { item: CartItem }) => {
    const selectedImages = item.product.gallery?.filter(
      (img) => img.color === item.selected_color_name
    );
    const product = item.product;
    return (
      <View key={item.id} style={styles.itemContainer}>
        <View style={styles.leftSection}>
          <View style={styles.imageShadowWrapper}>
            <View style={styles.imageWrapper}>
              <Image
                src={
                  selectedImages && selectedImages.length
                    ? selectedImages[0].img_url
                    : product.thumbnail_url
                }
                alt={product.title}
                style={styles.itemImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.itemQuantityWrap}>
            <Text style={styles.itemQuantityCount}>
              {item.quantity}
            </Text>
          </View>
          </View>
          <Text style={styles.itemTitle}>{product.title}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.itemPrice}>₹{product.final_price * item.quantity}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={commonStyles.justifyBetwwen}>
        <View style={commonStyles.itemCountHeader}>
          <Text style={commonStyles.itemCountTitle}>Items</Text>
          <View style={commonStyles.itemCountWrap}>
            <Text style={commonStyles.itemCount}>
              {cartItems.length ? cartItems.length : 0}
            </Text>
          </View>
        </View>
      </View>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        scrollEnabled={false}
        keyExtractor={(item, index) => item.id}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: staticColors.white,
    ...spacingStyles.mt10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageShadowWrapper: {
    width: 80,
    height: 80,
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.circle,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    ...spacingStyles.mr10,
    ...spacingStyles.p5,
    position: "relative",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.circle,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemQuantityWrap: {
    borderRadius: borderRadius.circle,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderColor: staticColors.white,
    position: 'absolute',
    top: -8,
    right: -4,
    justifyContent: "center",
    backgroundColor: staticColors.iceBlue,
    ...spacingStyles.px10,
    ...spacingStyles.pb6,
  },
  itemQuantityCount: {
    textAlign: "center",
    fontFamily: fontFamilies.ralewayBold,
  },
  itemTitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.nunitoSans,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  rightSection: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
    fontWeight: fontWeights.semiBold,
  },
});

export default CartItemsList;
