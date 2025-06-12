import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductById } from "@/store/product/productsSlice";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import RatingReview from "@/components/productDetails/RatingReview/RatingReview";

const ReviewsScreen: React.FC = () => {
  const { productId } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct: product, selectedProductLoading: loading } =
    useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId as string));
    }
  }, [productId, dispatch]);

  return (
    <SafeAreaViewWrapper backgroundColor={staticColors.white}>
      <FullScreenLoader visible={loading} />
      <View style={styles.header}>
        <Text style={styles.title}>REVIEWS</Text>
      </View>

      <FlatList
        data={product?.reviews}
        renderItem={({ item }) => (
          <RatingReview productId={product?.id || ""} review={item} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reviews available</Text>
          </View>
        }
      />
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    ...spacingStyles.px20,
    ...spacingStyles.pt10,
    ...spacingStyles.pb5,
  },
  title: {
    fontSize: fontSizes["2xl"],
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
