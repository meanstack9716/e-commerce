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

import { SelectedItem } from "./orderHistory.types";
import OrderItem from "@/components/order/orderItem/OrderItem";
import ProfileHeaderBar from "@/components/profile/ProfileHeaderBar/ProfileHeaderBar";
import { Order } from "@/interfaces";

const OrderHistoryScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    orderId: "",
    productId: "",
    productDescription: "",
  });
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);

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
    setSelectedItem({
      orderId: orderId,
      productId,
      productDescription: description,
    });
    setReviewModalVisible(true);
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderItem item={item} onReviewPress={handleReviewPress} />
  );

  return (
    <SafeAreaViewWrapper backgroundColor={staticColors.white}>
      <ProfileHeaderBar
        title="History"
        profileImage={images.unKnownUser}
        containerStyle={styles.profileHeaderContainer}
      />
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
        orderId={selectedItem.orderId}
        productId={selectedItem.productId}
        productDescription={selectedItem.productDescription}
      />
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  listContent: {
    ...spacingStyles.px12,
    ...spacingStyles.py15,
  },
    profileHeaderContainer: {
    ...spacingStyles.pl10,
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
});

export default OrderHistoryScreen;
