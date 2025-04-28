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

export interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: string;
  star: number;
  liked: boolean; 
  onLikePress: () => void;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  star,
  liked,
  onLikePress,
  onPress,
}) => {
  const discountPercentage = Math.floor(Math.random() * 41) + 10;
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(star);
    const hasHalfStar = star - fullStars >= 0.10;
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesome
          key={`full-${i}`}
          name="star"
          size={14}
          color="#FFD700"
          style={styles.starIcon}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesome
          key="half"
          name="star-half-o"
          size={14}
          color="#FFD700"
          style={styles.starIcon}
        />
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesome
          key={`empty-${i}`}
          name="star-o"
          size={14}
          color="#FFD700"
          style={styles.starIcon}
        />
      );
    }

    return stars;
  };

  return (
    <View style={styles.card}>
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.cardImage} />
        <TouchableOpacity style={styles.likeButton} onPress={onLikePress}>
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={18}
            color={liked ? "red" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.starContainer}>
          {renderStars()}
          <Text style={styles.ratingText}>({star.toFixed(1)})</Text>
        </View>
        <Text style={styles.cardPrice}>${price}</Text>
        <View style={styles.discountBadge}>
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
    width: Dimensions.get("window").width / 2 - 20,
    backgroundColor: colors.whiteColor,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 7,
    borderRadius: 20,
  },
  cardContainer:{
    borderWidth: 1,
    borderColor: colors.lightColor,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: staticColors.cardTitleColor,
    height:43,
    ...spacingStyles.px10,
    ...spacingStyles.pt10,
    lineHeight: 18,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.px10,
    ...spacingStyles.mt5,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: staticColors.lightGray,
    marginLeft: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryColor,
    ...spacingStyles.px10,
    ...spacingStyles.pt5,
  },
  discountBadge: {
    alignSelf: "flex-start",
    ...spacingStyles.mx10,
    ...spacingStyles.my5
  },
  discountText: {
    color: staticColors.discountColor,
    fontSize: 10,
    fontWeight: "bold",
  },
});
