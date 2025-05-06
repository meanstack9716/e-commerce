import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ExpandableContent from "../ui/ExpandableContent";
import colors from "@/style/staticColors";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
type FaqItem = {
  heading: string;
  description: string;
};

type FaqSectionProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  onPress: () => void;
  faqs: FaqItem[];
};

const FaqSection: React.FC<FaqSectionProps> = ({
  title,
  subtitle,
  buttonText,
  onPress,
  faqs,
}) => {
  return (
    <View>
      <View style={styles.headingContainer}>
        <Text style={textStyles.title}>{title}</Text>
        <Text style={textStyles.subtitle}>{subtitle}</Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      {faqs.map((faq, index) => (
        <ExpandableContent
          key={`${title}-${index}`}
          heading={faq.heading}
          description={faq.description}
        />
      ))}
    </View>
  );
};

export default FaqSection;

const styles = StyleSheet.create({
  headingContainer: {
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    borderStyle: "dotted",
    ...spacingStyles.mb15
  },
  button: {
    ...spacingStyles.py10,
    ...spacingStyles.px20,
    borderRadius: 5,
    ...spacingStyles.mb10,
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  buttonText: {
    color: colors.buttonPrimary,
    fontSize: fontSizes.sm,
    fontFamily:'HelveticaBold'
  },
  answer: {
    fontSize:fontSizes.sm,
    color: colors.buttonSecondary,
    ...spacingStyles.pt10
  },
});
