import React, { ReactNode } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import staticColors from "@/style/staticColors";
import { CategoriesCardProps } from "./index.types";
import { Ionicons } from "@expo/vector-icons";
import { CategoryItem, SubCategoryItem } from "@/interfaces";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import gapSizes from "@/style/gapSizes";
import borderRadius from "@/style/borderRadius";
import { router } from "expo-router";

export const CategoriresCard: React.FC<
  CategoriesCardProps
> = ({
  categoryList,
}) => {
    return (
      <>
        <View style={styles.headingWrap}>
          <Text style={styles.headingText}>Categories</Text>
          <View style={styles.seeAllContainer}>
            <Text style={styles.seeAllText}>See All</Text>
            <TouchableOpacity onPress={() => router.navigate("/categories")}>
              <Ionicons
                name="arrow-forward-circle"
                size={30}
                color={staticColors.blue300}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {categoryList.map((option: CategoryItem, index: number) => {
            if (
              index <= 5 &&
              option.sub_categories &&
              option.sub_categories.length
            ) {
              return (
                <View style={styles.cardItem} key={option.id}>
                  <View style={styles.subCardContainer}>
                    {option.sub_categories.map(
                      (subOption: SubCategoryItem, subIndex: number) => {
                        if (subIndex <= 3) {
                          return (
                            <View
                              style={styles.categoryImgContainer}
                              key={subOption.id}
                            >
                              <Image
                                style={styles.categoryImage}
                                source={{ uri: subOption.img_url }}
                              />
                            </View>
                          );
                        }
                        return null;
                      }
                    )}
                  </View>
                  <View style={styles.cardDetails}>
                    <Text style={styles.categoryName}>{option.name}</Text>
                    <View style={styles.categoryCountWrap}>
                      <Text style={styles.categoryCountText}>
                        {option.sub_sub_category_count}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }
            return null;
          })}
        </View>
      </>
    );
  };

const styles = StyleSheet.create({
  headingWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...spacingStyles.pt10,
  },
  headingText: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
  },
  seeAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: gapSizes.sm,
  },
  seeAllText: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayBold,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: gapSizes.md,
    justifyContent: "space-between",
    ...spacingStyles.py10,
    padding: 1,
  },
  cardItem: {
    width: "48.5%",
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r12,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    ...spacingStyles.py6,
    ...spacingStyles.px6,
  },
  subCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    rowGap: gapSizes.sm,
    
  },
  categoryImgContainer: {
    width: "48.5%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: borderRadius.r10,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...spacingStyles.mt8,
  },
  categoryName: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayExtraBold,
  },
  categoryCountWrap: {
    backgroundColor: "#DFE9FF",
    borderRadius: borderRadius.r6,
    ...spacingStyles.px15,
    ...spacingStyles.py4,
  },
  categoryCountText: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.ralewayExtraBold,
  },
});