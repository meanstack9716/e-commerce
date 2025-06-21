import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { clearOrderStatus, fetchOrders } from "@/store/order/orderSlice";
import images from "@/constants/images";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes } from "@/style/typography";
import staticColors from "@/style/staticColors";
import ReviewModal from "@/modal/ReviewModal/ReviewModal";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { SelectedItem } from "./orderHistory.types";
import OrderItem from "@/components/order/orderItem/OrderItem";
import ProfileHeaderBar from "@/components/profile/ProfileHeaderBar/ProfileHeaderBar";
import OrderItemSkeleton from "@/components/common/OrderItemSkeleton";
import { LIST_LIMIT } from "@/constants/constants";
import { Order } from "@/interfaces";
import OrderDetailsModal from "@/modal/OrderDetailsModal/OrderDetailsModal";

const OrderHistoryScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error, currentPage, isMoreOrdersAvailable } = useSelector(
    (state: RootState) => state.order
  );
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    orderId: "",
    productId: "",
    productDescription: "",
  });
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);

  const handleOrderItemPress = (order: Order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };
  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: LIST_LIMIT }));
    return () => {
      dispatch(clearOrderStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleLoadMore = () => {
    if (!loading && isMoreOrdersAvailable) {
      dispatch(fetchOrders({ page: currentPage, limit: LIST_LIMIT }));
    }
  };

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
    <TouchableOpacity onPress={() => handleOrderItemPress(item)}>
      <OrderItem item={item} onReviewPress={handleReviewPress} />
    </TouchableOpacity>
  );

  const renderSkeletonItems = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => <OrderItemSkeleton key={`skeleton-${index}`} />);
  };

  const renderFooter = () => {
    if (!loading || !isMoreOrdersAvailable) return null;
    return (
      <View style={styles.skeletonContainer}>{renderSkeletonItems()}</View>
    );
  };

  return (
    <SafeAreaViewWrapper>
      <ProfileHeaderBar
        title="History"
        profileImage={images.unKnownUser}
        containerStyle={styles.profileHeaderContainer}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredOrders.length === 0 && !loading ? (
        <View style={styles.noOrdersContainer}>
          <Image source={images.noOrderImage} style={styles.noOrderImage} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
      <ReviewModal
        visible={isReviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        orderId={selectedItem.orderId}
        productId={selectedItem.productId}
        productDescription={selectedItem.productDescription}
      />
      <OrderDetailsModal
        visible={isDetailsModalVisible}
        order={selectedOrder}
        onClose={() => setDetailsModalVisible(false)}
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
    ...spacingStyles.px15,
    ...spacingStyles.py5,
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
  skeletonContainer: {
    ...spacingStyles.px12,
    ...spacingStyles.py15,
  },
});

export default OrderHistoryScreen;
