import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import ProductCard from "../home/ProductCard";
import { useLocalSearchParams, router } from "expo-router";
import { useSelector } from "react-redux";
import { fetchProducts } from "@/store/product/productsSlice";
import { RootState } from "@/store/store";
import { Product } from "@/types/types";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { LIST_LIMIT } from "@/constants/constants";
import { fontFamilies } from "@/style/fontFamilies";
import ProductTab from "./productTab/ProductTab";
import { useAppDispatch } from "@/store/hooks";
import ProductCardSkeleton from "../common/ProductCardSkeleton";

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / 2 - 22;

const ProductMayYouLike: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const dispatch = useAppDispatch();
  const {
    data: allProducts = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  // Fetch initial products
  useEffect(() => {
    dispatch(fetchProducts({ params: { page: 1, limit: LIST_LIMIT } }));
  }, [dispatch]);

  // Fetch more products
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || activeTab !== "ALL") return;

    setLoadingMore(true);
    const nextPage = page + 1;

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

    setLoadingMore(false);
  }, [dispatch, page, hasMore, loadingMore, activeTab]);

  const toggleLike = (id: string) => {
    setLikedProductIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const renderHeader = () => (
    <ProductTab activeTab={activeTab} setActiveTab={setActiveTab} />
  );

  const renderProductItem = ({ item }: { item: Product }) => (
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
  );

  const renderMessage = (message: string) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyList}>
      <Text style={styles.messageText}>
        {loading
          ? "Loading products..."
          : error
            ? "Failed to load products."
            : "No products found."}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ProductCardSkeleton />;
  };

  const renderContent = () => {
    if (activeTab === "Your Next Favourites") {
      return renderMessage(
        "Based on your preferences, we'll recommend your next favourite products here soon!"
      );
    }

    if (activeTab === "Similar") {
      return renderMessage(
        "Similar product recommendations will appear here soon!"
      );
    }

    return (
      <FlatList
        data={allProducts}
        renderItem={renderProductItem}
        keyExtractor={(item: Product) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
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

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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

export default ProductMayYouLike;
