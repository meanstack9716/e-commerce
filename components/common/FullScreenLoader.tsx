import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal, Text } from "react-native";
import colors from "@/style/staticColors";
import staticColors from "@/style/staticColors";

interface FullScreenLoaderProps {
  visible: boolean;
  transparent?: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  visible,
  transparent = true,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={transparent} >
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: staticColors.modalOverlayLight,
  },
  loaderContainer: {
    alignItems: "center",
  },
});

export default FullScreenLoader;
