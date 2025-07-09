import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import images from "@/constants/images";
import { fontSizes, fontWeights } from "@/style/typography";
import staticColors from "@/style/staticColors";

const EmptyCart: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={images.emptyCart}
        style={styles.cartImage}
        resizeMode="contain"
      />

      <Text style={styles.title}>Your cart is empty</Text>

      <Text style={styles.subtext}>
        Just relax, let us help you find some{" "}
        <Text style={styles.highlight}>first-class products</Text>
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.navigate("/(tabs)/home")}
      >
        <Text style={styles.buttonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.p20,
    ...spacingStyles.mt30,
  },
  cartImage: {
    width: 250,
    height: 250,
    ...spacingStyles.mt30,
    ...spacingStyles.mb20,
  },
  title: {
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.semiBold,
    color: staticColors.primary,
    textAlign: "center",
    ...spacingStyles.mb10,
  },
  subtext: {
    fontSize: fontSizes.base,
    color: staticColors.darkGray,
    textAlign: "center",
    ...spacingStyles.mx20,
    ...spacingStyles.mb20,
    lineHeight: 20,
  },
  highlight: {
    fontWeight: fontWeights.bold,
  },
  button: {
    backgroundColor: staticColors.primaryBlue,
    ...spacingStyles.py10,
    ...spacingStyles.px30,
    borderRadius: borderRadius.r10,
  },
  buttonText: {
    color: staticColors.white,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.base,
    ...spacingStyles.px20,
  },
});
