import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { AppDispatch, RootState } from "@/store/store";

import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";
import { resetReviewState, submitReview } from "@/store/review/reviewSlice";

const ReviewScreen: React.FC = () => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const {
    productName,
    productDescription,
    productImage,
    productSize,
    productId,
    orderId,
  } = useLocalSearchParams<{
    productName: string;
    productDescription: string;
    productImage: string;
    productSize: string;
    productId: string;
    orderId: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.review
  );

  const isSubmitEnabled = rating > 0 && reviewText.trim().length >= 100;

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleGoBack = () => {
    dispatch(resetReviewState());
    router.back();
  };

  const handleSubmit = () => {
    if (isSubmitEnabled) {
      dispatch(
        submitReview({
          product_id: productId,
          rating: rating.toString(),
          review: reviewText,
        })
      );
      router.navigate("/order");
    }
  };

  React.useEffect(() => {
    if (success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Review submitted successfully!",
        onHide: () => {
          dispatch(resetReviewState());
          router.back();
        },
      });
    }
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
        onHide: () => dispatch(resetReviewState()),
      });
    }
  }, [success, error, dispatch]);

  const renderStars = () => {
    return (
      <View style={styles.rating}>
        {[...Array(5)].map((_, index) => {
          const starNumber = index + 1;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleStarPress(starNumber)}
            >
              <Ionicons
                name={starNumber <= rating ? "star" : "star-outline"}
                size={20}
                color={
                  starNumber <= rating
                    ? staticColors.discountText
                    : staticColors.textMuted
                }
              />
            </TouchableOpacity>
          );
        })}
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating === 5
              ? "Loved It!"
              : rating === 4
                ? "Really Good!"
                : rating === 3
                  ? "Good"
                  : rating === 2
                    ? "Okay"
                    : "Not Great"}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons
                name="arrow-back"
                size={20}
                color={staticColors.black}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Photos & Write Review</Text>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Image source={{ uri: productImage }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{productName || "Product"}</Text>
              <Text style={styles.productDescription}>
                {productDescription || "No description available"}
              </Text>
              {productSize ? (
                <Text style={styles.productSize}>Size: {productSize}</Text>
              ) : null}
              {renderStars()}
            </View>
          </View>

          {/* Add Photos Section */}
          <Text style={styles.sectionTitle}>ADD PHOTOS</Text>
          <Text style={styles.sectionSubtitle}>
            Capture and add your product experiences with photos!
          </Text>
          <View style={styles.uploadSection}>
            <TouchableOpacity style={styles.uploadButton}>
              <Ionicons name="camera" size={24} color={staticColors.primary} />
              <View>
                <Text style={styles.uploadButtonText}>Tap to add photos</Text>
                <Text style={styles.uploadButtonSubtext}>(Upto 4 at once)</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Write Review Section */}
          <Text style={styles.sectionTitle}>WRITE REVIEW</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Add description about the product"
            multiline
            value={reviewText}
            onChangeText={setReviewText}
            editable={!loading}
          />
          <Text style={styles.characterCount}>
            {reviewText.length}/100 characters
          </Text>
          {reviewText.length < 100 && reviewText.length > 0 && (
            <Text style={styles.warningText}>
              Review must be at least 100 characters long.
            </Text>
          )}

          {/* Footer Note */}
          <View style={styles.footer}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color={staticColors.textMuted}
            />
            <Text style={styles.footerText}>
              You can write about the fit, material quality, colour, etc.
            </Text>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { opacity: isSubmitEnabled && !loading ? 1 : 0.5 },
            ]}
            disabled={!isSubmitEnabled || loading}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Submitting..." : "Submit & Proceed"}
            </Text>
            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={20}
                color={staticColors.white}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    ...spacingStyles.p2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
    gap: gapSizes.sm,
    ...spacingStyles.p10,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: staticColors.black,
  },
  productInfo: {
    flexDirection: "row",
    ...spacingStyles.px15,
    ...spacingStyles.py10,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mt25,
    ...spacingStyles.mb20,
  },
  productImage: {
    width: 70,
    height: 100,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mr20,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.black,
    ...spacingStyles.mb2,
  },
  productDescription: {
    fontSize: fontSizes.sm,
    color: staticColors.textMuted,
  },
  productSize: {
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
    ...spacingStyles.mt5,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mt5,
    gap: gapSizes.md,
  },
  ratingText: {
    ...spacingStyles.ml5,
    fontSize: fontSizes.sm,
    color: staticColors.discountText,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: staticColors.black,
    ...spacingStyles.mb5,
    ...spacingStyles.px15,
  },
  sectionSubtitle: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    ...spacingStyles.mb15,
    ...spacingStyles.px15,
  },
  uploadSection: {
    ...spacingStyles.mb20,
    alignItems: "center",
  },
  uploadButton: {
    alignItems: "center",
    ...spacingStyles.p15,
    borderWidth: 1,
    borderColor: staticColors.borderDark,
    borderStyle: "dashed",
    borderRadius: borderRadius.r20,
    flexDirection: "row",
    gap: gapSizes.md,
  },
  uploadButtonText: {
    fontSize: fontSizes.sm,
    color: staticColors.primary,
    fontWeight: fontWeights.semiBold,
  },
  uploadButtonSubtext: {
    fontSize: fontSizes.sm,
    color: staticColors.textMuted,
  },
  reviewInput: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.p10,
    height: 120,
    textAlignVertical: "top",
    ...spacingStyles.mb15,
    ...spacingStyles.mx15,
    ...spacingStyles.mt5,
    fontSize: fontSizes.xs,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.px15,
  },
  footerText: {
    flex: 1,
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
    ...spacingStyles.ml5,
  },
  submitButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: staticColors.white,
    ...spacingStyles.p10,
    borderTopWidth: 1,
    borderTopColor: staticColors.borderLight,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: staticColors.primary,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r5,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: fontSizes.sm,
    color: staticColors.white,
    ...spacingStyles.mr5,
  },
  characterCount: {
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
    ...spacingStyles.mt5,
    ...spacingStyles.px15,
  },
  warningText: {
    fontSize: fontSizes.xs,
    color: staticColors.errorColor,
    ...spacingStyles.mt5,
    ...spacingStyles.px15,
  },
});

export default ReviewScreen;
