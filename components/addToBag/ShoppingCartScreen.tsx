import DeliveryModal from "@/modal/DeliveryModal";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
} from "react-native";

const ShoppingCartScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.deliverySection}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.deliveryText}>Check delivery time & services</Text>
        <Text style={styles.enterPincode}>ENTER PIN CODE</Text>
      </TouchableOpacity>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <DeliveryModal onClose={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  deliverySection: {
    flexDirection: "row",
    justifyContent: "space-between",
   ...spacingStyles.px20,
  },
  deliveryText: { fontSize: 14, color: staticColors.shadowColor},
  enterPincode: { fontSize: 14, color: staticColors.offerColor, fontWeight: "bold" },
});

export default ShoppingCartScreen;
