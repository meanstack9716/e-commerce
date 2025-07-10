import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRewardHistory,
  fetchTotalRewardPoints,
} from "@/store/reward/rewardSlice";
import { fontSizes } from "@/style/typography";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import { LIST_LIMIT } from "@/constants/constants";
import RewardAndPointSkeleton from "@/components/referAndEarn/ReferAndEarnSkeelton";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";

const RewardAndPoint: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: rewardHistory,
    loading,
    error,
    totalPoints,
    currentPage,
    lastPage,
  } = useAppSelector((state) => state.reward);

  const [loadingMore, setLoadingMore] = useState(false);

  const loadInitialData = useCallback(() => {
    dispatch(fetchRewardHistory({ page: 1, limit: LIST_LIMIT }));
    dispatch(fetchTotalRewardPoints());
  }, [dispatch]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadMoreData = useCallback(() => {
    if (loadingMore || loading || currentPage >= lastPage) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    dispatch(fetchRewardHistory({ page: nextPage, limit: LIST_LIMIT }))
      .unwrap()
      .finally(() => setLoadingMore(false));
  }, [currentPage, dispatch, lastPage, loading, loadingMore]);

  // Render each reward history card
  const renderHistoryItem = ({ item }: { item: any }) => (
    <View style={styles.historyCard}>
      <View
        style={[
          styles.historyIcon,
          item.points > 0 ? styles.earnedIcon : styles.redeemedIcon,
        ]}
      >
        {item.points > 0 ? (
          <Ionicons name="gift" size={20} color={staticColors.alertSuccess} />
        ) : (
          <FontAwesome
            name="shopping-bag"
            size={18}
            color={staticColors.DarkRed}
          />
        )}
      </View>
      <View style={styles.historyContent}>
        <Text style={styles.historyReason}>{item.reason}</Text>
        <Text style={styles.historyDate}>
          {new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
      <Text
        style={[
          styles.historyPoints,
          item.points > 0 ? styles.positivePoints : styles.negativePoints,
        ]}
      >
        {item.points > 0 ? `+${item.points}` : item.points} pts
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return <RewardAndPointSkeleton />;
    }
    if (currentPage >= lastPage && rewardHistory.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Shop more, earn more — your next reward is waiting 🎁
          </Text>
        </View>
      );
    }
    return null;
  };

  //  when no reward history is found
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="gift-outline"
        size={48}
        color={staticColors.textMuted}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>Oops! Your reward bag is empty</Text>
      <Text style={styles.emptySubtext}>
        Buy something you love — points and perks will follow! 🎁
      </Text>
    </View>
  );

  if (loading && rewardHistory.length === 0) {
    return <RewardAndPointSkeleton />;
  }

  return (
    <SafeAreaViewWrapper style={styles.container}>
      {/* Top Header and Points */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Rewards</Text>
          <MaterialIcons name="redeem" size={24} color={staticColors.white} />
        </View>

        <View>
          <View style={styles.pointsCard}>
            <View style={styles.pointsHeader}>
              <Ionicons
                name="wallet"
                size={20}
                color={staticColors.white}
                style={styles.pointsIcon}
              />
              <Text style={styles.pointsLabel}>Available Points</Text>
            </View>
            <Text style={styles.pointsValue}>
              {totalPoints?.available_points || 0}
            </Text>
          </View>
          <View style={styles.pointsRow}>
            <View style={[styles.pointsCard, styles.smallCard]}>
              <View style={styles.pointsHeader}>
                <Ionicons
                  name="trending-up"
                  size={16}
                  color={staticColors.darkGreen}
                  style={styles.pointsIcon}
                />
                <Text style={styles.pointsLabel}>Earned</Text>
              </View>
              <Text style={styles.earnedPoints}>
                +{totalPoints?.total_earned || 0}
              </Text>
            </View>

            <View style={[styles.pointsCard, styles.smallCard]}>
              <View style={styles.pointsHeader}>
                <Ionicons
                  name="trending-down"
                  size={16}
                  color={staticColors.DarkRed}
                  style={styles.pointsIcon}
                />
                <Text style={styles.pointsLabel}>Redeemed</Text>
              </View>
              <Text style={styles.redeemedPoints}>
                {totalPoints?.total_redeemed || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Activity Header */}
      <View style={styles.activityHeader}>
        <Text style={styles.sectionTitle}>Recent Activity 🎉</Text>
      </View>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons
            name="error-outline"
            size={40}
            color={staticColors.errorColor}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        // Reward History List
        <FlatList
          data={rewardHistory}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgPrimary,
  },
  header: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.p20,
    borderBottomLeftRadius: borderRadius.r20,
    borderBottomRightRadius: borderRadius.r20,
    ...spacingStyles.mb15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb15,
  },
  headerTitle: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.white,
  },
  pointsCard: {
    backgroundColor: staticColors.RoyalBlue,
    borderRadius: borderRadius.r20,
    ...spacingStyles.p15,
  },
  pointsHeader: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb5,
  },
  pointsIcon: {
    ...spacingStyles.mr10,
  },
  smallCard: {
    flex: 1,
    ...spacingStyles.mx5,
    ...spacingStyles.mt10,
  },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pointsLabel: {
    fontSize: fontSizes.sm,
    color: staticColors.white,
    opacity: 0.8,
  },
  pointsValue: {
    fontSize: fontSizes["3xl"],
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.white,
  },
  earnedPoints: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.darkGreen,
  },
  redeemedPoints: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.DarkRed,
  },
  activityHeader: {
    ...spacingStyles.px20,
    ...spacingStyles.mb10,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.primary,
  },
  listContainer: {
    ...spacingStyles.px15,
  },
  historyCard: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r20,
    ...spacingStyles.p15,
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb12,
    shadowColor: staticColors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.circle,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mr10,
  },
  earnedIcon: {
    backgroundColor: staticColors.lightGreen50,
  },
  redeemedIcon: {
    backgroundColor: staticColors.lightRose,
  },
  historyContent: {
    flex: 1,
  },
  historyReason: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayMedium,
    color: staticColors.primary,
    ...spacingStyles.mb2,
  },
  historyDate: {
    fontSize: fontSizes.sm,
    color: staticColors.textMuted,
  },
  historyPoints: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.ralewayBold,
  },
  positivePoints: {
    color: staticColors.darkGreen,
  },
  negativePoints: {
    color: staticColors.DarkRed,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mx30,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayMedium,
    textAlign: "center",
    ...spacingStyles.mt15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mx30,
  },
  emptyIcon: {
    ...spacingStyles.mb15,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayMedium,
    color: staticColors.primary,
    textAlign: "center",
    ...spacingStyles.mb5,
  },
  emptySubtext: {
    fontSize: fontSizes.sm,
    color: staticColors.textMuted,
    textAlign: "center",
  },
  footerContainer: {
    ...spacingStyles.p10,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
  },
});

export default RewardAndPoint;
