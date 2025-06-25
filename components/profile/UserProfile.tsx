import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { CategoriresCard } from "../categoriesCard";
import { useSelector } from "react-redux";
import { SafeAreaViewWrapper } from "../common/SafeAreaView/SafeAreaViewWrapper";
import ProductCard from "../home/ProductCard";
import images from "@/constants/images";
import { Product } from "@/interfaces";
import ProfileHeaderBar from "./ProfileHeaderBar/ProfileHeaderBar";
import gapSizes from "@/style/gapSizes";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { useAppDispatch } from "@/store/hooks";
import { fetchProducts } from "@/store/product/productsSlice";
import { PRODUCT_LIMIT } from "@/constants/constants";
import ProductCardSkeleton from "../common/ProductCardSkeleton";
import { RootState } from "@/store/store";

const UserProfile = () => {
  const [likedProductItems, setLikedProductItems] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = PRODUCT_LIMIT;
 
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: any) => state.categories);

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ params: { page: 1, limit } }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (products.length && !productsLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchProducts({ params: { page: nextPage, limit } })).then(
        (action) => {
          if (action.payload && Array.isArray(action.payload)) {
            setHasMore(action.payload.length === limit);
          } else {
            setHasMore(false);
          }
        }
      );
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      {...item}
      liked={likedProductItems.includes(item.id)}
      onLikePress={() => toggleProductLike(item.id)}
      onPress={() =>
        router.navigate({
          pathname: "/ProductDetails",
          params: { id: item.id },
        })
      }
    />
  );

  const toggleProductLike = (id: string) => {
    setLikedProductItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const isLoading = productsLoading;

  return (
    <View style={styles.container}>
      <ProfileHeaderBar
        title="category"
        profileImage={images.genderFemale}
        titleStyle={styles.profileHeaderTitle}
      />
      <CategoriresCard categoryList={categories} />
      <View style={styles.allProductsContainer}>
        <Text style={styles.headingText}>Just for you</Text>
        {isLoading ? (
          <View style={styles.skeletonContainer}>
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </View>
        ) : (
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products available</Text>
              </View>
            )}
            onEndReachedThreshold={0.2}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: gapSizes.sm,
    ...spacingStyles.px12,
    backgroundColor: staticColors.white,
  },
  profileHeaderTitle: {
    ...spacingStyles.pb5,
    ...spacingStyles.px15,
    backgroundColor: staticColors.primaryBlue,
    color: staticColors.white,
    fontFamily: fontFamilies.ralewayMedium,
    borderRadius: borderRadius.r16,
    fontSize: fontSizes.base,
    textAlign: "center",
  },
  headingText: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
  },
  allProductsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: gapSizes.lg,
  },
  emptyContainer: {
    ...spacingStyles.p20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: staticColors.textLightGray,
  },
  flatListContent: {
    padding: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    ...spacingStyles.mb10,
  },
  skeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    ...spacingStyles.pt10,
  },
});

export default UserProfile;
