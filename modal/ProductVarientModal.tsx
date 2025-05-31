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

interface AvailableSize {
  label: string;
  left: number;
  sizeData: any;
}

interface ColorOption {
  id: string;
  color: string;
  value: string;
  img_url: string;
  stock_quantity: string;
  images: string[];
}

interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSize: string;
  selectedColor: string;
  allSizes: AvailableSize[];
  availableColors: ColorOption[];
  onSizeSelect: (size: string) => void;
  onColorSelect: (colorData: {
    color: string;
    colorName: string;
    images: string[];
  }) => void;
}

const ProductVarientModal: React.FC<ProductModalProps> = ({
  visible,
  onClose,
  selectedSize,
  selectedColor,
  allSizes,
  availableColors,
  onSizeSelect,
  onColorSelect,
}) => {
  const [quantity, setQuantity] = useState(1);

  // Find the selected color's images for the main image
  const selectedColorData = availableColors.find(
    (c) => c.color === selectedColor
  );
  const mainImage =
    selectedColorData?.images[0] || "https://via.placeholder.com/400x200";

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
      <BlurView intensity={40} tint="light" style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Image source={{ uri: mainImage }} style={styles.avatar} />
              <View>
                <Text style={styles.price}>$17.00</Text>
                <Text style={styles.color}>
                  {selectedColor || "No color selected"}
                </Text>
                <Text style={styles.size}>
                  {selectedSize || "No size selected"}
                </Text>
              </View>
            </View>

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

            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={24} color="black" />
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
    backgroundColor: "white",
    width: "100%",
    maxHeight: "80%",
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.r8,
    marginRight: 10,
  },
  price: {
    fontSize: fontSizes["2xl"],
    fontFamily: "Raleway",
    fontWeight: fontWeights.extraBold,
    color: staticColors.primary,
  },
  color: {
    fontSize: 16,
    color: "#666",
  },
  size: {
    fontSize: 16,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  colorOption: {
    marginRight: 10,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
  },
  selectedColor: {
    borderColor: "#007AFF",
  },
  colorImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  sizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSize: {
    borderColor: "#007AFF",
    backgroundColor: "#E6F0FA",
  },
  disabledSize: {
    backgroundColor: "#f0f0f0",
    opacity: 0.5,
  },
  sizeText: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 20,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  favoriteButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  addToCartButton: {
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
  },
  buyNowButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 15,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductVarientModal;
