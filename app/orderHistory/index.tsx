import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { clearOrderStatus, fetchOrders } from "@/store/order/orderSlice";
import { textTruncate } from "@/utils/textTruncate";

import ProfileHeaderBar from "@/components/profile/ProfileHeaderBar/ProfileHeaderBar";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import images from "@/constants/images";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes, fontWeights } from "@/style/typography";
import staticColors from "@/style/staticColors";
import gapSizes from "@/style/gapSizes";
import ReviewModal from "@/modal/ReviewModal/ReviewModal";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { Order } from "./orderHistory.types";

const HistoryScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProductDescription, setSelectedProductDescription] =
    useState<string>("");

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrderStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleReviewPress = (
    orderId: string,
    productId: string,
    description: string
  ) => {
    setSelectedOrderId(orderId.slice(-6));
    setSelectedProductId(productId);
    setSelectedProductDescription(description);
    setReviewModalVisible(true);
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const firstItem = item.items[0];
    const product = firstItem?.product;

    if (!product || !product.id) return null;

    const createdDate = new Date(item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const imageUrl =
      firstItem?.gallery?.[0]?.img_url || product.thumbnail_url || "";

    return (
      <View style={styles.card}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.orderImage} />
        ) : null}

        <View style={styles.cardContent}>
          <Text style={styles.description}>
            {textTruncate(product.description, 10, "...")}
          </Text>
          <Text style={styles.orderNumber}>Order #{item.id.slice(-6)}</Text>

          <View style={styles.footer}>
            <View style={styles.button}>
              <Text style={styles.date}> {createdDate} </Text>
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() =>
                  handleReviewPress(item.id, product.id, product.description)
                }
              >
                <Text style={styles.reviewButtonText}>Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaViewWrapper backgroundColor={staticColors.white}>
      <ProfileHeaderBar title="History" profileImage={images.unKnownUser} />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Image source={images.noOrderImage} style={styles.noOrderImage} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FullScreenLoader visible={loading} />
      <ReviewModal
        visible={isReviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        orderId={selectedOrderId}
        productId={selectedProductId}
        productDescription={selectedProductDescription}
      />
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  listContent: {
    ...spacingStyles.px20,
    ...spacingStyles.py15,
  },
  card: {
    flexDirection: "row",
    ...spacingStyles.mb15,
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    ...spacingStyles.ml10,
    justifyContent: "space-between",
  },
  orderImage: {
    width: 145,
    height: 120,
    borderRadius: borderRadius.r14,
    borderWidth: 3,
    borderColor: staticColors.white,
    backgroundColor: staticColors.white,
    zIndex: 10,
    elevation: 10,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    resizeMode: "cover",
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: staticColors.errorColor,
    textAlign: "center",
    ...spacingStyles.mt20,
  },
  noOrdersContainer: {
    flex: 1,
    alignItems: "center",
  },
  noOrderImage: {
    width: "50%",
    height: "50%",
  },
  description: {
    fontSize: fontSizes.xs,
    color: staticColors.black,
    fontFamily: fontFamilies.nunitoSans,
    ...spacingStyles.mt2,
  },
  orderNumber: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayExtraBold,
    ...spacingStyles.my10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.md,
  },
  button: {
    width: "50%",
  },
  date: {
    backgroundColor: staticColors.bgSoftGray,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py5,
    textAlign: "center",
    fontFamily: fontFamilies.ralewayeMedium,
    fontSize: fontSizes.base,
    width: "100%",
  },
  reviewButton: {
    borderWidth: 2,
    borderColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  reviewButtonText: {
    color: staticColors.primaryBlue,
    fontFamily: fontFamilies.ralewayeMedium,
    fontSize: fontSizes.base,
  },
});

export default HistoryScreen;
