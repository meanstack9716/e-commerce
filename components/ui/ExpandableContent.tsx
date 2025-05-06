import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Collapsible from "../Collapsible";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
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
    borderRadius: 8,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
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
