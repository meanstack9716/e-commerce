import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import ExpandableContent from "../ui/ExpandableContent";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import {fontSizes} from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";

const aboutUsData = [
  {
    heading: "Introduction",
    description:
      "Myntra is a one stop shop for all your fashion and lifestyle needs. Being India's largest e-commerce store for fashion and lifestyle products, Myntra aims at providing a hassle free and enjoyable shopping experience to shoppers across the country with the widest range of brands and products on its portal. The brand is making a conscious effort to bring the power of fashion to shoppers with an array of the latest and trendiest products available in the country.",
  },
  {
    heading: "Value Proposition",
    description:
      "Myntra's value proposition lies in its wide selection, quality customer service, and trend-setting fashion curation, offering unmatched convenience and variety to its customers.",
  },
  {
    heading: "Brands",
    description:
      "Myntra houses a wide range of popular and premium brands, catering to all fashion and lifestyle preferences including apparel, footwear, accessories, and more.",
  },
  {
    heading: "Recognitions",
    description:
      "Myntra has received numerous awards for its innovation, customer service, and leadership in the fashion e-commerce industry.",
  },
];

const AboutUs = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/favicon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Get to Know Innovative</Text>
        <Text style={styles.subtitle}>
          Discover the values and mission behind Innovative. Join us on our
          fashion journey.
        </Text>
      </View>

      <View style={styles.content}>
        {aboutUsData.map((item, index) => (
          <View key={index} style={styles.section}>
            <ExpandableContent
              heading={item.heading}
              description={item.description}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: staticColors.white,
  },
  header: {
    backgroundColor: staticColors.white,
    ...spacingStyles.py25,
    alignItems: "center",
    justifyContent: "center",
    ...spacingStyles.mb20,
    borderBottomWidth: 1,
    borderColor: staticColors.lightGray,
    shadowColor: staticColors.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    ...textStyles.title,
    fontFamily: fontFamilies.abriFatfaceRegular,
    textAlign: "center",
  },
  subtitle: {
    ...textStyles.subtitle,
    fontSize: fontSizes.sm,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: fontFamilies.helvetica,
    ...spacingStyles.px25,
  },
  content: {
    ...spacingStyles.px25,
  },
  section: {
    ...spacingStyles.mb25
  },
});

export default AboutUs;
