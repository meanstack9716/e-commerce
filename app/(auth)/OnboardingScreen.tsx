import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from "react-native";
import OnboardingCard from "@/components/auth/OnboardingCard";
import images from "@/constants/images";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { router } from "expo-router";
import { SafeAreaViewComponent } from "@/components/common/SafeAreaViewComponent";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: images.onBoardingCard1,
    title: "Welcome",
    description: "Welcome to our app. Let’s get started!",
  },
  {
    id: "2",
    image: images.onBoardingCard2,
    title: "Hello",
    description:
      "Welcome to Shoppe! Discover the latest trends, top deals, and must-have products — all in one place.",
  },
  {
    id: "3",
    image: images.onBoardingCard3,
    title: "Shop Easily",
    description: "Shop your favorite products in just a few taps!",
  },
  {
    id: "4",
    image: images.onBoardingCard4,
    title: "Ready?",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaViewComponent>
      {/* Decorative Shapes */}
      <Image source={images.onBoardingShape} style={styles.shapeTopLeft} />
      <Image
        source={images.loginOnboardingShape}
        style={styles.shapeBottomRight}
      />

      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={{ alignItems: "center" }}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrapper}>
            <OnboardingCard
              imageSource={item.image}
              title={item.title}
              description={item.description}
              isLast={index === slides.length - 1}
              onPressStart={() => router.navigate("/profile")}
            />
          </View>
        )}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>
    </SafeAreaViewComponent>
  );
};

export default OnboardingScreen;
const CARD_HEIGHT = 500;
const styles = StyleSheet.create({
  cardWrapper: {
    width,
    height: CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    ...spacingStyles.pb25,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.r8,
    backgroundColor: staticColors.dotColor,
    ...spacingStyles.mx5,
  },
  activeDot: {
    backgroundColor: staticColors.primaryBlue,
  },
  shapeTopLeft: {
    position: "absolute",
    top: -50,
    left: -30,
    width: 250,
    height: 250,
    opacity: 0.9,
    resizeMode: "contain",
  },
  shapeBottomRight: {
    position: "absolute",
    bottom: -100,
    right: -50,
    width: 275,
    height: 275,
    resizeMode: "contain",
  },
});
