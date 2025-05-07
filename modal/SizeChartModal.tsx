import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import fontSizes from "@/style/fontSizes";
import gapSizes from "@/style/gapSizes";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { Ionicons } from "@expo/vector-icons";
import ProductActionButtons from "@/components/productDetails/ProductActionButtons";

interface SizeChartModalProps {
  visible: boolean;
  onClose: () => void;
  product: {
    title: string;
    price: string;
    originalPrice: string;
    image: string;
  } | null;
}

const sizeChartDataCm = [
  {
    size: "XXS",
    bust: 86.4,
    front: 61,
    shoulder: 35.6,
    sleeve: 58,
    waist: 70,
    hips: 90,
    inseam: 76,
  },
  {
    size: "XS",
    bust: 91.4,
    front: 61,
    shoulder: 38.1,
    sleeve: 59,
    waist: 75,
    hips: 95,
    inseam: 77,
  },
  {
    size: "S",
    bust: 96.5,
    front: 63.5,
    shoulder: 38.1,
    sleeve: 60,
    waist: 80,
    hips: 100,
    inseam: 78,
  },
  {
    size: "M",
    bust: 101.6,
    front: 66,
    shoulder: 38.1,
    sleeve: 61,
    waist: 85,
    hips: 105,
    inseam: 79,
  },
  {
    size: "L",
    bust: 106.7,
    front: 68.6,
    shoulder: 40.6,
    sleeve: 62,
    waist: 90,
    hips: 110,
    inseam: 80,
  },
  {
    size: "XL",
    bust: 111.8,
    front: 71.1,
    shoulder: 40.6,
    sleeve: 63,
    waist: 95,
    hips: 115,
    inseam: 81,
  },
  {
    size: "XXL",
    bust: 116.8,
    front: 71.1,
    shoulder: 43.2,
    sleeve: 64,
    waist: 100,
    hips: 120,
    inseam: 82,
  },
];

const CM_TO_IN = 0.393701;

const SizeChartModal: React.FC<SizeChartModalProps> = ({
  visible,
  onClose,
  product,
}) => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [activeTab, setActiveTab] = useState<"measure" | "chart">("chart");
  const scrollViewRef = useRef<ScrollView>(null);
  const measurementRef = useRef<{ y: number }>({ y: 0 });
  const chartRef = useRef<{ y: number }>({ y: 0 });

  if (!product) {
    return null;
  }
  const convertToInches = (value: number) => (value * CM_TO_IN).toFixed(1);
  const displayData =
    unit === "cm"
      ? sizeChartDataCm
      : sizeChartDataCm.map((item) => ({
          ...item,
          bust: parseFloat(convertToInches(item.bust)),
          front: parseFloat(convertToInches(item.front)),
          shoulder: parseFloat(convertToInches(item.shoulder)),
          sleeve: parseFloat(convertToInches(item.sleeve)),
          waist: parseFloat(convertToInches(item.waist)),
          hips: parseFloat(convertToInches(item.hips)),
          inseam: parseFloat(convertToInches(item.inseam)),
        }));

  const handleTabPress = (tab: "measure" | "chart") => {
    setActiveTab(tab);
    if (scrollViewRef.current) {
      if (tab === "chart") {
        scrollViewRef.current.scrollTo({
          y: chartRef.current.y,
          animated: true,
        });
      } else if (tab === "measure") {
        scrollViewRef.current.scrollTo({
          y: measurementRef.current.y,
          animated: true,
        });
      }
    }
  };

  const handleChartLayout = (event: any) => {
    chartRef.current.y = event.nativeEvent.layout.y;
  };

  const handleMeasurementLayout = (event: any) => {
    measurementRef.current.y = event.nativeEvent.layout.y;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.backArrow}>
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color={staticColors.primary}
                />
              </Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Size Chart</Text>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View>
              <Text style={styles.productBrand}>RAREISM</Text>
              <Text style={styles.productType}>{product.title}</Text>
              <Text style={styles.productPrice}>
                ₹{product.price}{" "}
                <Text style={styles.originalPrice}>
                  ₹{product.originalPrice}
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "chart" && styles.activeTab]}
              onPress={() => handleTabPress("chart")}
              accessible={true}
              accessibilityLabel="Size Chart Tab"
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "chart" && styles.activeTabText,
                ]}
              >
                Size Chart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "measure" && styles.activeTab]}
              onPress={() => handleTabPress("measure")}
              accessible={true}
              accessibilityLabel="How to Measure Tab"
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "measure" && styles.activeTabText,
                ]}
              >
                How to Measure
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView ref={scrollViewRef} style={styles.contentScroll}>
            {/* Size Chart Table Section */}
            <View style={styles.section} onLayout={handleChartLayout}>
              <View style={styles.unitSwitcher}>
                <Text style={styles.unitLabel}>Select size in</Text>
                <View style={styles.unitToggle}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      unit === "in" ? styles.activeUnitButton : {},
                    ]}
                    onPress={() => setUnit("in")}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        unit === "in" && styles.activeUnitText,
                      ]}
                    >
                      in
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      unit === "cm" ? styles.activeUnitButton : {},
                    ]}
                    onPress={() => setUnit("cm")}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        unit === "cm" && styles.activeUnitText,
                      ]}
                    >
                      cm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                style={styles.tableScrollContainer}
              >
                <View style={styles.tableContainer}>
                  {/* Table Headers */}
                  <View style={styles.tableHeader}>
                    <Text
                      style={[styles.headerCell, styles.selectionCell]}
                    ></Text>
                    <Text style={[styles.headerCell, styles.sizeCell]}>
                      Size
                    </Text>
                    <View style={[styles.headerCell, styles.measurementHeader]}>
                      <Text style={styles.headerTextMain}>Bust</Text>
                      <Text style={styles.headerTextUnit}>({unit})</Text>
                    </View>
                    <View style={[styles.headerCell, styles.measurementHeader]}>
                      <Text style={styles.headerTextMain}>Front Length</Text>
                      <Text style={styles.headerTextUnit}>({unit})</Text>
                    </View>
                    <View style={[styles.headerCell, styles.measurementHeader]}>
                      <Text style={styles.headerTextMain}>Across Shoulder</Text>
                      <Text style={styles.headerTextUnit}>({unit})</Text>
                    </View>
                    <View style={[styles.headerCell, styles.measurementHeader]}>
                      <Text style={styles.headerTextMain}>Sleeve</Text>
                      <Text style={styles.headerTextUnit}>({unit})</Text>
                    </View>
                    <View style={[styles.headerCell, styles.measurementHeader]}>
                      <Text style={styles.headerTextMain}>Waist</Text>
                      <Text style={styles.headerTextUnit}>({unit})</Text>
                    </View>
                    <View style={[styles.headerCell, styles.measurementHeader]}>
                      <Text style={styles.headerTextMain}>Hips</Text>
                      <Text style={styles.headerTextUnit}>({unit})</Text>
                    </View>
                    <View style={[styles.headerCell, styles.measurementHeader]}>
                      <Text style={styles.headerTextMain}>Inseam</Text>
                      <Text style={styles.headerTextUnit}>({unit})</Text>
                    </View>
                  </View>

                  {/* Table Rows */}
                  {displayData.map((item, index) => (
                    <View key={index}>
                      <View style={styles.tableRow}>
                        <View style={styles.selectionCell}>
                          <TouchableOpacity
                            onPress={() => setSelectedSize(item.size)}
                            style={styles.radioCircle}
                            accessible={true}
                            accessibilityLabel={`Select size ${item.size}`}
                          >
                            {selectedSize === item.size && (
                              <View style={styles.radioDot} />
                            )}
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.sizeCell}>{item.size}</Text>
                        <Text style={styles.dataCell}>{item.bust}</Text>
                        <Text style={styles.dataCell}>{item.front}</Text>
                        <Text style={styles.dataCell}>{item.shoulder}</Text>
                        <Text style={styles.dataCell}>{item.sleeve}</Text>
                        <Text style={styles.dataCell}>{item.waist}</Text>
                        <Text style={styles.dataCell}>{item.hips}</Text>
                        <Text style={styles.dataCell}>{item.inseam}</Text>
                      </View>
                      {index < displayData.length - 1 && (
                        <View style={styles.rowDivider} />
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View style={styles.section} onLayout={handleMeasurementLayout}>
              <Text style={styles.sectionTitle}>How to Measure</Text>
              <Image
                source={{
                  uri: "https://media.istockphoto.com/id/1390532418/vector/men-t-shirt-design-with-size-chart-template.jpg?s=612x612&w=0&k=20&c=7E60sOr1V_JxRJ49US7cOJ5QqK1dpim5B-lSYB_BHyI=",
                }}
                style={styles.measurementImage}
                resizeMode="contain"
                onError={() => console.warn("Image failed to load")}
              />
              {/* Seller Info */}
              <Text style={styles.sellerInfo}>
                Seller: RADHAMANI TEXTILES PRIVATE LIMITED
              </Text>
            </View>
          </ScrollView>
        </View>

        <ProductActionButtons containerStyle={{ backgroundColor: "white" }} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: staticColors.white,
    ...spacingStyles.p15,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap:gapSizes.sm
  },
  backArrow: {
    fontSize: fontSizes['xl'],
    color: staticColors.black,
  },
  headerText: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: staticColors.primary,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.py15,
    ...spacingStyles.pb15,
    borderBottomWidth: 1,
    borderBottomColor: staticColors.borderLight,
  },
  productImage: {
    width: 75,
    height: 90,
    borderRadius: 4,
    ...spacingStyles.mr15,
  },
  productBrand: {
    fontWeight: "bold",
    fontSize: fontSizes.base,
    color: staticColors.shadowColor,
  },
  productType: {
    color: staticColors.darkGray,
    fontSize: fontSizes.sm,
    ...spacingStyles.my2,
  },
  productPrice: {
    color: staticColors.discountText,
    fontWeight: "600",
    fontSize: fontSizes.sm,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: staticColors.darkGray,
    fontWeight: "400",
  },
  tabContainer: {
    flexDirection: "row",
    ...spacingStyles.mb15,
    borderBottomWidth: 1,
    borderBottomColor: staticColors.lightGray,
  },
  tab: {
    flex: 1,
    ...spacingStyles.py10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: staticColors.discountText,
  },
  tabText: {
    fontSize:fontSizes.sm,
    color: staticColors.shadowColor,
  },
  activeTabText: {
    color: staticColors.discountText,
    fontWeight: "600",
  },
  contentScroll: {
    flex: 1,
    ...spacingStyles.mb15
  },
  section: {
   ...spacingStyles.mb15
  },
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
    color: staticColors.shadowColor,
    ...spacingStyles.mb10,
  },
  measurementImage: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  unitSwitcher: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb15,
  },
  unitLabel: {
    color: staticColors.shadowColor,
    fontSize: fontSizes.sm,
    marginRight: 8,
  },
  unitToggle: {
    flexDirection: "row",
    backgroundColor: staticColors.lightGray,
    borderRadius: 20,
    ...spacingStyles.p2,
  },
  unitButton: {
    ...spacingStyles.px20,
    ...spacingStyles.py10,
    borderRadius: 20,
  },
  activeUnitButton: {
    backgroundColor: staticColors.primary,
  },
  unitText: {
    color: staticColors.shadowColor,
    fontSize: fontSizes.sm,
  },
  activeUnitText: {
    color: staticColors.white,
  },
  tableScrollContainer: {},
  tableContainer: {},
  tableHeader: {
    flexDirection: "row",
    ...spacingStyles.p15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerCell: {
    minWidth: 90,
    fontWeight: "500",
    color:staticColors.darkGray,
    textAlign: "center",
  },
  measurementHeader: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextMain: {
    fontWeight: "500",
    color: staticColors.darkGray,
    fontSize: fontSizes.sm,
  },
  headerTextUnit: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
  },
  selectionCell: {
    minWidth: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeCell: {
    minWidth: 90,
    textAlign: "center",
    fontWeight: "500",
  },
  dataCell: {
    minWidth: 90,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    ...spacingStyles.p10,
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: staticColors.borderDark,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: staticColors.discountText,
  },
  rowDivider: {
    height: 1,
    backgroundColor: staticColors.borderLight,
  },
  sellerInfo: {
    ...spacingStyles.m10,
    fontSize: fontSizes.sm,
    color: staticColors.shadowColor,
  },
});

export default SizeChartModal;
