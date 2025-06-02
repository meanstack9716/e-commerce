import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { commonStyles } from "@/style/commonStyle";
import { Review } from "../../types/types";

interface RatingReviewProps {
  review: Review;
  productId: string;
}

const RatingReview: React.FC<RatingReviewProps> = ({
  review,
  productId,
}) => {
  const renderStars = (rating: string, size: number) => {
    const ratingValue = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={`star-${i}`}
          name={i <= ratingValue ? "star" : "star-outline"}
          size={size}
          color={staticColors.starYellow}
          style={commonStyles.starIcon}
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
    return require("@/assets/images/images/gender-female.png");
  };

  const handleViewAllReview = () => {
    router.navigate({
      pathname: "/review",
      params: { productId },
    });
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
          style={commonStyles.reviewAvtar}
          resizeMode="cover"
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{getUsername(review)}</Text>
          <View style={styles.starsContainer}>
            {renderStars(review.rating, 18)}
          </View>
        </View>
      </View>

      <Text style={styles.reviewText} numberOfLines={3}>
        {review.review}
      </Text>

      {review.img_urls && review.img_urls.length > 0 && (
        <FlatList
          horizontal
          data={review.img_urls}
          renderItem={({ item: imgUrl }) => (
            <Image
              source={{ uri: imgUrl }}
              style={commonStyles.reviewImage}
              resizeMode="cover"
            />
          )}
          keyExtractor={(imgUrl, index) => `review-img-${index}`}
          showsHorizontalScrollIndicator={false}
          style={styles.reviewImageContainer}
        />
      )}

      <TouchableOpacity onPress={handleViewAllReview} style={commonStyles.authButton}>
        <Text style={commonStyles.authButtonText}>View All Reviews</Text>
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
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: fontSizes.base,
    fontFamily: "RalewayeSemiBold",
    color: staticColors.black,
    ...spacingStyles.mb5,
  },
  reviewText: {
    fontSize: fontSizes.xs,
    fontFamily: "NunitoSans",
    fontWeight: fontWeights.normal,
    color: staticColors.black,
    ...spacingStyles.mb10,
  },
  reviewImageContainer: {
    ...spacingStyles.mt5,
  },
});

export default RatingReview;