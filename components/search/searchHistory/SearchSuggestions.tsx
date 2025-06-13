import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import gapSizes from "@/style/gapSizes";
import { SearchSuggestionsProps } from "./SearchSuggestions.types";

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  title,
  history,
  onItemPress,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>{title}</Text>
        <TouchableOpacity onPress={onClearHistory}>
          <Ionicons
            name="trash-outline"
            size={16}
            color={staticColors.red50}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.historyList}
      >
        {history.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.historyItem}
            onPress={() => onItemPress(item)}
          >
            <Text style={styles.historyItemText}>{item.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    ...spacingStyles.px5,
    ...spacingStyles.mb10,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  historyTitle: {
    fontSize: fontSizes.base,
    color: staticColors.darkSlate,
    fontFamily: fontFamilies.ralewayMedium,
  },
  historyList: {
    flexDirection: "row",
    gap: gapSizes.md,
  },
  iconStyle: {
    backgroundColor: staticColors.gray300,
    padding:8,
    borderRadius: borderRadius.circle,
  },
  historyItem: {
    backgroundColor: staticColors.gray50,
    borderRadius: borderRadius.r8,
    ...spacingStyles.py5,
    ...spacingStyles.px15,
  },
  historyItemText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    fontFamily: fontFamilies.ralewayMedium,
  },
});

export default SearchSuggestions;
