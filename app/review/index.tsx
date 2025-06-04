import React, { useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchProductById } from "@/store/product/productsSlice";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import staticColors from "@/style/staticColors";
import { SafeKeyboardView } from "@/components/common/SafeKeyboardView";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import { commonStyles } from "@/style/commonStyle";
import { Review } from "./review.types";
import images from "@/constants/images";

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

  const renderStars = (rating: string) => {
    const ratingValue = parseFloat(rating);
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <MaterialIcons
            key={index}
            name={index < ratingValue ? "star" : "star-outline"}
            size={20}
            color={staticColors.starYellow}
             style={commonStyles.starIcon}
          />
        ))}
      </View>
    );
  };

  const getUsername = (review: Review) => {
    const { first_name, last_name } = review.by;
    return `${first_name || "Unknown"} ${last_name || ""}`.trim();
  };

  const getAvatarSource = () => {
    return images.genderFemale;
  };

  const renderItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewContainer}>
      <Image source={getAvatarSource()} style={commonStyles.reviewAvtar} />
      <View style={styles.reviewContent}>
        <Text style={styles.name}>{getUsername(item)}</Text>
        {renderStars(item.rating)}
        <Text style={styles.reviewText}>{item.review}</Text>
        {item.img_urls && item.img_urls.length > 0 && (
          <FlatList
            horizontal
            data={item.img_urls}
            renderItem={({ item: imgUrl }) => (
              <Image
                source={{ uri: imgUrl }}
                style={commonStyles.reviewImage}
                resizeMode="cover"
              />
            )}
            keyExtractor={(imgUrl, index) => `review-img-${index}`}
            showsHorizontalScrollIndicator={false}
            style={commonStyles.reviewImageContainer}
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeKeyboardView backgroundColor={staticColors.white}>
      <FullScreenLoader visible={loading} />
      <View style={styles.header}>
        <Text style={styles.title}>REVIEWS</Text>
      </View>
      <FlatList
        data={product?.reviews as Review[] | undefined}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reviews available</Text>
          </View>
        }
      />
    </SafeKeyboardView>
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
    ...spacingStyles.mr10,
  },
  list: {
    ...spacingStyles.p15,
  },
  reviewContainer: {
    flexDirection: "row",
    ...spacingStyles.mb10,
  },
  reviewContent: {
    flex: 1,
  },
  name: {
   fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayeSemiBold,
    color: staticColors.black
  },
  starsContainer: {
    flexDirection: "row",
    ...spacingStyles.mb5
  },
  reviewText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    lineHeight: 20,
    ...spacingStyles.mb5
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.p15
  },
  emptyText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
  },
});

export default ReviewsScreen;