import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes, fontWeights } from "@/style/typography";
import staticColors from "@/style/staticColors";
import { RootState } from "@/store/store";
import { resetReviewState, submitReview } from "@/store/review/reviewSlice";
import { useAppDispatch } from "@/store/hooks";
import images from "@/constants/images";
import { textTruncate } from "@/utils/textTruncate";
import { ReviewModalProps } from "./ReviewModal.types";
import ConfirmationModal from "./confirmationModal/ConfirmationModal";

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  orderId,
  productId,
  productDescription,
}) => {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.review
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRating = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    dispatch(
      submitReview({
        product_id: productId,
        rating: rating.toString(),
        review: comment.trim() || "No comment provided",
      })
    );
  };

  const handleClose = () => {
    if (loading) return;
    setRating(0);
    setComment("");
    dispatch(resetReviewState());
    onClose();
  };

  const handleConfirmationClose = () => {
    setRating(0);
    setComment("");
    dispatch(resetReviewState());
    onClose();
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible && !success}
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Review</Text>
                <View style={styles.orderInfo}>
                  <Image
                    source={images.genderFemale}
                    style={styles.avatarImage}
                  />
                  <View>
                    <Text style={styles.productDescription}>
                      {textTruncate(productDescription, 7)}
                    </Text>
                    <Text style={styles.orderText}>Order #{orderId}</Text>
                  </View>
                </View>

                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, index) => {
                    const starRating = index + 1;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleRating(starRating)}
                      >
                        <Ionicons
                          name={rating >= starRating ? "star" : "star-outline"}
                          size={fontSizes["2xl"]}
                          color={staticColors.darkYellow}
                          style={styles.star}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TextInput
                  style={styles.commentInput}
                  multiline
                  placeholder="Say it!"
                  placeholderTextColor={staticColors.black}
                  value={comment}
                  onChangeText={setComment}
                  textAlignVertical="top"
                  textAlign="left"
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={staticColors.white}
                    />
                  ) : (
                    <Text style={styles.submitButtonText}>Say it!</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ConfirmationModal
        visible={success}
        isSuccess={success}
        onClose={handleConfirmationClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalView: {
    backgroundColor: staticColors.white,
    width: "100%",
    borderTopLeftRadius: borderRadius.r20,
    borderTopRightRadius: borderRadius.r20,
    ...spacingStyles.pb20,
  },
  modalTitle: {
    backgroundColor: staticColors.bgSoftBlue,
    borderTopLeftRadius: borderRadius.r20,
    borderTopRightRadius: borderRadius.r20,
    fontSize: fontSizes.xxl,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.black,
    ...spacingStyles.mb15,
    ...spacingStyles.px20,
    ...spacingStyles.py25,
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb15,
    ...spacingStyles.px20,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.circle,
    alignSelf: "center",
    resizeMode: "cover",
    marginRight: 10,
  },
  orderText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayExtraBold,
  },
  productDescription: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.black,
    fontWeight: fontWeights.normal,
  },
  ratingContainer: {
    flexDirection: "row",
    ...spacingStyles.mb15,
    ...spacingStyles.px20,
  },
  star: {
    ...spacingStyles.mr5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    borderRadius: borderRadius.r10,
    minHeight: 120,
    ...spacingStyles.mx20,
    ...spacingStyles.mb10,
    backgroundColor: staticColors.iceBlue,
    fontFamily: fontFamilies.nunitoSans,
    ...spacingStyles.px10,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.nunitoSans,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py10,
    ...spacingStyles.mt10,
    alignItems: "center",
    justifyContent: "center",
    ...spacingStyles.mx20,
  },
  submitButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.nunitoSans,
    fontWeight: fontWeights.light,
  },
  disabledButton: {
    backgroundColor: staticColors.lightGray,
  },
});

export default ReviewModal;
