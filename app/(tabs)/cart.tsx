import NothingShoppingBagContent from "@/components/addToBag/NothingShoppingBagContent";
import ShoppingCartScreen from "@/components/addToBag/ShoppingCartScreen";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ShoppingBagScreen: React.FC = () => {
  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const onBackPress = () => {
      handleGoBack();
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContain}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SHOPPING BAG</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="heart-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>
     <ShoppingCartScreen />
      {/* <NothingShoppingBagContent /> */}
      {/* Main Content */}
      <View style={styles.content}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.whiteColor,
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
    fontSize: 16,
    fontWeight: "500",
    color: staticColors.darkGray,
  },
  iconButton: {
    ...spacingStyles.ml10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default ShoppingBagScreen;
