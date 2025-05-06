import spacingStyles from "@/style/spacingStyles";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
interface PromotionalCard {
  id: string;
  title: string;
  imageUrl: string;
  linkTo?: string;
}

interface PromotionalCardsProps {
  cards: PromotionalCard[];
  onCardPress?: (card: PromotionalCard) => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width / 3 - 50;

const PromotionalCards: React.FC<PromotionalCardsProps> = ({
  cards,
  onCardPress,
}) => {
  const firstColumnCards = cards.slice(0, 2);
  const remainingCards = cards.slice(2);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.firstColumn}>
          {/* Static "Best Sellers" card */}
          <TouchableOpacity style={styles.largeCard} activeOpacity={0.8}>
            <Image
              source={{ uri: "https://example.com/images/best-sellers.jpg" }}
              style={styles.cardImage}
            />
            <View style={styles.bestSellerOverlay}>
              <View>
                <Text style={styles.bestSellerTitle}>Best</Text>
                <Text style={styles.bestSellerTitle}>Sellers</Text>
              </View>
              <Image
                source={require("../../assets/images/images/star-badge.png")}
                style={styles.starBadge}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.subRow}>
            {firstColumnCards.map((card, index) => (
              <TouchableOpacity
                key={card.id || `subRow-${index}`}
                style={styles.card}
                activeOpacity={0.8}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardtitleContent}>
                    <Text style={styles.cardTitle}>{card.title} </Text>
                    <AntDesign name="right" size={8} color={staticColors.lightGray} />
                  </View>
                  <Image
                    source={{ uri: card.imageUrl }}
                    style={styles.cardImage}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {Array.from({ length: Math.ceil(remainingCards.length / 2) }).map(
          (_, colIndex) => (
            <View key={`col-${colIndex}`} style={styles.column}>
              {remainingCards[colIndex * 2] && (
                <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardtitleContent}>
                      <Text style={styles.cardTitle}>
                        {remainingCards[colIndex * 2].title}
                      </Text>
                      <AntDesign name="right" size={8} color={staticColors.lightGray} />
                    </View>
                    <Image
                      source={{ uri: remainingCards[colIndex * 2].imageUrl }}
                      style={styles.cardImage}
                    />
                  </View>
                </TouchableOpacity>
              )}

              {remainingCards[colIndex * 2 + 1] && (
                <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardtitleContent}>
                      <Text style={styles.cardTitle}>
                        {remainingCards[colIndex * 2 + 1].title}
                      </Text>
                      <AntDesign name="right" size={8} color={staticColors.lightGray} />
                    </View>
                    <Image
                      source={{
                        uri: remainingCards[colIndex * 2 + 1].imageUrl,
                      }}
                      style={styles.cardImage}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )
        )}
      </ScrollView>

      {/* Shipping info banner */}
      <View style={styles.shippingInfoContainer}>
        <View style={styles.sparkleLeft}>
          <Ionicons name="star-sharp" size={24} color={staticColors.lightYellow} />
        </View>

        <View style={styles.infoItem}>
          <MaterialIcons name="verified" size={24} color={staticColors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>100%</Text>
            <Text style={styles.infoSubtitle}>Original Products</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Entypo name="box" size={18} color={staticColors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Free Shipping</Text>
            <Text style={styles.infoSubtitle}>On All Orders</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <FontAwesome name="rupee" size={18} color={staticColors.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Easy Returns</Text>
            <Text style={styles.infoSubtitle}>And Refunds</Text>
          </View>
        </View>

        <View style={styles.sparkleRight}>
          <Ionicons name="star-sharp" size={24} color={staticColors.lightYellow} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.mb15,
  },
  scrollContainer: {},
  firstColumn: {
    width: cardWidth * 2 + 10,
    ...spacingStyles.mr5,
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: cardWidth,
    ...spacingStyles.mr5,
  },
  largeCard: {
    height: 80,
    borderRadius: 15,
    ...spacingStyles.mb5,
    overflow: "hidden",
    backgroundColor: staticColors.bgCard,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: cardWidth,
    height: 80,
    borderRadius: 15,
    ...spacingStyles.mb5,
    overflow: "hidden",
    backgroundColor: staticColors.bgCardLight,
  },
  cardContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardImage: {
    width: "60%",
    height: 55,
    resizeMode: "cover",
    alignSelf: "center",
  },
  cardtitleContent: {
    flexDirection: "row",
    ...spacingStyles.pt5,
    alignItems: "center",
    gap: 2,
  },
  cardTitle: {
    color: staticColors.darkGray,
    fontWeight: "600",
    fontSize: fontSizes.xs,
    ...spacingStyles.pl10,
  },
  bestSellerOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.px15,
  },
  bestSellerTitle: {
    color: staticColors.primary,
    fontWeight: "800",
    fontSize: fontSizes.lg,
    lineHeight: 24,
  },
  starBadge: {
    width: 70,
    ...spacingStyles.mt5,
    resizeMode: "contain",
  },
  shippingInfoContainer: {
    flexDirection: "row",
    backgroundColor: staticColors.lightGreen,
    borderRadius: 15,
    ...spacingStyles.p10,
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mt10,
    ...spacingStyles.mx10,
    position: "relative",
    borderWidth: 1,
    borderColor: staticColors.textLightGray,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoTextContainer: {
    flexDirection: "column",
  },
  infoTitle: {
    fontSize: fontSizes.xs,
    fontWeight: "bold",
    color: staticColors.darkGray,
  },
  infoSubtitle: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
  },
  divider: {
    width: 1,
    height: "90%",
    backgroundColor: staticColors.textLightGray,
    ...spacingStyles.mx5,
  },
  sparkleLeft: {
    position: "absolute",
    left: -10,
    top: -10,
  },
  sparkleRight: {
    position: "absolute",
    right: -10,
    bottom: -10,
  },
});

export default PromotionalCards;
