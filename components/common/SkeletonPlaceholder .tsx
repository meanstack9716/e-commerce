import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { MotiView } from "moti";

type SkeletonPlaceholderProps = {
  style: StyleProp<ViewStyle>;
  fromOpacity?: number;
  toOpacity?: number;
};

const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({
  style,
  fromOpacity = 0.3,
  toOpacity = 0.7,
}) => {
  return (
    <MotiView
      style={style}
      from={{ opacity: fromOpacity }}
      animate={{ opacity: toOpacity }}
      transition={{
        type: "timing",
        duration: 1000,
        loop: true,
        repeatReverse: true,
      }}
    />
  );
};

export default SkeletonPlaceholder;
