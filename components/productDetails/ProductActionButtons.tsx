import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import colors from "@/style/staticColors";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import borderRadius from "@/style/borderRadius";
interface BottomActionsProps {
  onAddToCart?: () => void;
  onWishlist?: () => void;
  containerStyle?: object;
  isLiked?: boolean;
}

const ProductActionButtons: React.FC<BottomActionsProps> = ({
  onAddToCart = () => {},
  onWishlist = () => {},
  containerStyle = {},
  isLiked,
}) => {
  return (
    <View style={[styles.bottomContainer, containerStyle]}>
      <TouchableOpacity style={styles.wishlistButton} onPress={onWishlist}>
        <FontAwesome
          name={isLiked ? "heart" : "heart-o"}
          size={16}
          color={isLiked ? staticColors.DarkRed : staticColors.primary}
        />
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
    borderRadius: borderRadius.r12,
    ...spacingStyles.py10,
    flexDirection: "row",
    gap: gapSizes.sm,
  },
  addToCartText: {
    fontSize: fontSizes.sm,
    color: staticColors.white,
    fontWeight: fontWeights.semiBold,
    letterSpacing: 1.2,
  },
  wishlistButton: {
    backgroundColor: staticColors.lightGray,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.py10,
    borderRadius: borderRadius.r12,
    borderWidth: 1,
    borderColor: staticColors.borderDark,
    flexDirection: "row",
    gap: gapSizes.sm,
  },
  wishlist: {
    fontSize: fontSizes.sm,
    color: staticColors.shadowColor,
    fontWeight: fontWeights.semiBold,
    letterSpacing: 1.2,
  },
});

export default ProductActionButtons;
