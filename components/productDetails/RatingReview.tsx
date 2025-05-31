import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { Review } from "../../types/types";

interface RatingReviewProps {
  review: Review;
  onViewAllReviews: () => void;
}

const RatingReview: React.FC<RatingReviewProps> = ({
  review,
  onViewAllReviews,
}) => {
  const renderStars = (rating: string, size: number) => {
    const ratingValue = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={`star-${i}`}
          name={i <= ratingValue ? "star" : "star-o"}
          size={size}
          color={staticColors.starYellow}
          style={styles.starIcon}
        />
      );
    }
    return stars;
  };

  const getUsername = (review: Review) => {
    const { first_name, last_name } = review.by;
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    }
    return "Unknown";
  };

  const getAvatarSource = () => {
    if (review.img_urls && review.img_urls.length > 0 && review.img_urls[0]) {
      return { uri: review.img_urls[0] };
    }
    return require("@/assets/images/images/gender-female.png");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rating & Reviews</Text>
      <View style={styles.header}>
        <View style={styles.starsContainer}>{renderStars(review.rating, 22)}</View>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingBoxText}>{review.rating}/5</Text>
        </View>
      </View>

      <View style={styles.userContainer}>
          <Image
            source={getAvatarSource()}
            style={styles.avatar}
            resizeMode="cover"
          />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{getUsername(review)}</Text>
          <View style={[styles.starsContainer]}>
            {renderStars(review.rating, 18)}
          </View>
        </View>
      </View>

      <Text style={styles.reviewText} numberOfLines={3}>
        {review.review}
      </Text>

      <TouchableOpacity onPress={onViewAllReviews} style={styles.button}>
        <Text style={styles.buttonText}>View All Reviews</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px15,
    ...spacingStyles.mb15,
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py10,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: "RalewayeExtraBold",
    color: staticColors.black,
    ...spacingStyles.mr10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.my10,
  },
  starsContainer: {
    flexDirection: "row",
    ...spacingStyles.mr5,
  },
  starIcon: {
    ...spacingStyles.m2,
  },
  ratingBox: {
    backgroundColor: "#E8ECFF",
    paddingHorizontal: 8,
    ...spacingStyles.py2,
    borderRadius: borderRadius.r2,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingBoxText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: staticColors.black,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.circle,
    borderColor: staticColors.white,
    alignSelf: "center",
    backgroundColor: staticColors.white,
    zIndex: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    resizeMode: "contain",
    ...spacingStyles.mr10
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: fontSizes.base,
    fontFamily:'RalewayeSemiBold',
    color: staticColors.black,
    ...spacingStyles.mb5,
  },
  reviewText: {
    fontSize: fontSizes.xs,
    fontFamily:'NunitoSans',
    fontWeight:fontWeights.normal,
    color: staticColors.black,
    ...spacingStyles.mb10,
  },
  button: {
    backgroundColor: staticColors.primaryBlue,
   ...spacingStyles.p10,
    borderRadius: borderRadius.r10,
    alignItems: "center",
  },
  buttonText: {
     color: staticColors.white,
    fontSize: fontSizes.lg,
    fontFamily: "NunitoSans",
  },
});

export default RatingReview;