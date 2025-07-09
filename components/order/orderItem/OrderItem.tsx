import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { textTruncate } from "@/utils/textTruncate";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import { OrderItemProps } from "./orderItem.types";
import { LOCALE_DATE_FORMAT } from "@/constants/constants";

const OrderItem: React.FC<OrderItemProps> = ({ item, onReviewPress }) => {
  if (!item || !item.items || item.items.length === 0) return null;

  const firstItem = item.items[0];
  const product = firstItem?.product;
  if (!product || !product.id) return null;

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === "delivered") return staticColors.darkGreen;
    if (normalizedStatus === "return" || normalizedStatus === "cancelled")
      return staticColors.errorColor;
    return staticColors.darkYellow;
  };

  const createdDate = new Date(item.created_at).toLocaleDateString(
    LOCALE_DATE_FORMAT,
    {
      month: "short",
      day: "numeric",
    }
  );

  const imageUrl =
    firstItem?.gallery?.[0]?.img_url || product.thumbnail_url || "";

  const isDelivered = item.status.toLowerCase() === "delivered";

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.orderImage} />
      ) : null}

      <View style={styles.cardContent}>
        <Text
          style={[styles.statusText, { color: getStatusColor(item.status) }]}
        >
          Status : {item.status}
        </Text>

        <Text style={styles.description}>
          {textTruncate(product.description, 10, "...")}
        </Text>
        <Text style={styles.orderNumber}>OrderId #{item.id}</Text>

        <View style={styles.footer}>
          <View style={styles.button}>
            <Text style={styles.date}>{createdDate}</Text>
          </View>

          {isDelivered && (
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() =>
                  onReviewPress(item.id, product.id, product.description)
                }
              >
                <Text style={styles.reviewButtonText}>Review</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    ...spacingStyles.mb15,
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    ...spacingStyles.ml10,
    justifyContent: "space-between",
  },
  orderImage: {
    width: 150,
    height: 150,
    borderRadius: borderRadius.r14,
    borderWidth: 3,
    borderColor: staticColors.white,
    backgroundColor: staticColors.white,
    zIndex: 10,
    elevation: 10,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    resizeMode: "cover",
  },
  description: {
    fontSize: fontSizes.xs,
    color: staticColors.black,
    fontFamily: fontFamilies.nunitoSans,
    ...spacingStyles.my5,
  },
  orderNumber: {
    fontSize: 11,
    fontFamily: fontFamilies.ralewayeSemiBold,
    ...spacingStyles.mb10,
  },
  statusText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayBold,
    ...spacingStyles.mb5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.md,
  },
  button: {
    width: "45%",
  },
  date: {
    backgroundColor: staticColors.bgSoftGray,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py5,
    textAlign: "center",
    fontFamily: fontFamilies.ralewayeMedium,
    fontSize: fontSizes.base,
    width: "100%",
  },
  reviewButton: {
    borderWidth: 2,
    borderColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  reviewButtonText: {
    color: staticColors.primaryBlue,
    fontFamily: fontFamilies.ralewayeMedium,
    fontSize: fontSizes.base,
  },
});
