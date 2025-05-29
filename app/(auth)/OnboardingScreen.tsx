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
import { SafeAreaView } from "react-native-safe-area-context";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: images.card01,
    title: "Welcome",
    description: "Welcome to our app. Let’s get started!",
  },
  {
    id: "2",
    image: images.card02,
    title: "Hello",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non consectetur turpis. Morbi eu eleifend lacus.",
  },
  {
    id: "3",
    image: images.card03,
    title: "Shop Easily",
    description: "Shop your favorite products in just a few taps!",
  },
  {
    id: "4",
    image: images.card04,
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
    <SafeAreaView style={styles.safeArea}>
      {/* Decorative Shapes */}
      <Image source={images.shape08} style={styles.shapeTopLeft} />
      <Image source={images.shape04} style={styles.shapeBottomRight} />

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
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: staticColors.white,
    justifyContent: "center",
  },
  cardWrapper: {
    width,
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
    backgroundColor: "#d0d4f7",
    ...spacingStyles.mx5,
  },
  activeDot: {
    backgroundColor: "#0057FF",
  },
  shapeTopLeft: {
    position: "absolute",
    top: 0,
    left: -30,
    width: 250,
    height: 250,
    opacity: 0.9,
    resizeMode: "contain",
  },
  shapeBottomRight: {
    position: "absolute",
    bottom: 0,
    right: -50,
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
});
