import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import borderRadius from "@/style/borderRadius";

const UserProfile = () => {
  const handleOrder = () => {
    router.push({
      pathname: "/cart",
    });
  };
   const handleAccount = () => {
    router.push({
      pathname: "/accountManage",
    });
  };
  return (
    <ScrollView style={styles.container}>
 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, ...spacingStyles.p20 },
 
});

export default UserProfile;
