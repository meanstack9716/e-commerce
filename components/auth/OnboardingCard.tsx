import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { fontSizes } from "@/style/typography";
import { commonStyles } from "@/style/commonStyle";
import { fontFamilies } from "@/style/fontFamilies";

interface OnboardingCardProps {
  imageSource: any;
  title: string;
  description: string;
  isLast?: boolean;
  onPressStart?: () => void;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({
  imageSource,
  title,
  description,
  isLast = false,
  onPressStart,
}) => {
  return (
    <View style={styles.card}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {isLast && (
          <TouchableOpacity style={styles.button} onPress={onPressStart}>
            <Text style={commonStyles.authButtonText}>Let's Start</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingCard;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r30,
    overflow: "hidden",
    width: width * 0.85,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 350,
  },
  textContainer: {
    ...spacingStyles.p25,
    alignItems: "center",
  },
  title: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.darkSlate,
    ...spacingStyles.py15,
  },
  description: {
    color: staticColors.black,
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.nunitoSans,
    textAlign: "center",
    ...spacingStyles.px25,
    ...spacingStyles.pb25,
  },
  button: {
    backgroundColor: staticColors.primaryBlue,
    ...spacingStyles.py10,
    width: 200,
    borderRadius: borderRadius.r16,
    ...spacingStyles.px20,  
    alignItems:'center'
  },

});
