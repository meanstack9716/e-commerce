import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductById } from "@/store/product/productsSlice";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import RatingReview from "@/components/productDetails/RatingReview/RatingReview";
import {
  fetchProductReviews,
  resetReviewState,
} from "@/store/review/reviewSlice";
import { LIST_LIMIT } from "@/constants/constants";
import { Ionicons } from "@expo/vector-icons";
import ReviewSkeleton from "@/components/skeleton/ReviewSkeleton";

const ReviewsScreen: React.FC = () => {
  const { productId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { productReviews, loading, page, hasMoreReviews } = useSelector(
    (state: RootState) => state.review
  );

  useEffect(() => {
    if (productId) {
      dispatch(resetReviewState());
      dispatch(fetchProductById(productId as string));
      dispatch(
        fetchProductReviews({
          productId: productId as string,
          page: 1,
          limit: LIST_LIMIT,
        })
      );
    }
  }, [productId, dispatch]);
  const loadMoreReviews = () => {
    if (!loading && hasMoreReviews && productId) {
      dispatch(
        fetchProductReviews({
          productId: productId as string,
          page,
          limit: LIST_LIMIT,
        })
      );
    }
  };

  return (
    <SafeAreaViewWrapper backgroundColor={staticColors.white}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={staticColors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>REVIEWS</Text>
        </View>
      </View>
      {loading ? (
        <View style={styles.list}>
          {[...Array(4)].map((_, index) => (
            <ReviewSkeleton key={index} />
          ))}
        </View>
      ) : (
        <FlatList
          data={productReviews}
          renderItem={({ item }) => (
            <RatingReview productId={productId as string} review={item} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews available</Text>
            </View>
          }
          onEndReached={loadMoreReviews}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    ...spacingStyles.px10,
    ...spacingStyles.pt10,
    ...spacingStyles.pb5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    ...spacingStyles.mr10,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.black,
  },
  list: {
    ...spacingStyles.p15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.p15,
  },
  emptyText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
  },
});

export default ReviewsScreen;
