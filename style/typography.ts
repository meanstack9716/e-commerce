const fontSizes = {
  s: 10,
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  l:22,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
  "4xl": 36,
  "5xl": 40,
  "6xl": 44,
  "7xl": 48,
  "8xl": 52,
  "9xl": 56,
};

const fontWeights = {
  thin: "100",
  light: "300",
  normal: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold:'800',
  black: "900",
} as const;

export { fontSizes, fontWeights };
