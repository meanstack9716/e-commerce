import React from "react";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import { commonStyles } from "@/style/commonStyle";

export const renderStars = (rating: string, size: number) => {
  const ratingValue = parseFloat(rating);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let iconName: keyof typeof Ionicons.glyphMap = "star-outline";

    if (i <= Math.floor(ratingValue)) {
      iconName = "star"; 
    } else if (i - ratingValue <= 0.5) {
      iconName = "star-half";
    }

    stars.push(
      <Ionicons
        key={`star-${i}`}
        name={iconName}
        size={size}
        color={staticColors.starYellow}
        style={commonStyles.starIcon}
      />
    );
  }

  return stars;
};
