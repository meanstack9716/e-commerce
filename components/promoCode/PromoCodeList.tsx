import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import gapSizes from "@/style/gapSizes";
import spacingStyles from "@/style/spacingStyles";
import { PromoCodeListProps } from "./PromoCode.types";

const PromoCodeList: React.FC<PromoCodeListProps> = ({
  promoCodes,
  appliedPromoCode,
  loadingPromoCode,
  onApplyPromoCode,
  onRemovePromoCode,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {promoCodes.length === 0 ? (
        <Text style={styles.noPromoText}>No valid promo codes available.</Text>
      ) : (
        promoCodes.map((promo, index) => {
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
                        ? onRemovePromoCode()
                        : onApplyPromoCode(promo.code)
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
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: staticColors.white,
    ...spacingStyles.py10,
    ...spacingStyles.px5,
  },
  noPromoText: {
    fontFamily: fontFamilies.ralewayMedium,
    fontSize: fontSizes.md,
    color: staticColors.black,
    textAlign: "center",
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
  appliedButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.sm,
  },
  appliedButtonText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.ralewayeSemiBold,
    color: staticColors.BoldPink,
  },
});

export default PromoCodeList;
