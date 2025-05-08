import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import DeliveryAddressModal from "@/modal/DeliveryAddressModal";
import fontSizes from "@/style/fontSizes";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";

const ShoppingCartScreen: React.FC = () => {
  const [isDeliveryAddressModalVisible, setIsDeliveryAddressModalVisible] =
    useState(false);
  const [selectedPinCode, setSelectedPinCode] = useState<string | null>(null);

  const handlePinCodeSelect = (pinCode: string) => {
    console.log("Selected Pincode:", pinCode);
    setSelectedPinCode(pinCode);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.deliverySection}
        onPress={() => setIsDeliveryAddressModalVisible(true)}
      >
        <Text style={styles.deliveryText}>
          {selectedPinCode
            ? `Delivering to: ${selectedPinCode}`
            : "Check delivery time & services"}
        </Text>
        <Text style={styles.enterPincode}>
          {selectedPinCode ? "CHANGE PIN" : "ENTER PIN CODE"}
        </Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeliveryAddressModalVisible}
        onRequestClose={() => setIsDeliveryAddressModalVisible(false)}
      >
        <DeliveryAddressModal
          onClose={() => setIsDeliveryAddressModalVisible(false)}
          onPinCodeSelect={handlePinCodeSelect}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  deliverySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.px20,
  },
  deliveryText: { fontSize: fontSizes.sm, color: staticColors.shadowColor },
  enterPincode: {
    fontSize: fontSizes.sm,
    color: staticColors.discountText,
    fontWeight: "bold",
  },
});

export default ShoppingCartScreen;
