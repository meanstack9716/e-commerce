import GenuineProductModal from "@/modal/GenuineProductModal";
import QualityCheckModal from "@/modal/QualityCheckModal";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ReturnPolicy: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isQualityModalVisible, setQualityModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <TouchableOpacity
          style={styles.badgeContainer}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/5579/5579919.png",
            }}
            style={styles.badgeImage}
          />
          <Text style={styles.badgeText}>Genuine Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.badgeContainer}  onPress={() => setQualityModalVisible(true)}>
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
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
      <QualityCheckModal
        isVisible={isQualityModalVisible}
        onClose={() => setQualityModalVisible(false)}
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
    width: "40%",
  },
  badgeImage: {
    width: 70,
    height: 70,
  },
  badgeText: {
    color: staticColors.darkPink,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  returnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: staticColors.cardTitleColor,
    ...spacingStyles.px15,
  },
  subText: {
    fontSize: 12,
    color: staticColors.darkGray,
    ...spacingStyles.px15,
  },
});

export default ReturnPolicy;
