import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import data from "@/assets/data/products.json";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";

interface CategoryItem {
  id: string;
  title: string;
  imageUrl: string;
  isActive?: boolean;
}

interface CategoryGridProps {
  activeTab: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  activeTab,
  onCategorySelect,
}) => {
  const productData = data as { categories: { [key: string]: CategoryItem[] } };
  
  const availableTabs = Object.keys(productData.categories);
  const matchedTab = availableTabs.find(
    tab => tab.toLowerCase() === activeTab.toLowerCase()
  ) || "All";
  
  const activeCategories = productData.categories[matchedTab] || [];
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const prevTabRef = useRef<string>(activeTab);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      const defaultCategory = activeCategories[0];
      const defaultCategoryId = defaultCategory?.id || null;
  
      setSelectedCategoryId(defaultCategoryId);
      onCategorySelect(defaultCategoryId || "");
      prevTabRef.current = activeTab;
    }
  }, [activeTab, activeCategories]);
  

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
        {activeCategories.map((category: CategoryItem) => {
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
                  source={{ uri: category.imageUrl }}
                  style={styles.categoryImage}
                />
              </View>
              <Text
                style={[
                  styles.categoryTitle,
                  isSelected && styles.activeTitle,
                ]}
              >
                {category.title}
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
    ...spacingStyles.mx5
  },
  categoriesContainer: {
    ...spacingStyles.py2
  },
  categoryItem: {
    alignItems: "center",
    width: 85,
  },
  imageContainer: {
    width: 75,
    height: 75,
    borderRadius: 20,
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
    fontWeight: "700",
  },
});

export default CategoryGrid;