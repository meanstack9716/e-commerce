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
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { CategoryItem, SubCategoryItem } from "@/interfaces";
import gapSizes from "@/style/gapSizes";
import { fontFamilies } from "@/style/fontFamilies";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";

const CategoriesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: categories,
    loading: isLoading,
    error,
  } = useSelector((state: RootState) => state.categories);
  const { categoryId } = useLocalSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    if (categoryId && typeof categoryId === "string") {
      setSelectedCategory(categoryId);
    } else if (categories && categories.length) {
      setSelectedCategory(categories[0].id);
    }
  }, [categoryId, categories]);

  useEffect(() => {
    setExpandedSubCategory(null);
  }, [selectedCategory]);

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

  const onExpandCategory = (item: SubCategoryItem) => {
    if (expandedSubCategory === item.id || !item.sub_sub_categories.length) {
      setExpandedSubCategory(null);
    } else {
      setExpandedSubCategory(item.id);
    }
  };

  const renderCategoryList = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryName,
          selectedCategory === item.id && styles.selectedCategoryName,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSubCategoryList = ({ item }: { item: SubCategoryItem }) => (
    <View style={styles.listItemWrap}>
      <TouchableOpacity
        style={styles.subCategoryContainer}
        onPress={() => onExpandCategory(item)}
      >
        <View style={styles.subCategoryItem}>
          <View style={styles.categoryImgContainer}>
            <Image src={item.img_url} style={styles.categoryImage} />
          </View>
          <Text style={styles.subCategoryName}>{item.name}</Text>
        </View>
        {item.sub_sub_categories.length && (
          <View
            style={[
              styles.toggleIcon,
              expandedSubCategory === item.id && styles.expandedIcon,
            ]}
          >
            <Ionicons
              name="chevron-down-sharp"
              size={26}
              color={
                expandedSubCategory === item.id
                  ? staticColors.blue300
                  : staticColors.black
              }
            />
          </View>
        )}
      </TouchableOpacity>
      {expandedSubCategory === item.id && (
        <View style={styles.categoryList}>
          {item.sub_sub_categories.length ? (
            item.sub_sub_categories.map((subSubCategory, index) => (
              <TouchableOpacity
                key={subSubCategory.id}
                style={styles.categoryListItem}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/home/product-search",
                    params: { subSubCategoryId: subSubCategory.id },
                  })
                }
              >
                <Text style={styles.categoryListItemText}>
                  {subSubCategory.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.notFoundContainer}>
              <Text style={styles.errorText}>No categories available</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

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
    <SafeAreaViewWrapper style={styles.container}>
      <ScrollView
        style={styles.mainContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingWrap}>
          <Text style={styles.headingText}>All Categories</Text>
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.cancelButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.centeredContent}>{renderError()}</View>
        ) : (
          <View style={styles.contentContainer}>
            {!categories.length && !isLoading ? (
              <Text style={styles.errorText}>No categories available</Text>
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderCategoryList}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            )}
            {selectedCategory &&
              categories.length &&
              categories.map((option: CategoryItem, index: number) => {
                if (option.id === selectedCategory) {
                  return (
                    <View key={option.id} style={{ ...spacingStyles.mt25 }}>
                      {option.sub_categories.length ? (
                        <FlatList
                          data={option.sub_categories}
                          keyExtractor={(item) => item.id}
                          scrollEnabled={false}
                          renderItem={renderSubCategoryList}
                          showsVerticalScrollIndicator={false}
                        />
                      ) : (
                        <View style={styles.notFoundContainer}>
                          <Text style={styles.errorText}>
                            No Sub categories available
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                }
              })}
          </View>
        )}
      </ScrollView>
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContent: {
    flex: 1,
    ...spacingStyles.px15,
  },
  headingWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headingText: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.ralewayBold,
  },
  cancelButton: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    ...spacingStyles.py20,
  },
  categoryItem: {
    backgroundColor: staticColors.gray300,
    borderRadius: borderRadius.r10,
    minWidth: 120,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: staticColors.gray300,
    ...spacingStyles.py8,
    ...spacingStyles.px25,
    ...spacingStyles.mx5,
  },
  selectedCategoryItem: {
    borderColor: staticColors.blue300,
    backgroundColor: staticColors.blue100,
  },
  categoryName: {
    fontWeight: fontWeights.medium,
    fontFamily: fontFamilies.ralewayMedium,
  },
  selectedCategoryName: {
    color: staticColors.blue300,
  },
  listItemWrap: {
    ...spacingStyles.py10,
    ...spacingStyles.mx4,
  },
  subCategoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: staticColors.white,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignItems: "center",
    borderRadius: borderRadius.r10,
    ...spacingStyles.p4,
  },
  subCategoryItem: {
    flexDirection: "row",
    gap: gapSizes.lg,
    alignItems: "center",
    flexWrap: "wrap",
  },
  subCategoryName: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    fontFamily: fontFamilies.ralewayBold,
  },
  categoryImgContainer: {
    width: 50,
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: borderRadius.r10,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  toggleIcon: {
    ...spacingStyles.px15,
  },
  categoryList: {
    flexDirection: "row",
    justifyContent: "space-between",
    rowGap: gapSizes.md,
    flexWrap: "wrap",
    alignItems: "center",
    textAlign: "center",
    ...spacingStyles.mt5,
    ...spacingStyles.py10,
    ...spacingStyles.px4,
  },
  categoryListItem: {
    width: "48.5%",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: borderRadius.r10,
    borderWidth: 2,
    borderColor: staticColors.pink100,
    ...spacingStyles.py10,
    ...spacingStyles.px6,
  },
  categoryListItemText: {
    fontWeight: fontWeights.semiBold,
    textAlign: "center",
    fontFamily: fontFamilies.ralewayBold,
  },
  expandedIcon: {
    transform: [{ rotate: "180deg" }],
  },
  notFoundContainer: {
    backgroundColor: staticColors.white,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderRadius: borderRadius.r10,
    ...spacingStyles.mt20,
  },
  errorText: {
    textAlign: "center",
    color: staticColors.errorColor || "#FF0000",
    ...spacingStyles.p20,
  },
  errorContainer: {
    alignItems: "center",
    ...spacingStyles.p20,
  },
  retryButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mt10,
  },
  retryButtonText: {
    color: staticColors.white,
    fontWeight: fontWeights.semiBold,
  },
});

export default CategoriesScreen;
