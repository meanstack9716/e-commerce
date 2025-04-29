import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import colors from "@/style/staticColors";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";

interface BottomActionsProps {
  onAddToCart?: () => void;
  onWishlist?: () => void;
  containerStyle?: object;
}

const BottonActions: React.FC<BottomActionsProps> = ({
  onAddToCart = () => {},
  onWishlist = () => {},
  containerStyle = {},
}) => {
  return (
    <View style={[styles.bottomContainer, containerStyle]}>
      <TouchableOpacity style={styles.wishlistButton} onPress={onWishlist}>
        <FontAwesome name="heart-o" size={16} color={colors.primaryColor} />
        <Text style={styles.wishlist}>Wishlist</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
        <Ionicons
          name="bag-handle-outline"
          size={16}
          color={colors.whiteColor}
        />
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
    gap: 10,
    backgroundColor: staticColors.lightColor,
  },
  addToCartButton: {
    backgroundColor: colors.primaryColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    ...spacingStyles.py10,
    flexDirection: "row",
   
  },
  addToCartText: {
    fontSize: 14,
    color: staticColors.whiteColor,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  wishlistButton: {
    backgroundColor: staticColors.lightColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.py10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: staticColors.borderDark,
    flexDirection: "row",
    gap: 8,
  },
  wishlist: {
    fontSize: 14,
    color: staticColors.shadowColor,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
});

export default BottonActions;
