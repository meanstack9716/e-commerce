// This code may be used in the future, so I’ve commented it out

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import IconCard from "../common/IconCard";
// import staticColors from "@/style/staticColors";
// import spacingStyles from "@/style/spacingStyles";
// import gapSizes from "@/style/gapSizes";

// const ManageAccount: React.FC = () => {
//   const accountOptions = [
//     {
//       iconName: "person-outline",
//       title: "Account Details",
//       iconBackgroundColor: staticColors.bgCardLight,
//     },
//     {
//       iconName: "location-outline",
//       title: "Address",
//       iconBackgroundColor: staticColors.bgCard,
//     },
//   ];

//   return (
//     <View style={styles.paymentContainer}>
//       {accountOptions.map((option, index) => (
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
//     gap: gapSizes.md,
//     ...spacingStyles.px20,
//     ...spacingStyles.py10,
//     padding: 10,
//     backgroundColor: staticColors.white,
//   },
// });

// export default ManageAccount;
