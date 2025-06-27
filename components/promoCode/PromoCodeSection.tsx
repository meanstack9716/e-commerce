import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { RootState } from "@/store/store";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import {
  fetchPromoCodes,
  applyPromoCode,
  removePromoCode,
} from "@/store/promoCode/promoCodeSlice";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import gapSizes from "@/style/gapSizes";
import PromoCodeSuccessModal from "@/modal/promoCodeModal/PromoCodeSuccessModal";
import PromoCodeModal from "@/modal/promoCodeModal/PromoCodeModal";
import { PromoCodeSectionProps } from "./PromoCode.types";
import { useAppDispatch } from "@/store/hooks";
import PromoCodeList from "./PromoCodeList";

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
  selectedCartItems,
  maxPromoCodes,
}) => {
  const dispatch = useAppDispatch();
  const { promoCodes, loading, error, appliedPromoCode, loadingPromoCode } =
    useSelector((state: RootState) => state.promoCode);
  const [promoCodeSuccessModalVisible, setPromoCodeSuccessModalVisible] =
    useState(false);
  const [promoCodeModalVisible, setPromoCodeModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchPromoCodes());
  }, [dispatch]);

  const handleSelectPromoCode = (code: string) => {
    const cartItemIds = selectedCartItems.map((item) => item.id);
    dispatch(applyPromoCode({ code, cartItemIds }));
  };

  const handleRemovePromoCode = () => {
    dispatch(removePromoCode());
    Toast.show({
      type: "info",
      text1: "Promo Code Removed",
      text2: "The applied promo code has been removed.",
    });
  };

  const handleAllCouponsModalClose = () => {
    setPromoCodeModalVisible(false);
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
      });
    }
    if (appliedPromoCode) {
      setPromoCodeSuccessModalVisible(true);
    }
  }, [error, appliedPromoCode]);

  const handleModalClose = () => {
    setPromoCodeSuccessModalVisible(false);
  };

  const displayedPromoCodes = maxPromoCodes
    ? promoCodes.slice(0, maxPromoCodes)
    : promoCodes;

  if (loading && !promoCodes.length && !loadingPromoCode) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={staticColors.blue500} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PromoCodeSuccessModal
        visible={promoCodeSuccessModalVisible}
        promoCode={appliedPromoCode}
        onClose={handleModalClose}
      />
      <PromoCodeModal
        visible={promoCodeModalVisible}
        onClose={handleAllCouponsModalClose}
        appliedPromoCode={appliedPromoCode}
        onSelectPromoCode={handleSelectPromoCode}
        promoCodes={promoCodes}
        loadingPromoCode={loadingPromoCode}
        onRemovePromoCode={handleRemovePromoCode}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="wallet-giftcard"
            size={20}
            color={staticColors.black}
          />
          <Text style={styles.headerText}>Best Coupons For You</Text>
        </View>
          <TouchableOpacity
            style={styles.headerRight}
            onPress={() => setPromoCodeModalVisible(true)}
          >
            <Text style={styles.allCouponsText}>ALL COUPONS</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={staticColors.blue500}
            />
          </TouchableOpacity>
      </View>

      <PromoCodeList
        promoCodes={displayedPromoCodes}
        appliedPromoCode={appliedPromoCode}
        loadingPromoCode={loadingPromoCode}
        onApplyPromoCode={handleSelectPromoCode}
        onRemovePromoCode={handleRemovePromoCode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: staticColors.white,
    ...spacingStyles.py10,
    ...spacingStyles.px5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb15,
    width: "100%",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
  },
  allCouponsText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.blue500,
  },
});

export default PromoCodeSection;
