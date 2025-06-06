import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { commonStyles } from "@/style/commonStyle";
import { textTruncate } from "@/utils/textTruncate";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";

export interface ProductCardProps {
  id: string;
  title: string;
  final_price?: number;
  discount_percent?: number;
  thumbnail_url: string;
  images?: string[];
  star?: number;
  liked: boolean;
  onLikePress: () => void;
  onPress: () => void;
  cardWidth?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  final_price,
  discount_percent,
  thumbnail_url,
  images,
  star = 4.5,
  liked,
  onLikePress,
  onPress,
  cardWidth,
}) => {
  const width = cardWidth || Dimensions.get("window").width / 2 - 10;

  return (
    <View style={[styles.card, { width }]}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.cardItemContainer}>
          <View style={styles.imageShadowContainer}>
            <Image
              source={{
                uri:
                  thumbnail_url ||
                  (images && images.length > 0 ? images[0] : undefined),
              }}
              style={styles.cardImage}
            />
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {textTruncate(title, 10)}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.cardPrice}>₹{final_price}</Text>
            {discount_percent && discount_percent > 0 && (
              <Text style={styles.discountText}>{discount_percent}% OFF</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: staticColors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardItemContainer: {
    flexDirection: 'column',
    gap: 8,
    ...spacingStyles.p8
  },
  imageShadowContainer: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r8,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...spacingStyles.p8
  },
  cardImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
    borderRadius: borderRadius.r4
  },
  cardTitle: {
    fontSize: fontSizes.xs,
    color: staticColors.black,
    fontFamily: fontFamilies.nunitoSans,
    fontWeight: fontWeights.extraBold,
    ...spacingStyles.px4,
    height: 40,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    ...spacingStyles.px4
  },
  cardPrice: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: staticColors.black,
  },
  discountText: {
    color: "#D32F2F",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});