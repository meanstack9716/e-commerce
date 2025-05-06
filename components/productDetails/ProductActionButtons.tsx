
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import colors from "@/style/staticColors";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import gapSizes from "@/style/gapSizes";

interface BottomActionsProps {
  onAddToCart?: () => void;
  onWishlist?: () => void;
  containerStyle?: object;
}

const ProductActionButtons: React.FC<BottomActionsProps> = ({
  onAddToCart = () => {},
  onWishlist = () => {},
  containerStyle = {},
}) => {
  return (
    <View style={[styles.bottomContainer, containerStyle]}>
      <TouchableOpacity style={styles.wishlistButton} onPress={onWishlist}>
        <FontAwesome name="heart-o" size={16} color={colors.primary} />
        <Text style={styles.wishlist}>Wishlist</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
        <Ionicons name="bag-handle-outline" size={16} color={colors.white} />
        <Text style={styles.addToCartText}>Add to Bag</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.p10,
    gap: gapSizes.md,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    ...spacingStyles.py10,
    flexDirection: "row",
    gap: gapSizes.sm,
  },
  addToCartText: {
    fontSize: fontSizes.sm,
    color: staticColors.white,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  wishlistButton: {
    backgroundColor: staticColors.lightGray,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.py10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: staticColors.borderDark,
    flexDirection: "row",
    gap: gapSizes.sm,
  },
  wishlist: {
    fontSize: fontSizes.sm,
    color: staticColors.shadowColor,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
});

export default ProductActionButtons;
