import React from "react";
import { ViewStyle } from "react-native";
import { MotiView } from "moti";

interface SkeletonPlaceholderProps {
  style?: ViewStyle;
  fromOpacity?: number;
  toOpacity?: number;
  duration?: number;
}

const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({
  style,
  fromOpacity = 0.3,
  toOpacity = 0.7,
  duration = 1000,
}) => {
  return (
    <MotiView
      style={style}
      from={{ opacity: fromOpacity }}
      animate={{ opacity: toOpacity }}
      transition={{
        type: "timing",
        duration,
        loop: true,
        repeatReverse: true,
      }}
    />
  );
};

export default SkeletonPlaceholder;
