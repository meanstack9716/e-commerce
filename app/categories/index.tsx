import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  BackHandler,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { fetchCategories } from "@/store/category/categoriesSlice";
import { CategoryItem , SubSubCategory  } from "@/types/types";
import fontSizes from "@/style/fontSizes";
import FullScreenLoader from "@/components/common/FullScreenLoader";
const CategoriesScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { categoryId, categoryTitle } = params;

  const dispatch = useAppDispatch();
  const { data: categories, loading: isLoading, error } = useSelector(
    (state: RootState) => state.categories
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    (categoryId as string) || null
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId as string);
    } else if (categories.length > 0 && !selectedCategory) {
      const firstCategoryId = categories[0].id;
      setSelectedCategory(firstCategoryId);
    }
  }, [categoryId, categories, selectedCategory]);

  useEffect(() => {
    const onBackPress = () => {
      router.back();
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
  
    return () => {
      backHandler.remove();
    };
  }, []);
  

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderSidebarItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={[
        styles.sidebarItem,
        selectedCategory === item.id && styles.selectedSidebarItem,
      ]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <View style={styles.sidebarItemInner}>
        <View
          style={[
            styles.sidebarBorder,
            selectedCategory === item.id && styles.selectedSidebarBorder,
          ]}
        />
        <Image source={{ uri: item.img_url }} style={styles.sidebarImage} />
      </View>
      <Text
        style={[
          styles.sidebarText,
          selectedCategory === item.id && styles.selectedSidebarText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSpotlightItem = ({ item }: { item: SubSubCategory }) => (
    <TouchableOpacity style={styles.spotlightItem}>
      <View style={styles.spotlightImageContainer}>
        <Image source={{ uri: item.img_url }} style={styles.spotlightImage} />
      </View>
      <Text style={styles.spotlightTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderGridSection = (title: string, items: SubSubCategory[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.spotlightGrid}>
        {items.map((item) => (
          <View key={item.id} style={styles.spotlightItemWrapper}>
            {renderSpotlightItem({ item })}
          </View>
        ))}
      </View>
    </View>
  );

  const renderCategoryDetails = () => {
    const selectedCategoryData = categories.find(
      (category) => category.id === selectedCategory
    );

    if (!selectedCategoryData || !selectedCategoryData.sub_categories) {
      return <Text style={styles.errorText}>No subcategories available</Text>;
    }

    return selectedCategoryData.sub_categories.map((subCategory) => (
      <View key={subCategory.id}>
        {subCategory.sub_sub_categories &&
          subCategory.sub_sub_categories.length > 0 &&
          renderGridSection(subCategory.name, subCategory.sub_sub_categories)}
      </View>
    ));
  };

  const renderError = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(fetchCategories())}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={isLoading} />
      <View style={styles.header}>
        <View style={styles.headerContain}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={staticColors.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {categoryTitle ? categoryTitle : "Categories"}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color={staticColors.darkGray} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="bag-outline" size={22} color={staticColors.darkGray} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {error ? (
        <View style={styles.centeredContent}>{renderError()}</View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.sidebar}>
            {categories.length === 0 && !isLoading ? (
              <Text style={styles.errorText}>No categories available</Text>
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderSidebarItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
          <ScrollView
            style={styles.mainContent}
            showsVerticalScrollIndicator={false}
          >
            {renderCategoryDetails()}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    ...spacingStyles.pt25
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...spacingStyles.px15,
    ...spacingStyles.py10,
  },
  backButton: {
    ...spacingStyles.p5,
  },
  headerContain: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: "500",
    color: staticColors.darkGray,
  },
  headerRight: {
    flexDirection: "row",
  },
  iconButton: {
    ...spacingStyles.ml10,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebar: {
    width: 90,
    backgroundColor: staticColors.bgPrimary,
  },
  sidebarItem: {
    alignItems: "center",
    ...spacingStyles.p10,
  },
  sidebarItemInner: {
    position: "relative",
    flexDirection: "row",
  },
  sidebarBorder: {
    position: "absolute",
    left: -18,
    width: 6,
    height: 45,
    backgroundColor: "transparent",
  },
  selectedSidebarBorder: {
    backgroundColor: colors.primary,
  },
  selectedSidebarItem: {
    backgroundColor: colors.white,
  },
  sidebarImage: {
    width: 55,
    height: 45,
    borderRadius: 10,
    resizeMode: "cover",
  },
  sidebarText: {
    fontSize: fontSizes.xs,
    textAlign: "center",
    ...spacingStyles.mt5,
    fontWeight:"600",
    color: staticColors.darkGray,
  },
  selectedSidebarText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: fontSizes.sm,
  },
  mainContent: {
    flex: 1,
    ...spacingStyles.py10,
    ...spacingStyles.px15,
  },
  section: {
    ...spacingStyles.mb5,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontFamily: "HelveticaBold",
    ...spacingStyles.mx10,
    color: colors.primary,
  },
  spotlightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  spotlightItemWrapper: {
    width: "33%",
    ...spacingStyles.mb20,
    alignItems: "center",
  },
  spotlightItem: {
    alignItems: "center",
    width: 90,
  },
  spotlightImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: staticColors.bgMuted,
  },
  spotlightImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  spotlightTitle: {
    fontSize: fontSizes.xs,
    textAlign: "center",
    ...spacingStyles.mt8,
    color: colors.primary,
    fontWeight: "600",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: colors.errorColor || "#FF0000",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
});

export default CategoriesScreen;