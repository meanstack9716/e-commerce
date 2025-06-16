import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { CartItem } from "@/interfaces";
import PromoCodeSection from "@/components/promoCode/PromoCodeSection";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { RootState } from "@/store/store";
import spacingStyles from "@/style/spacingStyles";

const PromoCode: React.FC = () => {
  const { selectedItems } = useLocalSearchParams();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const selectedCartItems: CartItem[] = (() => {
    if (!selectedItems) return [];
    const parsedItems: { id: string }[] = JSON.parse(selectedItems as string);
    const selectedIds = new Set(parsedItems.map((item) => item.id));
    return cartItems.filter((item) => selectedIds.has(item.id));
  })();

  return (
    <SafeAreaViewWrapper>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PromoCodeSection
          selectedCartItems={selectedCartItems}
          headerTitle="All Codes"
          showAllCouponsLink={false}
          shouldNavigateToCart={true}
        />
      </ScrollView>
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    ...spacingStyles.px5,
  },
});

export default PromoCode;
