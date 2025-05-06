import GenuineProductModal from "@/modal/GenuineProductModal";
import QualityCheckModal from "@/modal/QualityCheckModal";
import fontSizes from "@/style/fontSizes";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ReturnPolicy: React.FC = () => {
  const [isGenuineProductModalVisible, setGenuineProductModalVisible] = useState(false);
  const [isQualityCheckModalVisible, setQualityCheckModalVisible] = useState(false);
  
  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <TouchableOpacity
          style={styles.badgeContainer}
          onPress={() => setGenuineProductModalVisible(true)}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/5579/5579919.png",
            }}
            style={styles.badgeImage}
          />
          <Text style={styles.badgeText}>Genuine Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.badgeContainer}  onPress={() => setQualityCheckModalVisible(true)}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/3098/3098533.png",
            }}
            style={styles.badgeImage}
          />
          <Text style={styles.badgeText}>Quality Checked</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.returnText}>Easy 7 days returns and exchanges</Text>
      <Text style={styles.subText}>
        Choose to return or exchange for a different size (if available) within
        7 days.
      </Text>
      <GenuineProductModal
        isVisible={isGenuineProductModalVisible}
        onClose={() => setGenuineProductModalVisible(false)}
      />
      <QualityCheckModal
        isVisible={isQualityCheckModalVisible}
        onClose={() => setQualityCheckModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...spacingStyles.p15,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    ...spacingStyles.mb20,
  },
  badgeContainer: {
    alignItems: "center",
    width: "20%",
  },
  badgeImage: {
    width: 50,
    height: 50,
  },
  badgeText: {
    color: staticColors.discountText,
    fontSize: fontSizes.base,
    fontWeight: "bold",
    textAlign: "center",
  },
  returnText: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
    color: staticColors.textDarkGray,
    ...spacingStyles.px15,
  },
  subText: {
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
    ...spacingStyles.px15,
  },
});

export default ReturnPolicy;
