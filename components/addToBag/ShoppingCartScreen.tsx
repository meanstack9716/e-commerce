import DeliveryModal from "@/modal/DeliveryModal";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

const ShoppingCartScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPinCode, setSelectedPinCode] = useState<string | null>(null);

  const handlePinCodeSelect = (pinCode: string) => {
    console.log("Selected Pincode:", pinCode);
    setSelectedPinCode(pinCode);
  };

  return (
    <View >
      <TouchableOpacity
        style={styles.deliverySection}
        onPress={() => setModalVisible(true)}
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
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <DeliveryModal
          onClose={() => setModalVisible(false)}
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
  deliveryText: { fontSize: 14, color: staticColors.shadowColor },
  enterPincode: {
    fontSize: 14,
    color: staticColors.offerColor,
    fontWeight: "bold",
  },
});

export default ShoppingCartScreen;
