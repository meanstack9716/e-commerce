import React from "react";
import { View, StyleSheet } from "react-native";
import FaqSection from "./FaqSection";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";

const faqs = [
  {
    heading:
      "Why are there different prices for the same product? Is it legal?",
    description:
      "Prices can vary for different sizes or colors of the same product based on seller, availability, or promotions. It is legal as long as it is clearly mentioned before purchase.",
  },
  {
    heading:
      "How will I detect fraudulent emails/calls seeking sensitive personal and confidential information?",
    description:
      "Always verify the source before sharing any information. Genuine companies never ask for confidential details via call or email. Report suspicious activity to support immediately.",
  },
  {
    heading: "How will I identify a genuine appointment letter?",
    description:
      "A genuine appointment letter comes from official domain emails and includes detailed information such as job role, reporting manager, office location, etc.",
  },
  {
    heading: "Why will 'My Cashback' not be available on Myntra?",
    description:
      "Cashback offers may be disabled due to policy changes, expired promotions, or non-eligibility of the account.",
  },
  {
    heading: "How do I cancel the order, I have placed?",
    description:
      'Go to the Orders section, select the order you want to cancel, and click on "Cancel Order". Follow the instructions to complete the process.',
  },
  {
    heading: "How do I create a Return Request?",
    description:
      'Go to "My Orders", choose the item you want to return, and click on "Return". Follow the steps to schedule a pickup.',
  },
  {
    heading:
      "I have created a Return request. When will the product be picked up?",
    description:
      "Product pickup is usually scheduled within 1-3 business days after return request confirmation. You will receive a notification.",
  },
  {
    heading: "I have created a Return request. When will I get the refund?",
    description:
      "Refunds are initiated once the returned product is received and verified. It may take 5-7 business days depending on your payment method.",
  },
  {
    heading: "Where should I self-ship the Returns?",
    description:
      "If your area is not serviceable for pickup, you’ll receive an address to ship the product. Share the shipment tracking ID once dispatched.",
  },
];

const shippingFaqs = [
  {
    heading: "What is Myntra's Platform Fee?",
    description:
      "Platform fee is levied by Myntra to sustain the efficient operations and continuous improvement of the platform, for a hassle-free app experience.",
  },
  {
    heading: "Refund of Platform Fee",
    description:
      "If the order is lost or undelivered to the preferred location, the complete order amount will be refunded if paid online, including the platform fee.",
  },
  {
    heading: "What is Myntra's Shipping Fee?",
    description:
      "Shipping fees vary based on order value, offers, and user tier. It's visible at checkout.",
  },
  {
    heading: "Refund of Shipping Fee",
    description:
      "Shipping fees are refunded if the entire order is cancelled or returned.",
  },
  {
    heading: "What is Myntra’s Fair Usage Policy?",
    description:
      "The policy prevents abuse of services and ensures fair use across customers.",
  },
  {
    heading: "I am an Insider. Why am I seeing the shipping fee?",
    description:
      "Shipping benefits may be subject to order minimums or temporary restrictions.",
  },
  {
    heading: "How do I check the status of my order?",
    description: "Go to 'My Orders' to view real-time tracking updates.",
  },
  {
    heading: "How can I check if Myntra delivers to my PIN Code?",
    description:
      "Enter your PIN code on the product page or during checkout to verify.",
  },
  {
    heading: "How are orders placed on Myntra delivered to me?",
    description:
      "All orders placed on Myntra are dispatched through our own courier service - Myntra Logistics or through other courier partners such as Blue Dart, Delhivery Etc.",
  },
  {
    heading: "Does Myntra deliver products outside India?",
    description:
      "No. At this point, Myntra delivers products only within India.",
  },
  {
    heading: "How can I get my order delivered faster?",
    description:
      "Sorry, currently we do not have any service available to expedite the order delivery. In future, if we are offering such service and your area pincode is serviceable, you will receive a communication from our end.",
  },
  {
    heading:
      "I have received a partial item/partial order or an Untenanted/Void packet?",
    description:
      "In case of a component missing from a multi-component item such as Kurta, Bed - sheets, inner wear sets etc.only exchange return option would be provided basis serviceability and product type",
  },
];

const signupLoginFaqs = [
  {
    heading: "How do I create an account on Myntra?",
    description:
      'You can create your account on Myntra by entering and verifying your mobile number. Click on "Create New Account" after that and fill up the form to create your Myntra account.',
  },
  {
    heading:
      "How do I login on Myntra? I used to login with email, Google/Facebook login.",
    description:
      'Enter your mobile number and OTP, then choose your method of login under "Already have an account?". Once done, you will be logged in to your account. Next time, use mobile and OTP for easier login.',
  },
  {
    heading:
      "Why am I asked for password after entering OTP while trying to login?",
    description:
      "If you haven't logged in using OTP for a long time, you may be asked for your password to secure your account as per Myntra’s security policy.",
  },
  {
    heading: "Can I still login with password on Myntra?",
    description:
      'Yes. Enter your mobile number and tap "Continue". On the OTP page, you’ll see the option to login with password. However, logging in via OTP is recommended.',
  },
  {
    heading: "What if I don't receive an OTP due to poor network connectivity?",
    description:
      "Check your network and try again. If the issue persists, wait and try again later or contact support.",
  },
  {
    heading: "What is an alternate mobile number? Why does Myntra ask for it?",
    description:
      "It's a backup number used for account recovery in case you lose access to your login number.",
  },
  {
    heading: "Do I need to provide email to create an account on Myntra?",
    description:
      "No, but adding an email helps in recovering your account or resetting your password.",
  },
  {
    heading:
      "I have given my mobile number in my last order? Can I use that number to log in to Myntra?",
    description:
      "No. You need to add and verify a mobile number in your profile to use it for login.",
  },
  {
    heading: "What is account recovery on Myntra?",
    description:
      "It helps you regain access if you've lost your registered mobile number using card validation or alternate mobile OTP.",
  },
  {
    heading: "Why am I asked for my credit card details to access my account?",
    description:
      "This is part of the account recovery process. Myntra only verifies expiry details; no charges are made.",
  },
  {
    heading:
      "What happens if my mobile number is given to someone else by the telecom operator. Is my Myntra account still safe?",
    description:
      "Yes. If someone tries to log in, OTP or password verification ensures your account's safety.",
  },
  {
    heading: "How can I change my mobile number that I use to login on Myntra?",
    description:
      "Log in, go to your account settings, and update your mobile number after verifying with OTP.",
  },
  {
    heading:
      "I do not have my old mobile number? How can I log into my account and change mobile number?",
    description:
      "Use the alternate mobile number or card verification method for recovery. Then update your mobile number.",
  },
  {
    heading: "Does Myntra read my SMSes?",
    description:
      "No, Myntra does not read your SMSes. It only detects OTP auto-fill if permission is given.",
  },
  {
    heading: "Why is my account locked?",
    description:
      "Too many failed login attempts may temporarily lock your account. Use password reset or contact support.",
  },
];

export default function FAQs() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <FaqSection
          title="Top Queries"
          subtitle="You can track your order in 'my orders'."
          buttonText="ORDER TRACK"
          onPress={() => alert("Button pressed!")}
          faqs={faqs}
        />
      </View>
      <View style={styles.section}>
        <FaqSection
          title="Shipping, Order Tracking & Delivery"
          subtitle="You can track your orders in MyMyntra."
          buttonText="TRACK ORDERS"
          onPress={() => alert("Track shipping pressed!")}
          faqs={shippingFaqs}
        />
      </View>
      <View style={styles.section}>
        <FaqSection
          title="Sign Up and Login"
          subtitle="Everything you need to know about logging in and account recovery."
          buttonText="LOGIN HELP"
          onPress={() => alert("Login help pressed!")}
          faqs={signupLoginFaqs}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.p25,
    backgroundColor: colors.whiteColor
  },
  section: {
    ...spacingStyles.mb20
  },
});
