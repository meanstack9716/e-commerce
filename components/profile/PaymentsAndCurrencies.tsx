// This code may be used in the future, so I’ve commented it out

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import IconCard from "../common/IconCard";
// import staticColors from "@/style/staticColors";
// import spacingStyles from "@/style/spacingStyles";

// const PaymentsAndCurrencies: React.FC = () => {
//   const paymentOptions = [
//     {
//       iconName: "wallet-outline",
//       title: "Inno Credit",
//       iconBackgroundColor: staticColors.lightPink,
//     },
//     {
//       iconName: "cash-outline",
//       title: "InnoCash",
//       iconBackgroundColor: staticColors.bgSecondary,
//     },
//     {
//       iconName: "flash-outline",
//       title: "Super Coins",
//       iconBackgroundColor: staticColors.lightGray,
//     },
//     {
//       iconName: "card-outline",
//       title: "Saved Cards",
//       iconBackgroundColor: staticColors.bgCardLight,
//     },
//     {
//       iconName: "link-outline",
//       title: "Saved UPI",
//       iconBackgroundColor: staticColors.lightGreen,
//     },
//     {
//       iconName: "gift-outline",
//       title: "Gift Cards",
//       iconBackgroundColor: staticColors.bgOffer,
//     },
//     {
//       iconName: "wallet-outline",
//       title: "Wallets/BNPL",
//       iconBackgroundColor: staticColors.bgSecondary,
//     },
//   ];

//   return (
//     <View style={styles.paymentContainer}>
//       {paymentOptions.map((option, index) => (
//         <IconCard
//           key={index}
//           iconName={option.iconName}
//           title={option.title}
//           iconBackgroundColor={option.iconBackgroundColor}
//           onPress={() => console.log(`${option.title} pressed`)}
//         />
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   paymentContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     ...spacingStyles.px20,
//     ...spacingStyles.py10,
//     backgroundColor: staticColors.white,
//   },
// });

// export default PaymentsAndCurrencies;
