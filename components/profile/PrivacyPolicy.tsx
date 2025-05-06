import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import ExpandableContent from "../ui/ExpandableContent";
import colors from "@/style/staticColors";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";

const PrivacyPolicy: React.FC = () => {
  const privacyPolicyData = [
    {
      heading: "Introduction",
      description: `We value the trust you place in us and recognize the importance of secure transactions and information privacy. This Privacy Policy describes how Myntra Designs Private Limited and its affiliates (collectively "Myntra, we, our, us") collect, use, share, protect or otherwise process your personal data through Myntra website https://www.myntra.com.`,
    },
    {
      heading: "Collection",
      description:
        "We collect personal data such as name, email, phone number, and usage data when you use our app.",
    },
    {
      heading: "Use",
      description:
        "We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses. We use your personal data to assist sellers and business partners in handling and fulfilling orders;",
    },
    {
      heading: "Cookies",
      description: `We use data collection devices such as "cookies" on certain pages of the Platform to help analyse our web page flow, measure promotional effectiveness, and promote trust and safety. "Cookies" are small files placed on your hard drive that assist us in providing our services.`,
    },
    {
      heading: "Sharing",
      description:
        "We may share your personal data internally within Flipkart Group entities, our other corporate entities, and affiliates to provide you access to the services and products offered by them, including Flipkart Advanz Private Limited, Scapic Innovations Private Limited, and other Flipkart affiliates, related companies and third parties, including Credit Bureaus and business partners (such as UPI platform), for purposes of providing products and services offered by them, such as, personal loans offered by Scapic Innovations Private Limited through its lending partners, insurance, the deferred payment options, Flipkart Pay Later offered by Flipkart Advanz Private Limited through its lending partners. ",
    },
    {
      heading: "Links to Other Sites",
      description:
        "Our Platform links to other websites that may collect personal data about you. Myntra is not responsible for the privacy practices or the content of those linked websites.",
    },
    {
      heading: "Changes to This Policy",
      description:
        "Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices. We will alert you to significant changes by posting the date our Privacy Policy got last updated, placing a notice on our Platform, or by sending you an email when we are required to do so by applicable law.",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      {privacyPolicyData.map((item, index) => (
        <ExpandableContent
          key={index}
          heading={item.heading}
          description={item.description}
          number={index + 1}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.p25
  },
  title: {
    ...textStyles.title,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    borderStyle: "dotted",
    ...spacingStyles.pb10
  },
});

export default PrivacyPolicy;
