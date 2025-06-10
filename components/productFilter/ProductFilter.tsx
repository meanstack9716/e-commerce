import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import borderRadius from "@/style/borderRadius";
import { SubCategoryItem, Color } from "@/interfaces";
import { textTruncate } from "@/utils/textTruncate";
import gapSizes from "@/style/gapSizes";
import {
  PRODUCT_RANGE_MAX_PRICE,
  PRODUCT_RANGE_MIN_PRICE,
  NUMERIC_SIZES,
  STANDARD_SiZES,
} from "@/constants/constants";
import { useAppDispatch } from "@/store/hooks";
import { fetchColors } from "@/store/product/productsSlice";
import { ProductFilterProps } from "./ProductFilter.types";

const { width } = Dimensions.get("window");

const ProductFilter: React.FC<ProductFilterProps> = ({
  subCategories: initialSubCategories,
  sizes: initialSizes,
  colors: initialColors,
  priceMin: initialPriceMin,
  priceMax: initialPriceMax,
  onApplyFilters,
  onClearFilters,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const categories = useSelector((state: any) => state.categories.data);
  const {
    colors: availableColors,
    colorsLoading,
    colorsError,
  } = useSelector((state: any) => state.products);
  const [selectedSubCategories, setSelectedSubCategories] =
    useState<string[]>(initialSubCategories);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const [priceRange, setPriceRange] = useState({
    min: initialPriceMin,
    max: initialPriceMax ?? PRODUCT_RANGE_MAX_PRICE,
  });
  const [sizeType, setSizeType] = useState<"standard" | "numeric">("standard");

  useEffect(() => {
    dispatch(fetchColors());
  }, [dispatch]);

  const subCategories: SubCategoryItem[] = categories.flatMap(
    (category: any) => category.sub_categories || []
  );

  const sizes = sizeType === "standard" ? STANDARD_SiZES : NUMERIC_SIZES;

  const handleSelectedCategoryIds = (id: string) => {
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

  const handleApply = () => {
    onApplyFilters({
      subCategories: selectedSubCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      priceMin: priceRange.min,
      priceMax:
        priceRange.max >= PRODUCT_RANGE_MAX_PRICE ? null : priceRange.max,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedSubCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({
      min: PRODUCT_RANGE_MIN_PRICE,
      max: PRODUCT_RANGE_MAX_PRICE,
    });
    onClearFilters();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Filter</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={22} color={staticColors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContainer}
          >
            <View>
              <View style={styles.categoryRow}>
                {subCategories.map((item, index) => {
                  if (index % 2 === 0) {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.categoryCircle}
                        onPress={() => handleSelectedCategoryIds(item.id)}
                      >
                        <View style={styles.shadowWrapper}>
                          <Image
                            source={{ uri: item.img_url }}
                            style={styles.categoryImage}
                          />
                          {selectedSubCategories.includes(item.id) && (
                            <View style={styles.checkOverlay}>
                              <Ionicons
                                name="checkmark"
                                size={12}
                                color={staticColors.white}
                              />
                            </View>
                          )}
                        </View>
                        <Text style={styles.categoryText}>
                          {textTruncate(item.name, 1, "")}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })}
              </View>

              <View style={styles.categoryRow}>
                {subCategories.map((item, index) => {
                  if (index % 2 !== 0) {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.categoryCircle}
                        onPress={() => handleSelectedCategoryIds(item.id)}
                      >
                        <View style={styles.shadowWrapper}>
                          <Image
                            source={{ uri: item.img_url }}
                            style={styles.categoryImage}
                          />
                          {selectedSubCategories.includes(item.id) && (
                            <View style={styles.checkOverlay}>
                              <Ionicons
                                name="checkmark"
                                size={12}
                                color={staticColors.white}
                              />
                            </View>
                          )}
                        </View>
                        <Text style={styles.categoryText}>
                          {textTruncate(item.name, 1, "")}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.section}>
          <View style={styles.sizeHeader}>
            <Text style={styles.sectionTitle}>Size</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  sizeType === "standard" && styles.selectedButton,
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
                  Standard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  sizeType === "numeric" && styles.selectedButton,
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
                  Numeric
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sizeContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sizeScrollContent}
            >
              {sizes.map((size) => (
                <View
                  key={size}
                  style={{
                    width: selectedSizes.includes(size) ? 45 : 35,
                    height: 35,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.sizeButton,
                      selectedSizes.includes(size) && styles.selectedSizeButton,
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
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          {colorsLoading ? (
            <Text>Loading colors...</Text>
          ) : colorsError ? (
            <Text style={{ color: staticColors.errorColor }}>
              Error: {colorsError}
            </Text>
          ) : Array.isArray(availableColors) && availableColors.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorContainer}
            >
              {availableColors.map((color: Color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorCircle,
                    styles.shadowWrapper,
                    { backgroundColor: color.color },
                    selectedColors.includes(color.color) &&
                      styles.selectedColorCircle,
                  ]}
                  onPress={() => toggleColor(color.color)}
                >
                  {selectedColors.includes(color.color) && (
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
          ) : (
            <Text>No colors available</Text>
          )}
        </View>
        <View style={styles.section}>
          <View style={styles.priceContainer}>
            <Text style={styles.sectionTitle}>Price</Text>
            <Text style={styles.priceRangeText}>
              ₹{priceRange.min.toLocaleString()} — ₹
              {priceRange.max >= PRODUCT_RANGE_MAX_PRICE
                ? `${PRODUCT_RANGE_MAX_PRICE}+`
                : priceRange.max.toLocaleString()}
            </Text>
          </View>

          <View style={styles.rangeSliderContainer}>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderRange,
                  {
                    left: `${((priceRange.min - PRODUCT_RANGE_MIN_PRICE) / (PRODUCT_RANGE_MAX_PRICE - PRODUCT_RANGE_MIN_PRICE)) * 100}%`,
                    width: `${((priceRange.max - priceRange.min) / (PRODUCT_RANGE_MAX_PRICE - PRODUCT_RANGE_MIN_PRICE)) * 100}%`,
                  },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  {
                    left: `${((priceRange.min - PRODUCT_RANGE_MIN_PRICE) / (PRODUCT_RANGE_MAX_PRICE - PRODUCT_RANGE_MIN_PRICE)) * 100}%`,
                  },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  {
                    left: `${((priceRange.max - PRODUCT_RANGE_MIN_PRICE) / (PRODUCT_RANGE_MAX_PRICE - PRODUCT_RANGE_MIN_PRICE)) * 100}%`,
                  },
                ]}
              />
            </View>
            <Slider
              style={styles.invisibleSlider}
              minimumValue={PRODUCT_RANGE_MIN_PRICE}
              maximumValue={PRODUCT_RANGE_MAX_PRICE}
              step={100}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
              value={priceRange.min}
              onValueChange={(value) => {
                const newValue = Math.round(value);
                const minDist = Math.abs(newValue - priceRange.min);
                const maxDist = Math.abs(newValue - priceRange.max);

                if (minDist < maxDist) {
                  if (newValue < priceRange.max - 1000) {
                    setPriceRange((prev) => ({ ...prev, min: newValue }));
                  }
                } else {
                  if (newValue > priceRange.min + 100) {
                    setPriceRange((prev) => ({ ...prev, max: newValue }));
                  }
                }
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Same styles as in the original ProductFilterScreen
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
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.black,
  },
  sizeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb15,
  },
  categoryCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: (width - 50) / 5,
    ...spacingStyles.mb10,
    ...spacingStyles.mx2,
  },
  categoriesScrollContainer: {
    flexDirection: "column",
  },
  categoryRow: {
    flexDirection: "row",
    ...spacingStyles.mt10,
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
    borderWidth: borderRadius.r5,
    borderColor: staticColors.white,
  },
  categoryText: {
    fontSize: fontSizes.s,
    color: staticColors.black,
    textAlign: "center",
    fontFamily: fontFamilies.ralewayMedium,
    ...spacingStyles.pt5,
  },
  checkOverlay: {
    position: "absolute",
    top: 0,
    right: -5,
    width: 22,
    height: 22,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 2,
    borderColor: staticColors.white,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: gapSizes.md,
    ...spacingStyles.mt10,
    ...spacingStyles.mr5,
  },
  toggleButton: {
    ...spacingStyles.px20,
    ...spacingStyles.py5,
    borderRadius: borderRadius.r5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: staticColors.pink100,
  },
  selectedButton: {
    borderWidth: 1,
    borderColor: staticColors.primaryBlue,
    backgroundColor: staticColors.blue200,
  },
  toggleText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    fontFamily: fontFamilies.ralewayMedium,
  },
  selectedToggleText: {
    color: staticColors.primaryBlue,
    fontFamily: fontFamilies.ralewayBold,
  },
  sizeContainer: {
    backgroundColor: staticColors.skyBlue50,
    borderRadius: borderRadius.r16,
    overflow: "visible",
    width: width - 30,
  },
  sizeScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: width - 30,
  },
  sizeButton: {
    borderRadius: borderRadius.circle,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  selectedSizeButton: {
    width: 30,
    height: 30,
    backgroundColor: staticColors.white,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 0,
    position: "absolute",
    zIndex: 3,
    alignSelf: "center",
  },
  sizeText: {
    fontSize: fontSizes.xs,
    color: staticColors.skyBlue100,
    fontFamily: fontFamilies.ralewayExtraBold,
  },
  selectedSizeText: {
    color: staticColors.primaryBlue,
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
    ...spacingStyles.mx5,
  },
  selectedColorCircle: {
    borderColor: staticColors.primaryBlue,
    borderWidth: 1,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mx5,
    ...spacingStyles.mb20,
  },
  priceRangeText: {
    fontSize: fontSizes.md,
    color: staticColors.black,
    fontFamily: fontFamilies.ralewayMedium,
  },
  rangeSliderContainer: {
    height: 30,
    justifyContent: "center",
    ...spacingStyles.ml10,
    ...spacingStyles.mr25,
  },
  sliderTrack: {
    height: 5,
    backgroundColor: staticColors.skyBlue100,
    borderRadius: borderRadius.r2,
    position: "relative",
  },
  sliderRange: {
    height: 5,
    backgroundColor: staticColors.blue400,
    borderRadius: borderRadius.r2,
    position: "absolute",
    top: 0,
  },
  invisibleSlider: {
    position: "absolute",
    width: "100%",
    height: 50,
    opacity: 0,
    zIndex: 2,
  },
  sliderThumb: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.white,
    borderWidth: 2,
    borderColor: staticColors.skyBlue100,
    position: "absolute",
    top: -16,
    marginLeft: -10,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 3,
  },
  footer: {
    flexDirection: "row",
    ...spacingStyles.mb10,
    justifyContent: "space-between",
    gap: gapSizes.md,
  },
  clearButton: {
    flex: 0.3,
    ...spacingStyles.py10,
    borderWidth: 2,
    borderColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r12,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: fontSizes.lg,
    color: staticColors.primaryBlue,
    fontFamily: fontFamilies.nunitoSans,
  },
  applyButton: {
    flex: 0.7,
    ...spacingStyles.py10,
    backgroundColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r10,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: fontSizes.lg,
    color: staticColors.white,
    fontFamily: fontFamilies.nunitoSans,
  },
});

export default ProductFilter;
