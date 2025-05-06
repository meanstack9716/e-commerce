import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import categoryData from "../../assets/data/pockeFriendly.json";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";

const CategoryCard: React.FC<{
  imageUrl: string;
  price: string;
  category: string;
}> = ({ imageUrl, price, category }) => (
  <TouchableOpacity style={styles.cardContainer}>
    <ImageBackground source={{ uri: imageUrl }} style={styles.cardImage}>
      <View style={styles.textContainer}>
        <Text style={styles.priceLabel}>Under</Text>
        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const AffordableCategorySlider: React.FC = () => {
  const categories = categoryData.categories;
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const midIndex = Math.ceil(categories.length / 2);
  const row1Categories = categories.slice(0, midIndex);
  const row2Categories = categories.slice(midIndex);

  const screenWidth = Dimensions.get("window").width;
  const TRACK_WIDTH = 50;
  const FIXED_INDICATOR_WIDTH = 12;
  const maxTranslation = TRACK_WIDTH - FIXED_INDICATOR_WIDTH;
  const indicatorPosition =
    contentWidth > 0 && contentWidth > screenWidth
      ? (scrollX / (contentWidth - screenWidth)) * maxTranslation
      : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pocket Friendly Bargain!</Text>
          <Text style={styles.subtitle}>Where style matches savings</Text>
        </View>
        <Image
          source={{
            uri: "https://cdn3d.iconscout.com/3d/premium/thumb/indian-rupee-3d-icon-download-in-png-blend-fbx-gltf-file-formats--business-financial-cash-investment-coins-pack-finance-icons-7502488.png?f=webp",
          }} // Replace with your image URL or local image
          style={styles.headerImage}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => {
          setScrollX(event.nativeEvent.contentOffset.x);
        }}
        onContentSizeChange={(width) => {
          setContentWidth(width);
        }}
        scrollEventThrottle={15}
      >
        <View style={styles.rowsContainer}>
          <View style={styles.row}>
            {row1Categories.map((item, index) => (
              <CategoryCard
                key={`row1-${index}`}
                imageUrl={item.imageUrl}
                price={item.price}
                category={item.category}
              />
            ))}
          </View>
          <View style={styles.row}>
            {row2Categories.map((item, index) => (
              <CategoryCard
                key={`row2-${index}`}
                imageUrl={item.imageUrl}
                price={item.price}
                category={item.category}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicatorTrack, { width: TRACK_WIDTH }]}>
          <View
            style={[
              styles.indicator,
              {
                width: FIXED_INDICATOR_WIDTH,
                transform: [{ translateX: indicatorPosition }],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    ...spacingStyles.mb20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: staticColors.primary,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
    fontWeight: "500",
    lineHeight: 15,
  },
  headerImage: {
    width: 90,
    height: 90,
  },
  scrollContent: {},
  rowsContainer: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    ...spacingStyles.mb15,
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    width: 130,
    height: 180,
    ...spacingStyles.mr10,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  textContainer: {
    ...spacingStyles.p10,
  },
  priceLabel: {
    fontSize: fontSizes.base,
    color: staticColors.white,
    fontWeight: "500",
  },
  price: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: staticColors.white,
  },
  category: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: staticColors.white,
  },
  indicatorContainer: {
    alignItems: "center",
  },
  indicatorTrack: {
    height: 5,
    backgroundColor: staticColors.secondaryGray,
    borderRadius: 3,
  },
  indicator: {
    height: 5,
    backgroundColor: staticColors.primary,
    borderRadius: 3,
  },
});

export default AffordableCategorySlider;
