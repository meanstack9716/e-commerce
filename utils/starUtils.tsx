import React from "react";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import { commonStyles } from "@/style/commonStyle";

export const renderStars = (rating: string, size: number) => {
  const ratingValue = parseFloat(rating);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={`star-${i}`}
        name={i <= ratingValue ? "star" : "star-outline"}
        size={size}
        color={staticColors.starYellow}
        style={commonStyles.starIcon}
      />
    );
  }
  return stars;
};
