import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { CategoryItem } from "@/types/types";
import {fontSizes, fontWeights} from "@/style/typography";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";

interface CategoryGridProps {
  activeTab: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  activeTab,
  onCategorySelect,
}) => {
  const { data: categories } = useSelector((state: any) => state.categories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const prevTabRef = useRef<string>(activeTab);

  const activeCategories =
    activeTab.toLowerCase() === "all"
      ? categories
          .flatMap((category: CategoryItem) => category.sub_categories)
          .slice(0, 8)
      : (
          categories.filter(
            (category: CategoryItem) =>
              category.name.toLowerCase() === activeTab.toLowerCase()
          )[0]?.sub_categories || []
        ).slice(0, 8);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      const defaultCategory = activeCategories[0];
      const defaultCategoryId = defaultCategory?.id || null;

      setSelectedCategoryId(defaultCategoryId);
      onCategorySelect(defaultCategoryId || "");
      prevTabRef.current = activeTab;
    }
  }, [activeTab, activeCategories, onCategorySelect]);

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      onCategorySelect("");
    } else {
      setSelectedCategoryId(categoryId);
      onCategorySelect(categoryId);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {activeCategories.map((category: any) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View
                style={[
                  styles.imageContainer,
                  isSelected && styles.activeImageContainer,
                ]}
              >
                <Image
                  source={{ uri: category.img_url }}
                  style={styles.categoryImage}
                />
              </View>
              <Text
                style={[styles.categoryTitle, isSelected && styles.activeTitle]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.mx5,
  },
  categoriesContainer: {
    ...spacingStyles.py2,
  },
  categoryItem: {
    alignItems: "center",
    width: 85,
  },
  imageContainer: {
    width: 75,
    height: 75,
    borderRadius: borderRadius.r20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: staticColors.bgMuted,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  activeImageContainer: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryTitle: {
    fontSize: fontSizes.xs,
    ...spacingStyles.mt5,
    textAlign: "center",
  },
  activeTitle: {
    color: colors.primary,
    fontWeight:fontWeights.bold,
  },
});

export default CategoryGrid;
