import React, { useState, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { pickImages } from "@/utils/imagePicker";
import { textTruncate } from "@/utils/textTruncate";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes, fontWeights } from "@/style/typography";
import staticColors from "@/style/staticColors";
import gapSizes from "@/style/gapSizes";
import { RootState } from "@/store/store";
import { resetReviewState, submitReview, updateReview } from "@/store/review/reviewSlice";
import { useAppDispatch } from "@/store/hooks";
import images from "@/constants/images";
import { ReviewModalProps, ReviewState } from "./ReviewModal.types";

import { useFieldValidation } from "@/hooks/useFieldValidation";
import ConfirmationModal from "@/modal/commonModal/confirmationModal/ConfirmationModal";
import { Review } from "@/interfaces";
import { fetchOrders } from "@/store/order/orderSlice";

const initialReviewState: ReviewState = {
  rating: 0,
  comment: "",
  selectedImages: [],
  showImagePickerModal: false,
};

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
  
  const currentUserId = useSelector((state: RootState) => state.auth?.user?.id);
  const { orders } = useSelector((state: RootState) => state.order);
  const [reviewState, setReviewState] = useState<ReviewState>(initialReviewState);
  const [hasExistingReview, setHasExistingReview] = useState(false);
 const [existingReview, setExistingReview] = useState<Review | null>(null);

  const {
    errors,
    handleFieldChange,
    setFieldErrors,
    resetErrors,
    validateAllFields,
  } = useFieldValidation();

  useEffect(() => {
    if (visible && productId && currentUserId && orders) {
      const currentOrder = orders.find(order => order.id === orderId);
      if (currentOrder) {
        const orderItem = currentOrder.items?.find(item => item.product.id === productId);
        if (orderItem?.product?.reviews) {
          const userReview = orderItem.product.reviews.find(
            review => review.by?.id === currentUserId
          );
          
          if (userReview) {
            setHasExistingReview(true);
            setExistingReview(userReview);
            setReviewState(prev => ({
              ...prev,
              rating: parseInt(userReview.rating),
              comment: userReview.review,
              selectedImages: userReview.img_urls || []
            }));
          } else {
            setHasExistingReview(false);
            setExistingReview(null);
          }
        }
      }
    }
  }, [visible, productId, currentUserId, orders, orderId]);

  const setImagePickerModal = (value: boolean) => {
    setReviewState((prev) => ({ ...prev, showImagePickerModal: value }));
  };

  const handleRating = (selectedRating: number) => {
    setReviewState((prev) => ({ ...prev, rating: selectedRating }));
    handleFieldChange(
      "rating",
      selectedRating.toString(),
      (value) => parseInt(value) >= 1,
      "Please select at least one star"
    );
  };

  const handleCommentChange = (text: string) => {
    setReviewState((prev) => ({ ...prev, comment: text }));
    handleFieldChange(
      "comment",
      text,
      (value) => value.trim().length >= 50,
      "Comment must be at least 50 characters"
    );
  };

const handleSubmit = () => {
  const isValid = validateAllFields({
    rating: {
      value: reviewState.rating.toString(),
      validator: (v) => parseInt(v) >= 1,
      errorMessage: "Please select at least one star",
    },
    comment: {
      value: reviewState.comment,
      validator: (v) => v.trim().length >= 50,
      errorMessage: "Comment must be at least 50 characters",
    },
  });

  if (!isValid) return;

  const reviewData = {
    product_id: productId,
    rating: reviewState.rating.toString(),
    review: reviewState.comment.trim(),
      images: reviewState.selectedImages, 
    ...(hasExistingReview && existingReview?.id && { review_id: existingReview.id }),
  };

  if (hasExistingReview) {
    dispatch(updateReview(reviewData))
      .unwrap()
      .then((updatedReview) => {
        setExistingReview(updatedReview);
        setReviewState({
          ...reviewState,
          rating: parseInt(updatedReview.rating),
          comment: updatedReview.review,
          selectedImages: updatedReview.img_urls || []
        });
      })
      .catch((error) => {
        console.error("Update failed:", error);
      });
  } else {
    dispatch(submitReview(reviewData));
    console.log(reviewData)
  }
};

  const handleClose = () => {
    if (loading) return;
    setReviewState(initialReviewState);
    setHasExistingReview(false);
    setExistingReview(null);
    resetErrors();
    dispatch(resetReviewState());
    onClose();
  };

  const handleConfirmationClose = () => {
    setReviewState(initialReviewState);
    setHasExistingReview(false);
    setExistingReview(null);
    resetErrors();
    dispatch(resetReviewState());
    onClose();
  };

  const handleImagePick = () => {
    setReviewState((prev) => ({ ...prev, showImagePickerModal: true }));
  };

  const handleCameraPick = async () => {
    const uris = await pickImages(setImagePickerModal, "camera");
    if (uris.length > 0) {
      setReviewState((prev) => ({
        ...prev,
        selectedImages: [...prev.selectedImages, ...uris],
      }));
    }
  };

  const handleGalleryPick = async () => {
    const uris = await pickImages(setImagePickerModal, "gallery");
    console.log(uris)
    if (uris.length > 0) {
      setReviewState((prev) => ({
        ...prev,
        selectedImages: [...prev.selectedImages, ...uris],
      }));
    }
  };

  const handleImagePickerCancel = async () => {
    await pickImages(setImagePickerModal, "cancel");
  };

  const removeImage = (uriToRemove: string) => {
    setReviewState((prev) => ({
      ...prev,
      selectedImages: prev.selectedImages.filter((uri) => uri !== uriToRemove),
    }));
  };

  useEffect(() => {
    if (visible) {
      resetErrors();
    }
  }, [visible]);

  const getButtonText = () => {
    if (loading) return null;
    return hasExistingReview ? "Update it!" : "Say it!";
  };

  const getModalTitle = () => {
    return hasExistingReview ? "Update Review" : "Review";
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible && !success}
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>{getModalTitle()}</Text>
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

                <View style={styles.ratingWithCamera}>
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, index) => {
                      const starRating = index + 1;
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleRating(starRating)}
                        >
                          <Ionicons
                            name={
                              reviewState.rating >= starRating
                                ? "star"
                                : "star-outline"
                            }
                            size={fontSizes["2xl"]}
                            color={staticColors.darkYellow}
                            style={styles.star}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {errors.rating && (
                    <Text style={styles.errorText}>{errors.rating}</Text>
                  )}

                  <View style={styles.cameraRow}>
                    <TouchableOpacity
                      style={styles.cameraIcon}
                      onPress={handleImagePick}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={18}
                        color={staticColors.primaryBlue}
                      />
                    </TouchableOpacity>

                    <Text style={styles.cameraText}>
                      Add photos to your review
                    </Text>
                  </View>
                  <View style={styles.imagePreviewContainer}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.imagePreviewContainer}
                    >
                      {reviewState.selectedImages.map((uri, index) => (
                        <View key={`${uri}-${index}`} style={styles.imageWrapper}>
                          <Image source={{ uri }} style={styles.previewImage} />
                          <TouchableOpacity
                            style={styles.removeIcon}
                            onPress={() => removeImage(uri)}
                          >
                            <Ionicons
                              name="close-circle"
                              size={20}
                              color={staticColors.primaryBlue}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <TextInput
                  style={styles.commentInput}
                  multiline
                  placeholder="Write your review (minimum 50 characters)"
                  placeholderTextColor={staticColors.black}
                  value={reviewState.comment}
                  onChangeText={handleCommentChange}
                  textAlignVertical="top"
                  textAlign="left"
                />
                <Text style={styles.charCount}>
                  {reviewState.comment.length}/50
                </Text>
                {errors.comment && (
                  <Text style={styles.errorText}>{errors.comment}</Text>
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (loading || errors.rating || errors.comment) &&
                      styles.disabledButton,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading || !!errors.rating || !!errors.comment}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={staticColors.white}
                    />
                  ) : (
                    <Text style={styles.submitButtonText}>{getButtonText()}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={reviewState.showImagePickerModal}
        onRequestClose={handleImagePickerCancel}
      >
        <TouchableWithoutFeedback onPress={handleImagePickerCancel}>
          <View style={styles.imageModal}>
            <TouchableWithoutFeedback>
              <View style={styles.imagePickerModalView}>
                <Text style={styles.imagePickerModalTitle}>
                  Select Image Source
                </Text>
                <Text style={styles.imagePickerModalSubtitle}>
                  Choose where to pick your image from
                </Text>
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={handleCameraPick}
                >
                  <Text style={styles.imagePickerButtonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={handleGalleryPick}
                >
                  <Text style={styles.imagePickerButtonText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.imagePickerButton, styles.cancelButton]}
                  onPress={handleImagePickerCancel}
                >
                  <Text
                    style={[
                      styles.imagePickerButtonText,
                      styles.cancelButtonText,
                    ]}
                  >
                    Cancel
                  </Text>
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
    fontSize: fontSizes.l,
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
  charCount: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.black,
    textAlign: "right",
    ...spacingStyles.mr25,
    ...spacingStyles.mb5,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.nunitoSans,
    textAlign: "left",
    ...spacingStyles.mb10,
    ...spacingStyles.mx20,
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
  ratingWithCamera: {
    ...spacingStyles.px20,
    ...spacingStyles.mb15,
    alignItems: "flex-start",
  },
  cameraRow: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb5,
    gap: gapSizes.md,
  },
  cameraText: {
    fontSize: fontSizes.sm,
    color: staticColors.primaryBlue,
    fontFamily: fontFamilies.helvetica,
  },
  cameraIcon: {
    ...spacingStyles.p5,
    borderWidth: 1,
    borderColor: staticColors.primaryBlue,
    borderRadius: borderRadius.circle,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.sm,
    ...spacingStyles.my5,
  },
  imageWrapper: {
    position: "relative",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.r10,
    resizeMode: "cover",
  },
  removeIcon: {
    position: "absolute",
    top: -7,
    right: -5,
    backgroundColor: staticColors.white,
    borderRadius: 12,
  },
  imagePickerModalView: {
    backgroundColor: staticColors.white,
    width: "100%",
    ...spacingStyles.p20,
    alignItems: "center",
    borderRadius: borderRadius.r20,
  },
  imagePickerModalTitle: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.black,
    ...spacingStyles.mb10,
  },
  imagePickerModalSubtitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.black,
    ...spacingStyles.mb20,
    textAlign: "center",
  },
  imageModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  imagePickerButton: {
    backgroundColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py10,
    ...spacingStyles.mb10,
    width: "100%",
    alignItems: "center",
  },
  imagePickerButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.nunitoSans,
    fontWeight: fontWeights.medium,
  },
  cancelButton: {
    backgroundColor: staticColors.lightGray,
  },
  cancelButtonText: {
    color: staticColors.black,
  },
});

export default ReviewModal;