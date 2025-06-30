import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, Text, Dimensions, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { fetchProducts } from "@/store/product/productsSlice";
import { RootState } from "@/store/store";
import { Product } from "@/types/types";
import ProductCard from "../home/ProductCard";
import ProductCardSkeleton from "../common/ProductCardSkeleton";
import Toast from "react-native-toast-message";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { LIST_LIMIT } from "@/constants/constants";
import { fontFamilies } from "@/style/fontFamilies";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 22;

const ProductMayYouLikeList: React.FC<{ activeTab: string }> = ({
  activeTab,
}) => {
  const dispatch = useAppDispatch();
  const {
    data: allProducts = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchProducts({ params: { page: 1, limit: LIST_LIMIT } }));
  }, [dispatch]);

  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || activeTab !== "ALL") return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const resultAction = await dispatch(
        fetchProducts({ params: { page: nextPage, limit: LIST_LIMIT } })
      );

      if (
        fetchProducts.fulfilled.match(resultAction) &&
        resultAction.payload?.data?.length > 0
      ) {
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Oops!",
        text2: "Something went wrong while loading more products.",
      });
    } finally {
      setLoadingMore(false);
    }
  }, [dispatch, page, hasMore, loadingMore, activeTab]);

  const toggleLike = (id: string) => {
    setLikedProductIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        id={item.id}
        images={item.images}
        title={item.title}
        final_price={item.final_price}
        discount_percent={item.discount_percent}
        thumbnail_url={item.thumbnail_url}
        star={item.star}
        liked={likedProductIds.includes(item.id)}
        onLikePress={() => toggleLike(item.id)}
        onPress={() =>
          router.navigate({
            pathname: "/ProductDetails",
            params: { id: item.id },
          })
        }
        cardWidth={cardWidth}
      />
    ),
    [likedProductIds]
  );

  const renderMessage = (message: string) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );

  if (activeTab !== "ALL") {
    return activeTab === "Your Next Favourites"
      ? renderMessage(
          "Based on your preferences, we'll recommend products here soon!"
        )
      : renderMessage("Similar product recommendations will appear here soon!");
  }

  return (
    <FlatList
      data={allProducts}
      renderItem={renderProductItem}
      keyExtractor={(item: Product) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={
        <View style={styles.emptyList}>
          <Text style={styles.messageText}>
            {loading
              ? "Loading products..."
              : error
                ? "Failed to load products."
                : "No products found."}
          </Text>
        </View>
      }
      ListFooterComponent={loadingMore ? <ProductCardSkeleton /> : null}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.5}
      onEndReached={loadMoreProducts}
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between",
    ...spacingStyles.px15,
    ...spacingStyles.mb10,
  },
  contentContainer: {
    ...spacingStyles.py10,
    ...spacingStyles.pb10,
  },
  emptyList: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.px20,
    ...spacingStyles.pb20,
  },
  messageText: {
    fontSize: fontSizes.sm,
    textAlign: "center",
    color: staticColors.textLightGray,
    fontFamily: fontFamilies.ralewayRegular,
  },
});

export default ProductMayYouLikeList;
