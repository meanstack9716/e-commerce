import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Collapsible from "../Collapsible";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import {fontSizes, fontWeights} from "@/style/typography";
import borderRadius from "@/style/borderRadius";
interface ExpandableContentProps {
  heading: string;
  description: string;
  number?: number;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  heading,
  description,
  number,
}) => {
  return (
    <View style={styles.faqContainer}>
      <Collapsible
        title={
          <View style={styles.headingRow}>
            {number !== undefined && (
              <Text style={styles.number}>{number}.</Text>
            )}
            <Text style={styles.heading}>{heading}</Text>
          </View>
        }
      >
        <Text style={styles.answer}>{description}</Text>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  faqContainer: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r8
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: "black",
    ...spacingStyles.mr5,
  },
  heading: {
    fontSize: fontSizes.sm,
    fontFamily:'HelveticaBold',
    color: staticColors.darkGray,
    flexShrink: 1,
  },
  answer: {
    textAlign: "justify",
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
    fontFamily:'Helvetica'
  },
});

export default ExpandableContent;
