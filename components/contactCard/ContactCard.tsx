import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ContactCardProps } from "./ContactCard.types";

const ContactCard: React.FC<ContactCardProps> = ({
    title,
    information,
    onEditPress
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.infoWrapper}>
        <View style={styles.info}>
          {information.map((item, index) => (
            <Text key={index} style={styles.infoText}>{item}</Text>
          ))}
        </View>
        <TouchableOpacity style={styles.editIconWrapper}>
            <FontAwesome5 name="pen" size={16} color={staticColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: staticColors.gray300,
    flexDirection: "column",
    ...spacingStyles.mt10,
    ...spacingStyles.px15,
    ...spacingStyles.py10,
    borderRadius: borderRadius.r16,
  },
  cardTitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },
  infoWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.mt4
  },
  info: {
    width: "80%",
  },
  infoText: {
    fontFamily: fontFamilies.nunitoSans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold
  },
  editIconWrapper: {
    backgroundColor: staticColors.blue500,
    flexShrink: 0,
    borderRadius: borderRadius.circle,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  }
});

export default ContactCard;
