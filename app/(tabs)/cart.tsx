import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductInfoScreen from "@/components/addToBag/ProductInfoSection";
import ShoppingCartScreen from "@/components/addToBag/ShoppingCartScreen";
import { Button } from "@/components/common/Button";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import fontSizes from "@/style/fontSizes";

const ShoppingBagScreen: React.FC = () => {
  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {
    const handleHardwareBackPress = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleGoBack();
        return true;
      }
    );

    return () => handleHardwareBackPress.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContain}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SHOPPING BAG</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="heart-outline"
            size={22}
            color={staticColors.darkGray}
          />
        </TouchableOpacity>
      </View>
      <ShoppingCartScreen />
      <ProductInfoScreen />

      <Button
        title="PLACE ORDER"
        style={styles.PlaceButton}
        onPress={alert}
        textStyle={styles.PlaceText}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.px15,
    ...spacingStyles.py10,
  },
  backButton: {
    ...spacingStyles.p5,
  },
  headerContain: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: "500",
    color: staticColors.darkGray,
  },
  iconButton: {
    ...spacingStyles.ml10,
  },
  PlaceButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.p15,
    borderRadius: 0,
    marginBottom: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  PlaceText: { fontSize: fontSizes.base, letterSpacing: 1 },
});

export default ShoppingBagScreen;
