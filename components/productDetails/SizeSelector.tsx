import SizeChartModal from "@/modal/SizeChartModal";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type SizeInfo = {
  label: string;
  left: number;
};

interface SizeSelectorProps {
  product: {
    id: string;
    image: string;
    title: string;
    price: string;
    star: number;
    categories: string[];
  } | null;
  originalPrice: string;
  onSizeChartOpen?: () => void; 
}

const sizes: SizeInfo[] = [
  { label: "XS", left: 0 },
  { label: "S", left: 3 },
  { label: "M", left: 2 },
  { label: "L", left: 3 },
  { label: "XL", left: 4 },
  { label: "XXL", left: 1 },
];

const SizeSelector: React.FC<SizeSelectorProps> = ({
  product,
  originalPrice,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("M");

  const handleSizeClick = (size: SizeInfo) => {
    if (size.left > 0) setSelectedSize(size.label);
  };
  const [showSizeChart, setShowSizeChart] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.labelText}>
          Size: <Text style={styles.bold}>{selectedSize}</Text>
        </Text>
        <TouchableOpacity onPress={() => setShowSizeChart(true)}>
          <Text style={styles.sizeChart}>Size Chart &gt;</Text>
        </TouchableOpacity>

        <SizeChartModal
          visible={showSizeChart}
          onClose={() => setShowSizeChart(false)}
          product={
            product
              ? {
                  title: product.title,
                  price: product.price,
                  originalPrice: originalPrice,
                  image: product.image,
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
        {sizes.map((size) => {
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

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.m10
  },
  labelText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  sizeChart: {
    color: staticColors.offerColor,
    fontWeight: "600",
    fontSize: 14,
  },
  sizeScroll: {
 
  },
  sizeOption: {
    alignItems: "center",
    ...spacingStyles.mr10
  },
  sizeButton: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: staticColors.whiteColor,
  },
  disabledButton: {
    backgroundColor: staticColors.backgroundMuted,
    borderColor: staticColors.borderSecondaryLight,
  },
  selectedButton: {
    backgroundColor: staticColors.shadowColor,
    borderColor: staticColors.shadowColor,
  },
  sizeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  disabledText: {
    color: staticColors.lightGray,
    textDecorationLine: "line-through",
  },
  selectedText: {
    color: staticColors.whiteColor,
  },
  leftText: {
    fontSize: 12,
    color:staticColors.offerColor,
   ...spacingStyles.mt5
  },
  lengthBox: {
    ...spacingStyles.p10,
    borderWidth: 1,
    borderColor: staticColors.lightColor,
    borderRadius: 12,
  },
  lengthLabel: {
    fontSize: 14,
    color: "#555",
  },
  lengthValue: {
    fontWeight: "bold",
    backgroundColor: "#eee",
    color: "#5b3ec8",
    borderRadius: 4,
  },
  measurements: {
    flexDirection: "row",
    flexWrap: "wrap",
    
  },
  measureText: {
    ...spacingStyles.mr10,
    fontSize: 13,
    color: "#333",
  },
});
