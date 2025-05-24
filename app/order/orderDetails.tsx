import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RootState } from "@/store/store";
import { fetchOrderDetails, clearOrderStatus } from "@/store/order/orderSlice";
import { useAppDispatch } from "@/store/hooks";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { textTruncate } from "@/utils/textTruncate";

const OrderDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { selectedOrder, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId as string));
    }

    return () => {
      dispatch(clearOrderStatus());
    };
  }, [dispatch, orderId]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <FullScreenLoader visible={loading} />
      </SafeAreaView>
    );
  }

  if (error || !selectedOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={23}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Order not found"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const firstItem = selectedOrder.items[0];
  const product = firstItem?.product;
  const imageUrl = firstItem?.gallery?.[0]?.img_url || "";
  const createdDate = new Date(selectedOrder.created_at).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const returnWindowClosedDate = new Date(selectedOrder.created_at);
  returnWindowClosedDate.setDate(returnWindowClosedDate.getDate() + 7);
  const formattedReturnDate = returnWindowClosedDate.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );

  let review = product?.reviews?.find(
    (review) =>
      review.order_id === selectedOrder.id && review.product_id === product.id
  );

  if (!review) {
    review = product?.reviews?.find(
      (review) => review.product_id === product.id
    );
  }

  const rating = review ? parseInt(review.rating, 10) || 0 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={staticColors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <Text style={styles.productName}>{product?.title}</Text>
        <Text style={styles.productDescription}>{textTruncate(product?.description ,5)}</Text>
        <Text style={styles.size}>Size: {firstItem?.selected_size}</Text>
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.deliveryStatus}>
          <Text style={styles.deliveryText}>{selectedOrder.status}</Text>
          <Text style={styles.deliveryDate}>ON {createdDate}</Text>
        </View>

        {/* Exchange/Return Info */}
        <Text style={styles.returnInfo}>
           Exchange/Return window closed on {formattedReturnDate}
        </Text>

        {/* Rating and Review */}
        <View style={styles.reviewContainer}>
          <View style={styles.starContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < rating ? "star" : "star-outline"}
                size={24}
                color={
                  index < rating
                    ? staticColors.discountText
                    : staticColors.textMuted
                }
                style={styles.starIcon}
              />
            ))}
          </View>
          <Text style={styles.reviewText}>
            {review?.review || "No review yet. Be the first to leave one!"}
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  backButton: {
    ...spacingStyles.p5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.p10,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
  },
  imageContainer: {
    alignItems: "center",
    ...spacingStyles.mt10,
    ...spacingStyles.mb5,
    backgroundColor: staticColors.lightGray,
    width: "100%",
    height: 300,
    justifyContent: "center",
    flexDirection:'column',
    gap:gapSizes.sm,
    ...spacingStyles.px10
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.r20,
  },
  detailsContainer: {
    ...spacingStyles.px10,
    backgroundColor: staticColors.lightGray,
    ...spacingStyles.p15,
  
  },
  productName: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
  },
  productDescription: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
      textAlign:'center'
  },
  size: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
  },
  deliveryStatus: {
    flexDirection: "column",
    backgroundColor: staticColors.darkGreen,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r4,
    ...spacingStyles.mt10,
  },
  deliveryText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.white,
  },
  deliveryDate: {
    fontSize: fontSizes.sm,
    color: staticColors.white,
  },
  returnInfo: {
    backgroundColor:staticColors.white,
    ...spacingStyles.p10,
    borderRadius:borderRadius.r5,
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    ...spacingStyles.mt10,
  },
  reviewContainer: {
    ...spacingStyles.mt15,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  starIcon: {
    ...spacingStyles.mr5,
  },
  reviewText: {
    fontSize: fontSizes.sm,
    color: staticColors.textDarkGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: staticColors.errorColor,
    textAlign: "center",
  },
});

export default OrderDetails;
