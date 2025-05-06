import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
import gapSizes from "@/style/gapSizes";

export interface ProductCardProps {
  id: string;
  images: string[]; 
  title: string;
  price: string;
  star: number;
  liked: boolean;
  cardWidth?: number;
  onLikePress: () => void;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  images,
  title,
  price,
  star,
  liked,
  onLikePress,
  onPress,
  cardWidth
}) => {
  const discountPercentage = Math.floor(Math.random() * 41) + 10;
  const imageToShow = images && images.length > 0 ? images[0] : null;
  
  return (
    <View style={[styles.card, cardWidth ? { width: cardWidth } : {}]}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.imageWrapper}>
          {imageToShow ? (
            <Image source={{ uri: imageToShow }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.noImageContainer]}>
              <Text style={styles.noImageText}>No image</Text>
            </View>
          )}
          <View style={styles.starOverlay}>
            <FontAwesome name="star" size={14} color={staticColors.lightYellow} />
            <Text style={styles.ratingText}>({star.toFixed(1)})</Text>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {title}
            </Text>
            <TouchableOpacity
              style={styles.inlineLikeButton}
              onPress={onLikePress}
            >
              <FontAwesome
                name={liked ? "heart" : "heart-o"}
                size={16}
                color={liked ? "red" : `${staticColors.textLightGray}`}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.discountBadge}>
            <Text style={styles.cardPrice}>${price}</Text>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("window").width / 2 - 16,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
    borderRadius: 10,
  },
  noImageContainer: {
    backgroundColor: staticColors.errorColor,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: staticColors.lightGray,
    fontSize: fontSizes.md,
    fontWeight: "500",
  },
  cardContainer: {},
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.px10,
    ...spacingStyles.pt10,
  },
  cardTitle: {
    fontSize: fontSizes.xs,
    fontWeight: "600",
    color: staticColors.darkGray,
    flex: 1,
    lineHeight: 18,
  },
  inlineLikeButton: {
    ...spacingStyles.p2
  },
  starOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:staticColors.white,
    ...spacingStyles.px10,
    ...spacingStyles.py5,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
    marginLeft: 4,
  },
  cardPrice: {
    fontSize: fontSizes.base,
    fontWeight: "700",
    color: colors.primary,
  },
  discountBadge: {
    flexDirection: "row",
    ...spacingStyles.mx10,
    ...spacingStyles.my5,
    alignItems: "center",
    gap:gapSizes.xs
  },
  discountText: {
    color: staticColors.DarkRed,
    fontSize: fontSizes.xs,
    fontWeight: "bold",
  },
});