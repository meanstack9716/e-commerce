import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
import gapSizes from "@/style/gapSizes";

interface OfferCardProps {
  topText: string;
  price: string;
  bottomText: string;
  color: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ topText, price, bottomText, color }) => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <LinearGradient
        colors={[`${staticColors.skyBlue}`, `${staticColors.softSkyBlue}`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text style={styles.topText}>{topText}</Text>
        <Text style={[styles.priceText, { color }]}>₹{price}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>{bottomText}</Text>
          <AntDesign name="arrowright" size={16} color={staticColors.black} style={styles.arrow} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const OfferCardsComponent: React.FC = () => {
  const offers: OfferCardProps[] = [
    { topText: "Under", price: "499", bottomText: "Jewellery", color: "#e83e8c" },
    { topText: "Under", price: "99", bottomText: "Only", color: "#28a745" },
    { topText: "Flat", price: "80%", bottomText: "Off", color: "#6f42c1" },
    { topText: "Under", price: "499", bottomText: "Only", color: "#007bff" },
    { topText: "Under", price: "999", bottomText: "Only", color: "#f57242" }
  
  
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {offers.map((offer, index) => (
        <OfferCard 
          key={index}
          topText={offer.topText}
          price={offer.price}
          bottomText={offer.bottomText}
          color={offer.color}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0
  },
  container: {
    ...spacingStyles.mb25,
    flexDirection: "row",
    ...spacingStyles.mt15,
  
  },
  cardContainer: {
    ...spacingStyles.mr15 
  },
  card: {
    borderWidth:1,
    borderColor:staticColors.borderLight,
    borderRadius: 25,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.py10
  },
  topText: {
    fontSize: fontSizes.sm,
    fontWeight: "500",
    ...spacingStyles.mt25
  },
  priceText: {
    fontSize: fontSizes.lg,
    fontWeight: "700",
  },
  bottomRow: {
    flexDirection: "column",
    alignItems:'center',
    gap:gapSizes.md
  },
  bottomText: {
    fontSize:fontSizes.base,
    fontWeight: "600",
  },
  arrow: {
    ...spacingStyles.mb5  }
});

export default OfferCardsComponent;