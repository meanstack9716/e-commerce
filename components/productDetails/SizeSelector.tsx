import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import SizeChartModal from "@/modal/SizeChartModal";
import { fontSizes, fontWeights } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";

import gapSizes from "@/style/gapSizes";
import ProductVarientModal from "@/modal/productVariants/ProductVarientModal";
import { NUMERIC_SIZES, STANDARD_SIZES } from "@/constants/constants";
import { SizeSelectorProps } from "./SizeSelector.types";
interface AvailableSize {
  label: string;
  left: number;
  sizeData: any;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  product,
  onColorSelect,
  onSizeSelect,
  price,
  handleLikePress,
  handleAddToCart,
  isLiked,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedColorName, setSelectedColorName] = useState<string>("");
  const [isProductVariantModalVisible, setIsProductVariantModalVisible] =
    useState(false);
  const [availableColors, setAvailableColors] = useState<
    Array<{
      id: string;
      color: string;
      value: string;
      img_url: string;
      stock_quantity: string;
      images: string[];
    }>
  >([]);

  const selectedColorImages =
    availableColors.find((c) => c.color === selectedColorName)?.images || [];

  const allPossibleSizes = useMemo(() => {
    if (!product || !product.sizes || product.sizes.length === 0) {
      return [];
    }
    const sizeType = product.sizes[0]?.size_type || "standard";
    return sizeType === "numeric" ? NUMERIC_SIZES : STANDARD_SIZES;
  }, [product]);

  const allSizes = useMemo((): AvailableSize[] => {
    if (!product || !product.sizes || product.sizes.length === 0) {
      return allPossibleSizes.map((size) => ({
        label: size,
        left: 0,
        sizeData: null,
      }));
    }
    return allPossibleSizes.map((size) => {
      const productSize = product.sizes!.find((s) => s.value === size);
      if (productSize) {
        const totalStock = productSize.variants.reduce(
          (sum, variant) => sum + parseInt(variant.stock_quantity || "0"),
          0
        );
        return { label: size, left: totalStock, sizeData: productSize };
      }
      return { label: size, left: 0, sizeData: null };
    });
  }, [allPossibleSizes, product]);

  useEffect(() => {
    const initialAvailableSize = allSizes.find((size) => size.left > 0);
    if (initialAvailableSize) {
      setSelectedSize(initialAvailableSize.label);
      updateAvailableColors(initialAvailableSize.sizeData);
      onSizeSelect(initialAvailableSize.label);
    } else {
      setSelectedSize("");
      setAvailableColors([]);
      onSizeSelect("");
    }
  }, [allSizes, onSizeSelect]);

  const updateAvailableColors = (sizeData: any) => {
    if (!sizeData || !sizeData.variants || sizeData.variants.length === 0) {
      setAvailableColors([]);
      setSelectedColor("");
      setSelectedColorName("");
      onColorSelect({ color: "", colorName: "", images: [] });
      return;
    }
    const colorsWithStock = sizeData.variants.filter(
      (variant: any) => parseInt(variant.stock_quantity || "0") > 0
    );
    const colorsWithImages = colorsWithStock.map((variant: any) => {
      const galleryItem = product?.gallery?.find(
        (item) =>
          item.color.trim().toLowerCase() === variant.name.trim().toLowerCase()
      );
      const colorImages =
        product?.gallery
          ?.filter(
            (item) =>
              item.color.trim().toLowerCase() ===
              variant.name.trim().toLowerCase()
          )
          ?.map((item) => item.img_url) || [];
      const imgUrl = galleryItem?.img_url || product?.thumbnail_url || "";
      const images =
        colorImages.length > 0
          ? colorImages
          : product?.thumbnail_url
            ? [product.thumbnail_url]
            : [];

      return {
        id: variant.id,
        color: variant.name,
        value: variant.value,
        img_url: imgUrl,
        stock_quantity: variant.stock_quantity,
        images: images,
      };
    });

    setAvailableColors(colorsWithImages);
    if (colorsWithImages.length > 0) {
      setSelectedColor(colorsWithImages[0].value);
      setSelectedColorName(colorsWithImages[0].color);
      onColorSelect({
        color: colorsWithImages[0].value,
        colorName: colorsWithImages[0].color,
        images: colorsWithImages[0].images,
      });
    } else {
      setSelectedColor("");
      setSelectedColorName("");
      onColorSelect({ color: "", colorName: "", images: [] });
    }
  };

  const handleSizeClick = (size: AvailableSize) => {
    if (size.left > 0) {
      setSelectedSize(size.label);
      updateAvailableColors(size.sizeData);
      onSizeSelect(size.label);
      if (selectedColor && availableColors.length > 0) {
        const selectedColorData = availableColors.find(
          (c) => c.color === selectedColor
        );
        if (selectedColorData) {
          onColorSelect({
            color: selectedColorData.color,
            colorName: selectedColorData.color,
            images: selectedColorData.images,
          });
        }
      }
    }
  };

  const handleColorClick = (colorOption: {
    color: string;
    value: string;
    images: string[];
  }) => {
    setSelectedColor(colorOption.value);
    setSelectedColorName(colorOption.color);
    onColorSelect({
      color: colorOption.value,
      colorName: colorOption.color,
      images: colorOption.images,
    });
  };

  const isNumericSizes =
    product?.sizes && product.sizes[0]?.size_type === "numeric";

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerRow}>
        <View style={styles.selectionContainer}>
          <Text style={styles.variationsText}>Variations</Text>
          <Text style={styles.selectionText}>{selectedColorName || ""}</Text>
          <Text style={styles.selectionText}>{selectedSize || ""}</Text>
        </View>
        <TouchableOpacity onPress={() => setIsProductVariantModalVisible(true)}>
          <AntDesign
            name="arrowright"
            size={20}
            color={staticColors.white}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      {availableColors.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {availableColors.map((colorOption) => (
            <TouchableOpacity
              key={colorOption.id}
              onPress={() => handleColorClick(colorOption)}
              style={styles.imageOption}
            >
              <Image
                source={{ uri: colorOption.img_url }}
                style={styles.variationImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noColorsText}>No variations available</Text>
      )}
      <ProductVarientModal
        visible={isProductVariantModalVisible}
        onClose={() => setIsProductVariantModalVisible(false)}
        selectedSize={selectedSize}
        selectedColor={selectedColorName}
        allSizes={allSizes}
        availableColors={availableColors}
        price={price}
        productId={product?.id}
        onSizeSelect={(size) => {
          const sizeData = allSizes.find((s) => s.label === size);
          if (sizeData) {
            handleSizeClick(sizeData);
          }
        }}
        onColorSelect={(colorData) => {
          handleColorClick({
            color: colorData.colorName,
            value: colorData.color,
            images: colorData.images,
          });
        }}
        handleLikePress={handleLikePress}
        handleAddToCart={handleAddToCart}
        isLiked={isLiked}
      />
    </View>
  );
};

export default SizeSelector;

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: gapSizes.xxl,
  },
  variationsText: {
    fontSize: fontSizes.lg,
    fontFamily: "RalewayeExtraBold",
    color: staticColors.black,
    ...spacingStyles.mr10,
  },

  selectionText: {
    fontSize: fontSizes.sm,
    fontFamily: "RalewayeSemiBold",
    color: staticColors.black,
    textTransform: "capitalize",
    ...spacingStyles.mr10,
  },
  arrowIcon: {
    backgroundColor: staticColors.primaryBlue,
    borderRadius: borderRadius.circle,
    padding: 8,
    fontWeight: fontWeights.extraBold,
  },
  imageScroll: {
    flexGrow: 0,
  },
  imageOption: {
    ...spacingStyles.my15,
    ...spacingStyles.mr10,
    borderRadius: borderRadius.r12,
    overflow: "hidden",
  },
  variationImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.r12,
    backgroundColor: staticColors.lightGray,
  },

  noColorsText: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    ...spacingStyles.mt10,
  },
});
