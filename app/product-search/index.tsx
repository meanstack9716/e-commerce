import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import gapSizes from "@/style/gapSizes";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { commonStyles } from "@/style/commonStyle";

export default function index() {
  return (
    <SafeAreaViewWrapper>
      <View style={commonStyles.searchContainer}>
        <Text style={commonStyles.searchContainerText}>Shop</Text>
        <View style={commonStyles.searchInputContainer}>
          <TextInput
            placeholder="Search"
            style={commonStyles.searchInput}
            placeholderTextColor={staticColors.gray200}
          />
          <TouchableOpacity>
            <Ionicons
              name="camera-outline"
              size={20}
              color={staticColors.blue400}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaViewWrapper>
  );
}

const styles = StyleSheet.create({

});
