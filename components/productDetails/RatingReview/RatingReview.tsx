import React from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { commonStyles } from "@/style/commonStyle";
import { Review } from "@/app/product-reviews/review.types";
import { RatingReviewProps } from "@/interfaces";
import images from "@/constants/images";
import { renderStars } from "@/utils/starUtils";
import gapSizes from "@/style/gapSizes";

const RatingReview: React.FC<RatingReviewProps> = ({ review }) => {
  const getUsername = (review: Review) => {
    const { first_name, last_name } = review.by;
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    }
    return "Unknown";
  };

  const getAvatarSource = () => {
    return images.unKnownUser;
  };

  return (
    <View style={styles.container}>
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

          <Text style={styles.reviewText} numberOfLines={3}>
            {review.review}
          </Text>
        </View>
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
  },
  starsContainer: {
    flexDirection: "row",
    ...spacingStyles.mr5,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  userInfo: {
    flex: 1,
    gap:gapSizes.sm
  },
  username: {
    fontSize: fontSizes.base,
    fontFamily: "RalewayeSemiBold",
    color: staticColors.black,
  },
  reviewText: {
    fontSize: fontSizes.xs,
    fontFamily: "NunitoSans",
    fontWeight: fontWeights.black,
    color: staticColors.black,
    ...spacingStyles.mb10,
  },
  reviewImageContainer: {
 
  },
});

export default RatingReview;
