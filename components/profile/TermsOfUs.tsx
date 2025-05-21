import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import ExpandableContent from "../ui/ExpandableContent";
import colors from "@/style/staticColors";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";
import {fontSizes} from "@/style/typography";

const TermsOfUs = () => {
  const termsData = [
    {
      heading: "User Account, Password, and Security:",
      description: `If You use the Platform, You shall be responsible for maintaining the confidentiality of your Display Name and Password and You shall be responsible for all activities that occur under your Display Name and Password.`,
    },
    {
      heading: "Services Offered:",
      description: `Myntra provides a number of Internet-based services through the Platform. One such Service enables Users to purchase original merchandise such as clothing, footwear and accessories from various fashion and lifestyle brands (collectively, "Products")`,
    },
    {
      heading: " Platform for Transaction and Communication:",
      description: `All commercial/contractual terms are offered by and agreed to between Buyers and Sellers alone. The commercial/contractual terms include without limitation price, shipping costs, payment methods, payment terms, date, period and mode of delivery, warranties related to products and services and after sales services related to products and services.`,
    },
    {
      heading: " User Conduct and Rules on the Platform:",
      description: `is grossly harmful, harassing, blasphemous, defamatory, obscene, pornographic, paedophilic, libellous, invasive of another's privacy, hateful, or racially, ethnically objectionable, disparaging, relating or encouraging money laundering or gambling, or otherwise unlawful in any manner whatever`,
    },
    {
      heading: "Contents Posted on Platform:",
      description: `All text, graphics, user interfaces, visual interfaces, photographs, trademarks, logos, sounds, music and artwork (collectively, "Content"), is a third party user generated content and Myntra has no control over such third party user generated content as Myntra is merely an intermediary for the purposes of this Terms of Use. Such Content will become Our property and You grant Us the worldwide, perpetual and transferable rights in such Content.`,
    },
    {
      heading: "Disclaimer of Warranties and Liability:",
      description: `All the materials and products (including but not limited to software) and services, included on or otherwise made available to You through Platform are provided on "as is" and "as available" basis without any representation or warranties, express or implied except otherwise specified in writing. `,
    },
    {
      heading: " Selling:",
      description: `As a registered seller, you are allowed to list item(s) for sale on the Platform in accordance with the Policies which are incorporated by way of reference in this Terms of Use. You must be legally able to sell the item(s) you list for sale on the Platform. You must ensure that the listed items do not infringe upon the intellectual property, trade secret or other proprietary rights or rights of publicity or privacy rights of third parties. Listings may only include text descriptions, graphics and pictures that describe your item for sale. All listed items must be listed in an appropriate category on the Platform.`,
    },
    {
      heading: "Payment",
      description: `All payments made against the purchases/services on Platform by you shall be compulsorily in Indian Rupees acceptable in the Republic of India. Platform will not facilitate transaction with respect to any other form of currency with respect to the purchases made on Platform.`,
    },
    {
      heading: "E-Platform for Communication:",
      description: `You agree, understand and acknowledge that Myntra is an online platform that enables you to purchase products listed on the Platform at the price indicated therein at any time. You further agree and acknowledge that Myntra is only a facilitator and is not and cannot be a party to or control in any manner any transactions on Myntra.`,
    },
    {
      heading: "Indemnity:",
      description: `You shall indemnify and hold harmless Myntra, its owner, licensee, affiliates, subsidiaries, group companies (as applicable) and their respective officers, directors, agents, and employees, from any claim or demand, or actions including reasonable attorneys' fees, made by any third party or penalty imposed due to or arising out of Your breach of this Terms of Use, privacy Policy and other Policies, or Your violation of any law, rules or regulations or the rights (including infringement of intellectual property rights) of a third party.`,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={textStyles.title}>MYNTRA: TERMS OF USE</Text>
      <Text style={styles.paragraph}>
        Welcome to Myntra.This document is an electronic record in terms of
        Information Technology Act, 2000 and published in accordance with the
        (provisions of Rule 3 ) of the Information Technology (Intermediaries
        guidelines) Rules, 2011 that require publishing the rules and
        regulations, privacy policy and Terms of Use for access or usage of
        Myntra marketplace platform - www.myntra.com (hereinafter referred to as
        "Platform") The Platform is owned by Myntra Designs Private Limited,
        having its registered office at Buildings Alyssa, Begonia and Clover
        situated in Embassy Tech Village, Outer Ring Road, Devarabeesanahalli
        Village, Varthur Hobli, Bengaluru – 560103, India and its branch office
        at Plot 82 A - 2nd and 3rd Floor, Sector 18 Gurugram Haryana, India.
      </Text>
      {termsData.map((section, index) => (
        <View key={index} style={styles.section}>
          <ExpandableContent
            number={index + 1}
            heading={section.heading}
            description={section.description}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.p25,
  },
  section: {
   ...spacingStyles.mb5
  },
  paragraph: {
    textAlign: "justify",
    fontSize: fontSizes.xs,
    lineHeight: 20,
    color: colors.textSubtitle,
    ...spacingStyles.mb20,
  },
});

export default TermsOfUs;
