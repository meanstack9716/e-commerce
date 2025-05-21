import { IMAGE_URIS } from "@/constants/imageLinks";
import images from "@/constants/images";
import {fontSizes, fontWeights} from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const EmptyShoppingBagMessage: React.FC = () => {
  return (
    <View style={styles.content}>
      <Image source={images.emptyBagImage} style={styles.bagImage} />

      <Text style={styles.mainText}>Hey, it feels so light!</Text>
      <Text style={styles.subText}>
        There is nothing in your bag. Let's add some items.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bagImage: {
    width: 150,
    height: 150,
    ...spacingStyles.mb15,
  },
  mainText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: staticColors.textSubtitle,
    textAlign: "center",
  },
  subText: {
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
    textAlign: "center",
  },
});

export default EmptyShoppingBagMessage;
