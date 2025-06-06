import React from "react";
import { View, StyleSheet, Image } from "react-native";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import images from "@/constants/images";

const EmptyCart: React.FC = () => {
  return (
    <View style={styles.notfoundContainer}>
      <View style={styles.notFoundLogoWrap}>
        <Image
          source={images.emptyCart}
          style={styles.cartImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notfoundContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.py20,
  },
  notFoundLogoWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    borderRadius: borderRadius.circle,
    width: "60%",
    aspectRatio: 1,
    overflow: "hidden",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: "white",
  },
  cartImage: {
    width: 100,
    height: 100,
  },
});

export default EmptyCart;
