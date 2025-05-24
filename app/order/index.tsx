import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { clearOrderStatus, fetchOrders } from "@/store/order/orderSlice";
import { textTruncate } from "@/utils/textTruncate";
import { Order } from "@/types/types";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import OrderFilterModal from "@/modal/OrderFilterModal";
import images from "@/constants/images";

interface FilterValues {
  status: string;
  time: string;
}

const OrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.order
  );
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    status: "All",
    time: "Anytime",
  });

  useEffect(() => {
    dispatch(fetchOrders());

    return () => {
      dispatch(clearOrderStatus());
    };
  }, [dispatch]);

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    filterOrders();
  }, [orders, activeFilters]);

  const filterOrders = () => {
    let filtered = [...orders];
    if (activeFilters.status !== "All") {
      filtered = filtered.filter(
        (order) => order.status === activeFilters.status
      );
    }
    if (activeFilters.time !== "Anytime") {
      const today = new Date();
      let cutoffDate = new Date(today);
      if (activeFilters.time === "Last 30 days") {
        cutoffDate.setDate(today.getDate() - 30);
      } else if (activeFilters.time === "Last 6 months") {
        cutoffDate.setMonth(today.getMonth() - 6);
      } else if (activeFilters.time === "Last year") {
        cutoffDate.setFullYear(today.getFullYear() - 1);
      }
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= cutoffDate;
      });
    }
    setFilteredOrders(filtered);
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const firstItem = item.items[0];
    const product = firstItem?.product;

    if (!product) return null;

    const createdDate = new Date(item.created_at).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    const imageUrl = firstItem?.gallery?.[0]?.img_url || product.thumbnail_url || "";
    const renderFiveStars = ({ item }: { item: Order }) => {
      const product = item.items[0]?.product;

      let review = product.reviews?.find(
        (review) =>
          review.order_id === item.id && review.product_id === product.id
      );

      if (!review) {
        review = product.reviews?.find(
          (review) => review.product_id === product.id
        );
      }

      if (review) {
        const rating = parseInt(review.rating, 10) || 0;
        return (
          <View style={styles.reviewContainer}>
            <View style={styles.starContainer}>
              {[...Array(5)].map((_, index) => {
                const starNumber = index + 1;
                return (
                  <Ionicons
                    key={index}
                    name={starNumber <= rating ? "star" : "star-outline"}
                    size={24}
                    color={
                      starNumber <= rating
                        ? staticColors.discountText
                        : staticColors.textMuted
                    }
                    style={styles.starIcon}
                  />
                );
              })}
            </View>
            <Text style={styles.reviewText}>
              {textTruncate(review.review, 50, "...")}
            </Text>
          </View>
        );
      }

      return (
        <View style={styles.starContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                router.push({
                  pathname: "/review",
                  params: {
                    productId: product.id,
                    orderId: item.id,
                    productName: product.title,
                    productDescription: product.description,
                    productImage:
                      product.gallery?.[0]?.img_url ||
                      product.thumbnail_url ||
                      "",
                    productSize: item.items[0]?.selected_size || "",
                  },
                });
              }}
            >
              <Ionicons
                name="star-outline"
                size={24}
                color={staticColors.discountText}
                style={styles.starIcon}
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    return (
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/order/orderDetails",
            params: { orderId: item.id },
          });
        }}
      >
      <View style={styles.orderItem}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusIcon}>
            <Ionicons
              name="cube-outline"
              size={15}
              color={staticColors.white}
            />
          </Text>
          <View style={styles.statusContent}>
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === "Delivered"
                      ? staticColors.darkGreen
                      : item.status === "Cancelled"
                        ? staticColors.black
                        : staticColors.darkYellow,
                },
              ]}
            >
              {item.status}
            </Text>
            <Text style={styles.statusDetails}>on {createdDate}</Text>
          </View>
        </View>

        <View style={styles.productContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage]} />
          )}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>
              {textTruncate(product.title, 2, "")}
            </Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.productDescription}>
                {textTruncate(product.description, 5, "...")}
              </Text>
              <TouchableOpacity>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={staticColors.black}
                />
              </TouchableOpacity>
            </View>
            {firstItem?.selected_size && (
              <Text style={styles.productSize}>
                Size: {firstItem.selected_size}
              </Text>
            )}
          </View>
        </View>

        {item.status === "Delivered" && (
          <View style={styles.deliveredFooter}>
            <Text style={styles.exchangeText}>
              Exchange/Return window closed after two days
            </Text>
            {renderFiveStars({ item })}
          </View>
        )}
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={20} color={staticColors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={15}
            color={staticColors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search in orders"
            style={styles.searchInput}
            placeholderTextColor={staticColors.textMuted}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Ionicons
            name="filter"
            size={15}
            color={staticColors.black}
            style={styles.filterIcon}
          />
          <Text style={styles.filterText}>FILTER</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.noOrdersContainer}>
          <Image source={images.noOrderImage} style={styles.noOrdersImage} />
          <Text style={styles.noOrdersText}>Sorry! orders not found</Text>
          <Text style={styles.noOrdersSubText}>
            Try using different filter or go back to orders
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.orderList}
        />
      )}
      <OrderFilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.px10,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mx10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.white,
    ...spacingStyles.my10,
    gap: gapSizes.lg,
    ...spacingStyles.py10,
  },
  searchContainer: {
    backgroundColor: staticColors.white,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    ...spacingStyles.px10,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: borderRadius.r2,
    ...spacingStyles.ml10,
  },
  searchIcon: {
    ...spacingStyles.mr5,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: borderRadius.r2,
    ...spacingStyles.p10,
    ...spacingStyles.mr10,
  },
  filterIcon: {
    ...spacingStyles.mr5,
  },
  filterText: {
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
    fontWeight: fontWeights.semiBold,
  },
  orderList: {
    ...spacingStyles.pb10,
  },
  orderItem: {
    backgroundColor: staticColors.white,
    ...spacingStyles.mb10,
    ...spacingStyles.p10,
  },
  statusContainer: {
    flexDirection: "row",
    ...spacingStyles.mb10,
    alignItems: "center",
    gap: gapSizes.md,
  },
  statusContent: {
    flexDirection: "column",
  },
  statusIcon: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.p5,
    borderRadius: borderRadius.circle,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
  },
  statusDetails: {
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.bgSecondary,
    borderRadius: borderRadius.r5,
    ...spacingStyles.p10,
    ...spacingStyles.mb2,
  },
  productImage: {
    width: 60,
    height: 70,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mr10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
  },
  productSize: {
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productDescription: {
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
    flex: 1,
  },
  reviewContainer: {
    flexDirection: "column",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r2,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.sm,
  },
  starIcon: {
    ...spacingStyles.mr5,
  },
  reviewText: {
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
    ...spacingStyles.mt5,
  },
  deliveredFooter: {
    ...spacingStyles.p2,
  },
  exchangeText: {
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.p10,
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
    borderRadius: borderRadius.r2,
    ...spacingStyles.mb5,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: staticColors.errorColor,
    textAlign: "center",
    ...spacingStyles.mt10,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mt20,
  },
  noOrdersImage: {
    width: 250,
    height: 250,
    ...spacingStyles.mb20,
  },
  noOrdersText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: staticColors.black,
    ...spacingStyles.mb5,
  },
  noOrdersSubText: {
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
    textAlign: "center",
  },
});

export default OrderList;
