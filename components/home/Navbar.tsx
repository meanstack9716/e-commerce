import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import {fontSizes, fontWeights} from "@/style/typography";
import borderRadius from "@/style/borderRadius";

interface NavbarProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ tabs, activeTab, setActiveTab }) => {
  const handleTabPress = (tab: string) => {
    if (tab === "Categories") {
      router.navigate("/categories");
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.navbar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(tab)}
            style={styles.navItemWrapper}
          >
            {tab === "Categories" ? (
              <View style={styles.categoryTab}>
                <Ionicons name="grid-outline" size={20} color={staticColors.white} />
              </View>
            ) : (
              <Text
                style={[
                  styles.navItemText,
                  activeTab === tab && styles.activeNavItemText,
                ]}
              >
                {tab}
              </Text>
            )}
            {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    ...spacingStyles.pl15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  navItemWrapper: {
    alignItems: "center",
  },
  navItemText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
    fontFamily: "Helvetica",
  },
  activeLine: {
    ...spacingStyles.mt5,
    height: 2,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.r2,
  },
  activeNavItemText: {
    color: colors.primary,
    fontFamily: "HelveticaBold",
  },
  categoryTab: {
    backgroundColor: colors.primary,
   ...spacingStyles.p5,
    borderRadius: borderRadius.r8,
    borderWidth: 1,
    borderColor: colors.white,
    elevation: 3,
  },
});

export default Navbar;
