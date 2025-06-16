import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { AppDispatch, RootState } from "@/store/store";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import {
  fetchPromoCodes,
  applyPromoCode,
  removePromoCode,
} from "@/store/promoCode/promoCodeSlice";
import RenderHtml from "react-native-render-html";
import { CartItem } from "@/interfaces";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import gapSizes from "@/style/gapSizes";

const isPromoCodeValid = (
  startDate: string,
  expiryDate: string | null
): boolean => {
  const currentDate = new Date();
  const start = new Date(startDate);
  const expiry = expiryDate ? new Date(expiryDate) : null;
  return start <= currentDate && (!expiry || expiry >= currentDate);
};

interface PromoCodeSectionProps {
  selectedCartItems: CartItem[];
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
  selectedCartItems,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { promoCodes, loading, error, appliedPromoCode, loadingPromoCode } =
    useSelector((state: RootState) => state.promoCode);
  const token = useSelector((state: RootState) => state.auth.token);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (token) {
      dispatch(fetchPromoCodes());
    }
  }, [token, dispatch]);

  const handleRemovePromoCode = () => {
    dispatch(removePromoCode());
    Toast.show({
      type: "info",
      text1: "Promo Code Removed",
      text2: "The applied promo code has been removed.",
    });
  };

  const handleApplyPromoCode = (code: string) => {
    if (!selectedCartItems.length) {
      Toast.show({
        type: "error",
        text1: "No Items Selected",
        text2: "Please select at least one item to apply a promo code.",
      });
      return;
    }

    const cartItemIds = selectedCartItems.map((item) => item.id);
    dispatch(applyPromoCode({ code, cartItemIds }));
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
      Toast.show({
        type: "success",
        text1: "Success",
        text2: `Promo code ${appliedPromoCode} applied successfully!`,
      });
    }
  }, [error, appliedPromoCode]);

  const validPromoCodes = promoCodes.filter(
    (promo) =>
      promo.is_active && isPromoCodeValid(promo.start_date, promo.expiry_date)
  );

  if (loading && !promoCodes.length) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={staticColors.blue500} />
        <Text style={styles.loadingText}>Loading promo codes...</Text>
      </View>
    );
  }

  if (!validPromoCodes.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="wallet-giftcard"
              size={20}
              color={staticColors.black}
            />
            <Text style={styles.headerText}>Best Coupons For You</Text>
          </View>
          <TouchableOpacity style={styles.headerRight}>
            <Text style={styles.allCouponsText}>ALL COUPONS</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={staticColors.blue500}
            />
          </TouchableOpacity>
        </View>
        <Text>No valid promo codes available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="wallet-giftcard"
            size={20}
            color={staticColors.black}
          />
          <Text style={styles.headerText}>Best Coupons For You</Text>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.allCouponsText}>ALL COUPONS</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={staticColors.blue500}
          />
        </TouchableOpacity>
      </View>

      {validPromoCodes.map((promo, index) => {
        const discountText =
          promo.discount_type === "fixed"
            ? `Extra ₹${promo.discount_value} OFF`
            : `Extra ${promo.discount_value}% OFF`;
        const terms = [
          promo.min_order_amount
            ? `Min. order ₹${promo.min_order_amount}`
            : null,
          promo.max_discount_amount
            ? `Max discount ₹${promo.max_discount_amount}`
            : null,
        ]
          .filter(Boolean)
          .join(" | ");

        return (
          <View key={index} style={styles.promoCard}>
            <View style={styles.promoDetails}>
              <Text style={styles.discountText}>{discountText}</Text>
              {promo.description ? (
                <RenderHtml
                  contentWidth={width}
                  source={{ html: promo.description }}
                  baseStyle={styles.descriptionText}
                />
              ) : null}
              {terms && <Text style={styles.termsText}>{terms}</Text>}
              <View style={styles.promoCodeAndButtonContainer}>
                <View style={styles.promoCodeContainer}>
                  <Text style={styles.promoCodeText}>{promo.code}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.applyButton,
                    appliedPromoCode === promo.code && styles.appliedButton,
                  ]}
                  onPress={() =>
                    appliedPromoCode === promo.code
                      ? handleRemovePromoCode()
                      : handleApplyPromoCode(promo.code)
                  }
                  disabled={loadingPromoCode === promo.code}
                >
                  {loadingPromoCode === promo.code ? (
                    <ActivityIndicator
                      size="small"
                      color={staticColors.BoldPink}
                    />
                  ) : appliedPromoCode === promo.code ? (
                    <View style={styles.appliedButtonContent}>
                      <Text style={styles.appliedButtonText}>APPLIED</Text>
                      <Ionicons
                        name="close"
                        size={16}
                        color={staticColors.white}
                      />
                    </View>
                  ) : (
                    <Text style={styles.applyButtonText}>APPLY COUPON</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: staticColors.white,
    ...spacingStyles.py15,
    ...spacingStyles.px5,
    alignItems: "center",
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
  promoCard: {
    ...spacingStyles.mx5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: staticColors.blue500,
    borderWidth: 1,
    borderRadius: borderRadius.r8,
    ...spacingStyles.px15,
    ...spacingStyles.py10,
    ...spacingStyles.mb10,
  },
  promoDetails: {
    flex: 1,
  },
  discountText: {
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
    ...spacingStyles.mb5,
  },
  descriptionText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    ...spacingStyles.mb5,
  },
  termsText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.ralewayeSemiBold,
    color: staticColors.darkYellow,
    ...spacingStyles.mb10,
  },
  promoCodeAndButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promoCodeContainer: {
    borderWidth: 1,
    borderColor: staticColors.primaryBlue,
    borderStyle: "dashed",
    ...spacingStyles.p5,
    borderRadius: borderRadius.r4,
    alignSelf: "flex-start",
  },
  promoCodeText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.ralewayeSemiBold,
    color: staticColors.black,
  },
  applyButton: {
    borderColor: staticColors.BoldPink,
    borderWidth: 1,
    ...spacingStyles.p5,
    borderRadius: borderRadius.r5,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  appliedButton: {
    backgroundColor: staticColors.primaryBlue,
    borderColor: staticColors.white,
    ...spacingStyles.px10,
  },
  applyButtonText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.ralewayeSemiBold,
    color: staticColors.BoldPink,
  },
  appliedButtonText: {
    color: staticColors.white,
  },
  loadingText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    ...spacingStyles.mt10,
  },
  appliedButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.sm,
  },
});

export default PromoCodeSection;
