import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import { BlurView } from "expo-blur";
import { fontSizes, fontWeights } from "@/style/typography";
import {
  AvailableSize,
  ColorOption,
  ProductModalProps,
} from "./ProductVarientModal.types";
import spacingStyles from "@/style/spacingStyles";
import { fontFamilies } from "@/style/fontFamilies";

const ProductVarientModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  selectedSize,
  selectedColor,
  allSizes,
  availableColors,
  onSizeSelect,
  onColorSelect,
  price,
}) => {
  const [quantity, setQuantity] = useState(1);

  const selectedColorData = availableColors.find(
    (c) => c.color === selectedColor
  );
  const mainImage = selectedColorData?.images[0];

  const handleSizeSelect = (size: AvailableSize) => {
    if (size.left > 0) {
      onSizeSelect(size.label);
    }
  };

  const handleColorSelect = (colorOption: ColorOption) => {
    onColorSelect({
      color: colorOption.value,
      colorName: colorOption.color,
      images: colorOption.images,
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={50} tint="light" style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Image source={{ uri: mainImage }} style={styles.avatar} />
              <View>
                <Text style={styles.priceTag}>₹{price}</Text>

                <View style={styles.colorSizeRow}>
                  <Text style={styles.colorTag}>
                    {selectedColor || "No color"}
                  </Text>
                  <Text style={styles.sizeTag}>
                    {selectedSize || "No size"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.imageSizeContent}>
              <Text style={styles.sectionTitle}>Color Options</Text>
              <FlatList
                horizontal
                data={availableColors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleColorSelect(item)}
                    style={[
                      styles.colorOption,
                      selectedColor === item.color && styles.selectedColor,
                    ]}
                  >
                    <Image
                      source={{ uri: item.img_url }}
                      style={styles.colorImage}
                    />
                  </TouchableOpacity>
                )}
              />

              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizeContainer}>
                {allSizes.map((size) => (
                  <TouchableOpacity
                    key={size.label}
                    onPress={() => handleSizeSelect(size)}
                    style={[
                      styles.sizeButton,
                      selectedSize === size.label && styles.selectedSize,
                      size.left === 0 && styles.disabledSize,
                    ]}
                    disabled={size.left === 0}
                  >
                    <Text style={styles.sizeText}>{size.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.quantityContainer}>
                <Text style={styles.sectionTitle}>Quantity</Text>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    style={styles.quantityButton}
                  >
                    <Ionicons
                      name="remove"
                      size={fontSizes["xl"]}
                      color={staticColors.primaryBlue}
                    />
                  </TouchableOpacity>

                  <Text style={styles.quantity}>{quantity}</Text>

                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    style={styles.quantityButton}
                  >
                    <Ionicons
                      name="add"
                      size={fontSizes["xl"]}
                      color={staticColors.primaryBlue}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons
                    name="heart-outline"
                    size={26}
                    color={staticColors.darkSlate}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addToCartButton}>
                  <Text style={styles.buttonText}>Add to cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowButton}>
                  <Text style={styles.buttonText}>Buy now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modalView: {
    backgroundColor: staticColors.white,
    width: "100%",
    maxHeight: "80%",
    overflow: "hidden",
    borderTopRightRadius: borderRadius.r10,
    borderTopLeftRadius: borderRadius.r10,
  },
  content: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
    ...spacingStyles.p20,
    backgroundColor: staticColors.bgSoftBlue,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: borderRadius.r8,
    ...spacingStyles.mr15,
  },

  colorSizeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  priceTag: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.black,
    alignSelf: "flex-start",
    ...spacingStyles.py2,
  },

  colorTag: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.raleway,
    color: staticColors.darkSlate,
    backgroundColor: staticColors.iceBlue,
    ...spacingStyles.px10,
    ...spacingStyles.py2,
    borderRadius: borderRadius.r4,
  },
  sizeTag: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.raleway,
    color: staticColors.darkSlate,
    backgroundColor: staticColors.iceBlue,
    ...spacingStyles.px20,
    ...spacingStyles.py2,
    borderRadius: borderRadius.r4,
  },
  imageSizeContent: {
    ...spacingStyles.px20,
  },

  sectionTitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayExtraBold,
    ...spacingStyles.my10,
  },
  colorOption: {
    ...spacingStyles.mr10,
  },
  selectedColor: {},
  colorImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.r8,
  },
  sizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeButton: {
    width: 50,
    height: 25,
    borderRadius: borderRadius.r5,
    backgroundColor: staticColors.bgSoftGray,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mr5,
    ...spacingStyles.mb15,
  },

  selectedSize: {
    borderWidth: 1,
    borderColor: staticColors.primaryBlue,
    backgroundColor: staticColors.iceBlue,
  },
  disabledSize: {
    backgroundColor: staticColors.iceBlue,
    opacity: 0.2,
  },
  sizeText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayeMedium,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...spacingStyles.mt15,
    ...spacingStyles.mb25,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.circle,
    borderWidth: 2,
    borderColor: staticColors.primaryBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    width: 75,
    height: 50,
    borderRadius: borderRadius.r20,
    backgroundColor: staticColors.iceBlue,
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.ralewayeMedium,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  favoriteButton: {
    backgroundColor: staticColors.bgSoftGray,
    justifyContent: "center",
    borderRadius: borderRadius.r10,
    ...spacingStyles.p10,
  },
  addToCartButton: {
    backgroundColor: staticColors.darkSlate,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py10,

    justifyContent: "center",
    flex: 1,
    ...spacingStyles.mx15,
    alignItems: "center",
  },
  buyNowButton: {
    backgroundColor: staticColors.primaryBlue,
    borderRadius: 10,
    ...spacingStyles.py10,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: staticColors.textSoftGray,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.nunitoSans,
  },
});

export default ProductVarientModal;
