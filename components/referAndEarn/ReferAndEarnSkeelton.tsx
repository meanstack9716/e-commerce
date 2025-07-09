import React from "react";
import { View, StyleSheet } from "react-native";
import staticColors from "@/style/staticColors";
import SkeletonPlaceholder from "../common/SkeletonPlaceholder ";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { SafeAreaViewWrapper } from "../common/SafeAreaView/SafeAreaViewWrapper";

const RewardAndPointSkeleton: React.FC = () => {
  return (
    <SafeAreaViewWrapper style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.historyCard}>
          <SkeletonPlaceholder style={styles.historyIcon} />
          <View style={styles.historyContent}>
            <SkeletonPlaceholder style={styles.historyReason} />
            <SkeletonPlaceholder style={styles.historyDate} />
          </View>
          <SkeletonPlaceholder style={styles.historyPoints} />
        </View>
      ))}
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgPrimary,
  },
  historyCard: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r20,
    ...spacingStyles.p15,
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb12,
    ...spacingStyles.mx15,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.circle,
    ...spacingStyles.mr10,
  },
  historyContent: {
    flex: 1,
  },
  historyReason: {
    height: 16,
    width: "70%",
    borderRadius: borderRadius.r4,
    ...spacingStyles.mb8,
  },
  historyDate: {
    height: 14,
    width: "50%",
    borderRadius: borderRadius.r4,
  },
  historyPoints: {
    height: 18,
    width: 60,
    borderRadius: borderRadius.r4,
  },
});

export default RewardAndPointSkeleton;
