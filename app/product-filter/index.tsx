import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import borderRadius from "@/style/borderRadius";
import { SubCategoryItem } from "@/interfaces";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { colors } from "@/constants/Colors";
import { textTruncate } from "@/utils/textTruncate";
import gapSizes from "@/style/gapSizes";
import { numericSizes, standardSizes } from "@/constants/constants";
const { width } = Dimensions.get("window");

const ProductFilterScreen: React.FC = () => {
  const categories = useSelector((state: any) => state.categories.data);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 100, max: 30000 });
  const [sizeType, setSizeType] = useState<"standard" | "numeric">("standard");

  const subCategories: SubCategoryItem[] = categories.flatMap(
    (category: any) => category.sub_categories || []
  );

  const sizes = sizeType === "standard" ? standardSizes : numericSizes;

  const toggleSubCategory = (id: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((item) => item !== colorName)
        : [...prev, colorName]
    );
  };

  const handleApplyFilters = () => {
    router.navigate({
      pathname: "/product-search",
      params: {
        subCategories: JSON.stringify(selectedSubCategories),
        sizes: JSON.stringify(selectedSizes),
        colors: JSON.stringify(selectedColors),
        priceMin: priceRange.min.toString(),
        priceMax: priceRange.max.toString(),
      },
    });
  };

  const handleClearFilters = () => {
    setSelectedSubCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({ min: 100, max: 30000 });
  };

  const renderSubCategoryItem = ({ item }: { item: SubCategoryItem }) => (
    <TouchableOpacity
      style={styles.categoryCircle}
      onPress={() => toggleSubCategory(item.id)}
    >
      <View style={styles.shadowWrapper}>
        <Image source={{ uri: item.img_url }} style={styles.categoryImage} />
        {selectedSubCategories.includes(item.id) && (
          <View style={styles.checkOverlay}>
            <Ionicons name="checkmark" size={12} color={staticColors.white} />
          </View>
        )}
      </View>
      <Text style={styles.categoryText}>{textTruncate(item.name, 1, "")}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaViewWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Filter</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={staticColors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={subCategories}
          renderItem={renderSubCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={5}
          contentContainerStyle={styles.categoryList}
          scrollEnabled={false}
        />

        <View style={styles.section}>
          <View style={styles.sizeHeader}>
            <Text style={styles.sectionTitle}>Size</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  sizeType === "standard" && styles.selectedToggleButton,
                ]}
                onPress={() => {
                  setSizeType("standard");
                  setSelectedSizes([]);
                }}
              >
                <Text
                  style={[
                    styles.toggleText,
                    sizeType === "standard" && styles.selectedToggleText,
                  ]}
                >
                  Clothes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  sizeType === "numeric" && styles.selectedToggleButton,
                ]}
                onPress={() => {
                  setSizeType("numeric");
                  setSelectedSizes([]);
                }}
              >
                <Text
                  style={[
                    styles.toggleText,
                    sizeType === "numeric" && styles.selectedToggleText,
                  ]}
                >
                  Shoes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sizeContainer}
          >
            {sizes.map((size) => (
              <View
                key={size}
                style={{
                  width: selectedSizes.includes(size) ? 45 : 35, // Placeholder width to maintain spacing
                  height: 35, // Match unselected button height
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.sizeButton,
                    selectedSizes.includes(size) && styles.selectedSizeButton,
                    selectedSizes.includes(size) && {
                      left: (45 - 35) / 2, // Center the larger selected button within the placeholder
                    },
                  ]}
                  onPress={() => toggleSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSizes.includes(size) && styles.selectedSizeText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorContainer}
          >
            {colors.map((color) => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorCircle,
                  styles.shadowWrapper,
                  { backgroundColor: color.color },
                  selectedColors.includes(color.name) &&
                    styles.selectedColorCircle,
                ]}
                onPress={() => toggleColor(color.name)}
              >
                {selectedColors.includes(color.name) && (
                  <View style={styles.checkOverlay}>
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={staticColors.white}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price</Text>
          <Text style={styles.priceRangeText}>
            ₹{priceRange.min.toLocaleString()} — ₹
            {priceRange.max.toLocaleString()}
          </Text>

          <View style={styles.rangeSliderContainer}>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderRange,
                  {
                    left: `${((priceRange.min - 100) / (30000 - 100)) * 100}%`,
                    width: `${
                      ((priceRange.max - priceRange.min) / (30000 - 100)) * 100
                    }%`,
                  },
                ]}
              />

              {/* Min Thumb */}
              <View
                style={[
                  styles.sliderThumb,
                  styles.minThumb,
                  {
                    left: `${((priceRange.min - 100) / (30000 - 100)) * 100}%`,
                  },
                ]}
              />

              {/* Max Thumb */}
              <View
                style={[
                  styles.sliderThumb,
                  styles.maxThumb,
                  {
                    left: `${((priceRange.max - 100) / (30000 - 100)) * 100}%`,
                  },
                ]}
              />
            </View>

            {/* Invisible sliders for interaction */}
            <Slider
              style={styles.invisibleSlider}
              minimumValue={100}
              maximumValue={30000}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
              value={priceRange.min}
              onValueChange={(value) => {
                const newMin = Math.round(value);
                // Ensure the min value doesn't exceed max - 1000
                if (newMin < priceRange.max - 1000) {
                  setPriceRange((prev) => ({ ...prev, min: newMin }));
                }
              }}
            />

            <Slider
              style={styles.invisibleSlider}
              minimumValue={100}
              maximumValue={30000}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
              value={priceRange.max}
              onValueChange={(value) => {
                const newMax = Math.round(value);
                // Ensure the max value doesn't go below min + 1000
                if (newMax > priceRange.min + 1000) {
                  setPriceRange((prev) => ({ ...prev, max: newMax }));
                }
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearFilters}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilters}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.px15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  headerText: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
  },
  section: {
    ...spacingStyles.mb20,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
  },
  sizeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  toggleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: staticColors.blue400,
    borderRadius: borderRadius.r5,
    overflow: "hidden",
  },
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: staticColors.white,
  },
  selectedToggleButton: {
    backgroundColor: staticColors.blue400,
  },
  toggleText: {
    fontSize: fontSizes.sm,
    color: staticColors.blue400,
    fontFamily: fontFamilies.nunitoSans,
  },
  selectedToggleText: {
    color: staticColors.white,
  },
  categoryList: {
    ...spacingStyles.my15,
  },
  categoryCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: (width - 50) / 5,
    ...spacingStyles.mb10,
    ...spacingStyles.mx2,
  },
  shadowWrapper: {
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: borderRadius.circle,
    overflow: "visible",
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.circle,
    borderWidth: 4,
    borderColor: staticColors.white,
  },
  categoryText: {
    fontSize: fontSizes.xs,
    color: staticColors.black,
    textAlign: "center",
    fontFamily: fontFamilies.nunitoSans,
  },
  checkOverlay: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  sizeButton: {
    width: 35,
    height: 35,
    borderRadius: borderRadius.circle,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: staticColors.white, 
    marginHorizontal: 5,
    position: "relative",
    zIndex: 1,
  },
  selectedSizeButton: {
    width: 45,
    height: 45,
    backgroundColor: staticColors.white,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 0,
    position: "absolute",
    top: -10, 
    zIndex: 3, 
    alignSelf: "center",
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5, 
    paddingHorizontal: 5,
    backgroundColor: staticColors.skyBlue50,
    borderRadius: borderRadius.r10,
    overflow: "visible", 
    height: 45, 
  },
  sizeText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    fontFamily: fontFamilies.nunitoSans,
  },
  selectedSizeText: {
    color: staticColors.black,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.py10,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.circle,
    borderWidth: 4,
    borderColor: staticColors.white,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedColorCircle: {
    borderColor: staticColors.primaryBlue,
    borderWidth: 1,
  },
  priceRangeText: {
    fontSize: fontSizes.md,
    color: staticColors.black,
    ...spacingStyles.mb10,
    textAlign: "center",
    fontFamily: fontFamilies.ralewayBold,
  },
  rangeSliderContainer: {
    height: 50,
    justifyContent: "center",
    ...spacingStyles.mt15,
    ...spacingStyles.mb10,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: staticColors.gray200,
    borderRadius: 2,
    position: "relative",
  },
  sliderRange: {
    height: 4,
    backgroundColor: staticColors.blue400,
    borderRadius: 2,
    position: "absolute",
    top: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: staticColors.white,
    borderWidth: 2,
    borderColor: staticColors.blue400,
    position: "absolute",
    top: -8,
    marginLeft: -10,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  minThumb: {
    zIndex: 2,
  },
  maxThumb: {
    zIndex: 2,
  },
  invisibleSlider: {
    position: "absolute",
    width: "100%",
    height: 40,
    opacity: 0,
  },
  footer: {
    flexDirection: "row",
    ...spacingStyles.mt15,
    ...spacingStyles.mb15,
  },
  clearButton: {
    flex: 1,
    ...spacingStyles.py10,
    borderWidth: 1,
    borderColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r10,
    alignItems: "center",
    marginRight: 10,
  },
  clearButtonText: {
    fontSize: fontSizes.lg,
    color: staticColors.primaryBlue,
    fontFamily: fontFamilies.nunitoSans,
  },
  applyButton: {
    flex: 1,
    ...spacingStyles.py10,
    backgroundColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r5,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: fontSizes.lg,
    color: staticColors.white,
    fontFamily: fontFamilies.nunitoSans,
  },
});

export default ProductFilterScreen;