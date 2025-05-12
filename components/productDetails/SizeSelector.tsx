import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import SizeChartModal from "@/modal/SizeChartModal";
import fontSizes from "@/style/fontSizes";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { Product } from "../../types/types";
import { AntDesign } from "@expo/vector-icons";

interface SizeSelectorProps {
  product: Product | null;
  onColorSelect: (colorData: {
    color: string;
    images: string[];
  }) => void;
}

const allPossibleSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const SizeSelector: React.FC<SizeSelectorProps> = ({ product , onColorSelect }) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [availableColors, setAvailableColors] = useState<
    Array<{
      id: string;
      color: string;
      img_url: string;
      stock_quantity: string;
      images: string[];
    }>
  >([]);

  const availableSizes = allPossibleSizes.map((size) => {
    const productSize = product?.sizes?.find((s) => s.value === size);
    if (productSize) {
      const totalStock = productSize.variants.reduce(
        (sum, variant) => sum + parseInt(variant.stock_quantity || "0"),
        0
      );
      return { label: size, left: totalStock, sizeData: productSize };
    }
    return { label: size, left: 0, sizeData: null };
  });

  useEffect(() => {
    const firstAvailableSize = availableSizes.find((size) => size.left > 0);
    if (firstAvailableSize) {
      setSelectedSize(firstAvailableSize.label);
      updateAvailableColors(firstAvailableSize.sizeData);
    } else {
      setSelectedSize("");
      setAvailableColors([]);
    }
  }, [product]);

  const updateAvailableColors = (sizeData: any) => {
    if (!sizeData || !sizeData.variants || sizeData.variants.length === 0) {
      setAvailableColors([]);
      setSelectedColor(""); 
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
      const colorImages = product?.gallery
      ?.filter(item => item.color.trim().toLowerCase() === variant.name.trim().toLowerCase())
      ?.map(item => item.img_url) || [];
      const imgUrl = galleryItem?.img_url || product?.thumbnail_url;
      const images = colorImages.length > 0 ? colorImages : (product?.images || []);

      return {
        id: variant.id,
        color: variant.name,
        img_url: imgUrl,
        stock_quantity: variant.stock_quantity,
        images: images,
      };
    });

    setAvailableColors(colorsWithImages);
    if (colorsWithImages.length > 0) {
      setSelectedColor(colorsWithImages[0].color);
      onColorSelect({
        color: colorsWithImages[0].color,
        images: colorsWithImages[0].images,
      });
    } else {
      setSelectedColor("");
    }
  };

  const handleSizeClick = (size: {
    label: string;
    left: number;
    sizeData: any;
  }) => {
    if (size.left > 0) {
      setSelectedSize(size.label);
      updateAvailableColors(size.sizeData);
    }
  };

  const handleColorClick = (colorOption: {
    color: string;
    images: string[];
  }) => {
    setSelectedColor(colorOption.color);
    onColorSelect({
      color: colorOption.color,
      images: colorOption.images,
    });
  };


  return (
    <View style={styles.container}>
      {availableColors.length > 0 ? (
        <View style={styles.colorSection}>
          <Text style={styles.colorTitle}>
            Color:{" "}
            <Text style={styles.bold}>{selectedColor}</Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.colorScroll}
          >
            {availableColors.map((colorOption) => {
              const isColorSelected = selectedColor === colorOption.color;

              return (
                <TouchableOpacity
                  key={colorOption.id}
                  onPress={() => handleColorClick(colorOption)}
                  style={[
                    styles.colorOption,
                    isColorSelected && styles.selectedColorOption,
                  ]}
                >
                  <Image
                    source={{ uri: colorOption.img_url }}
                    style={styles.colorImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.colorName}>{colorOption.color}</Text>
                  <Text style={styles.colorStock}>
                    {colorOption.stock_quantity} left
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.noColorsText}>
          No colors available for this size
        </Text>
      )}
      <View style={styles.headerRow}>
        <Text style={styles.labelText}>
          Size:{" "}
          <Text style={styles.bold}>{selectedSize}</Text>
        </Text>
        <TouchableOpacity onPress={() => setShowSizeChart(true)}>
          <Text style={styles.sizeChart}>
            Size Chart{" "}
            <AntDesign
              name="right"
              size={12}
              color={staticColors.discountText}
            />
          </Text>
        </TouchableOpacity>

        <SizeChartModal
          visible={showSizeChart}
          onClose={() => setShowSizeChart(false)}
          product={
            product
              ? {
                  title: product.title,
                  price: product.final_price,
                  image:
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "",
                }
              : null
          }
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sizeScroll}
      >
        {availableSizes.map((size) => {
          const isSelected = selectedSize === size.label;
          const isDisabled = size.left === 0;

          return (
            <View key={size.label} style={styles.sizeOption}>
              <TouchableOpacity
                disabled={isDisabled}
                onPress={() => handleSizeClick(size)}
                style={[
                  styles.sizeButton,
                  isDisabled && styles.disabledButton,
                  isSelected && styles.selectedButton,
                ]}
              >
                 {isDisabled && <View style={styles.diagonalLine} />}
                 {isDisabled && <View style={styles.diagonalLine1} />}
                <Text
                  style={[
                    styles.sizeLabel,
                    isDisabled && styles.disabledText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {size.label}
                </Text>
              </TouchableOpacity>
              {size.left > 0 && (
                <Text style={styles.leftText}>{size.left} left</Text>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.lengthBox}>
        <Text>
          <Text style={styles.lengthLabel}>Length: </Text>
          <Text style={styles.lengthValue}>Regular</Text>
        </Text>
        <View style={styles.measurements}>
          <Text style={styles.measureText}>Bust: 40.0in</Text>
          <Text style={styles.measureText}>Front Length: 26.0in</Text>
          <Text style={styles.measureText}>Across Shoulder: 15.0in</Text>
        </View>
      </View>
    </View>
  );
};

export default SizeSelector;

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: fontSizes.base,
  },
  bold: {
    fontWeight: "bold",
  },
  sizeChart: {
    color: staticColors.discountText,
    fontWeight: "600",
    fontSize: fontSizes.sm,
  },
  sizeScroll: {
   ...spacingStyles.mb10
  },
  sizeOption: {
    alignItems: "center",
    ...spacingStyles.mr10,
    ...spacingStyles.py15,
  },
  sizeButton: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: staticColors.white,
  },
  disabledButton: {
    backgroundColor: staticColors.white,
    borderColor: staticColors.borderSecondaryLight,
 
  },
  selectedButton: {
    backgroundColor: staticColors.shadowColor,
    borderColor: staticColors.shadowColor,
  },
  sizeLabel: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
  disabledText: {
    color: staticColors.textLightGray,
    // textDecorationLine: "line-through",
  },
  selectedText: {
    color: staticColors.white,
  },
  leftText: {
    fontSize: fontSizes.xs,
    color: staticColors.discountText,
    ...spacingStyles.mt5,
  },
  colorSection: {
 ...spacingStyles.mb10
  },
  colorTitle: {
    fontSize: fontSizes.base,
    ...spacingStyles.mb10
  },
  colorScroll: {
    flexGrow: 0,
  },
  colorOption: {
    marginRight: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    ...spacingStyles.p5
  },
  selectedColorOption: {
    borderColor: staticColors.darkGray,
  },
  colorImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
  },
  colorName: {
    fontSize: fontSizes.xs,
    fontWeight: "600",
    ...spacingStyles.mt5
  },
  colorStock: {
    fontSize: fontSizes.xs,
    color: staticColors.discountText,
  },
  noColorsText: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    ...spacingStyles.mt10
  },
  lengthBox: {
    ...spacingStyles.p10,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 10,
  },
  lengthLabel: {
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
  },
  lengthValue: {
    fontWeight: "bold",
    backgroundColor: staticColors.lightGray,
    color: staticColors.slateBlue,
    borderRadius: 4,
  },
  measurements: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  measureText: {
    ...spacingStyles.mr10,
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
  },

  diagonalLine: {
    position: 'absolute',
    width: '130%', 
    height: 1,
    backgroundColor: staticColors.lightGray,
    transform: [{ rotate: '45deg' }],
    top: '50%',
    left: '-18%',
    zIndex: 1,
  },
  
  diagonalLine1: {
    position: 'absolute',
    width: '130%', 
    height: 1,
    backgroundColor: staticColors.lightGray,
    transform: [{ rotate: '-45deg' }],
    top: '50%',
    left: '-18%',
    zIndex: 1,
  },
  
});