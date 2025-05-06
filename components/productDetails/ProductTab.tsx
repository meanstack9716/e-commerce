import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";

interface TabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProductTab: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ["ALL", "Similar", "Your Next Favourites"];

  return (
    <View style={tabStyles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            tabStyles.tab,
            activeTab === tab ? tabStyles.activeTab : null,
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              tabStyles.tabText,
              activeTab === tab ? tabStyles.activeTabText : null,
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProductTab;
const tabStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    ...spacingStyles.px10,
    ...spacingStyles.pt5,
    ...spacingStyles.pb25
  },
  tab: {
    ...spacingStyles.py5,
    ...spacingStyles.px15,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 20,
    ...spacingStyles.mr10,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: staticColors.textLightGray,
  },
  activeTabText: {
    color: staticColors.white,
    fontWeight: "600",
  },
});
