import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import offerData from "../../assets/data/offers.json";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import {fontSizes, fontWeights} from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";

const { width } = Dimensions.get("window");

interface Offer {
  id: string;
  image: string;
  brands: string[];
  tagline: string;
  offer: string;
}

const OfferCardCarousel = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(3600);

  useEffect(() => {
    setOffers(offerData);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { h, m, s };
  };

  const { h, m, s } = formatTime(secondsLeft);
  const renderCard = ({ item }: { item: Offer }) => (
    <View style={styles.card}>
      <View style={styles.brandRow}>
        <Text style={styles.brand}>{item.brands[0]}</Text>
        <Text style={styles.brand}> | </Text>
        <Text style={styles.brand}>{item.brands[1]}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.tagline}>{item.tagline}</Text>
      <Text style={styles.discount}>{item.offer}</Text>
    </View>
  );

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>OPENING OFFERS</Text>
        <Text style={styles.subheading}>THE BRANDED HOUR IS HERE</Text>
        <View style={styles.timer}>
          <Text>Deal Ends In</Text>
          <View style={styles.timerBox}>
            <View style={styles.timerSegment}>
              <Text style={styles.timerText}>
                {h.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.timerLabel}>h</Text>
            </View>
            <View style={styles.timerSegment}>
              <Text style={styles.timerText}>
                {m.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.timerLabel}>m</Text>
            </View>
            <View style={styles.timerSegment}>
              <Text style={styles.timerText}>
                {s.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.timerLabel}>s</Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={offers}
        renderItem={renderCard}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default OfferCardCarousel;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    ...spacingStyles.mt5,
  },
  heading: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: staticColors.primary,
    fontFamily: fontFamilies.helveticaBold,
  },
  subheading: {
    fontSize: fontSizes.xs,
    color: staticColors.textSecondary,
    ...spacingStyles.mb5,
  },
  timer: {
    fontSize: fontSizes.sm,
    color: staticColors.textSecondary,
    flexDirection: "row",
    alignItems: "center",
  },
  timerBox: {
    flexDirection: "row",
    marginLeft: 10,
    gap: gapSizes.md
  },
  timerSegment: {
    backgroundColor: staticColors.lightPink,
    borderRadius: borderRadius.r6,
    ...spacingStyles.p5,
    marginRight: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: gapSizes.sm
  },
  timerText: {
    fontWeight: fontWeights.semiBold,
    fontSize: fontSizes.base,
    color: staticColors.brightRed,
  },
  timerLabel: {
    fontSize: fontSizes.sm,
    color: staticColors.brightRed,
  },
  list: {
    ...spacingStyles.py10
  },
  card: {
    width: width * 0.4,
    backgroundColor: colors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.mr10,
    overflow: "hidden",
    borderColor: staticColors.lightGray,
    borderWidth: 1,
    ...spacingStyles.py10,
    alignItems: "center",
  },

  brandRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mb5,
  },

  brand: {
    fontWeight: fontWeights.semiBold,
    fontSize: fontSizes.xs,
    color: staticColors.primary,
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: borderRadius.r8,
    ...spacingStyles.mb5,
  },

  tagline: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
    textAlign: "center",
    ...spacingStyles.mb2,
  },

  discount: {
    fontSize:fontSizes.xs,
    color: staticColors.brightRed,
    fontWeight: fontWeights.semiBold,
    textAlign: "center",
  },
});
