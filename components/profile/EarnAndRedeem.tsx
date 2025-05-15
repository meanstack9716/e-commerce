// This code may be used in the future, so I’ve commented it out

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import IconCard from "../common/IconCard";
// import staticColors from "@/style/staticColors";
// import spacingStyles from "@/style/spacingStyles";

// const EarnAndRedeem: React.FC = () => {
//   const earnOptions = [
//     {
//       iconName: "trophy-outline",
//       title: "My Prizes",
//       iconBackgroundColor: staticColors.lightPink,
//     },
//   ];

//   return (
//     <View style={styles.paymentContainer}>
//       {earnOptions.map((option, index) => (
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

// export default EarnAndRedeem;
