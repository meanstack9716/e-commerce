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
import categoriesData from "../../assets/data/category-data.json";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";

interface CategoryItem {
  id: string;
  title: string;
  imageUrl: string;
}

interface SpotlightItem {
  id: string;
  title: string;
  imageUrl: string;
}

interface StoreItem {
  id: string;
  title: string;
  imageUrl: string;
}

const CategoriesScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { categoryId, categoryTitle } = params;

  const sidebarCategories: CategoryItem[] = [
    {
      id: "trending",
      title: "Trending Now",
      imageUrl:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQBxhOCxZs3zo0Qlpn72vIlhWjTG8alq0AU7un_MUXWiuWwJCtD",
    },
    {
      id: "men",
      title: "Men's Wear",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC7wnKA_8jaZEdZY_kZBLgGI7kbzadW2vKNQ&s",
    },
    {
      id: "women",
      title: "Women's Wear",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShfXxyQ8GDk8wllWVptpn-aVkWCuJcPBIFpA&s",
    },
    {
      id: "kids",
      title: "Kids Wear",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt6qGDwhaA9ubQKppLzzDKQqaYa5qzlu5NV6cjCHAYhdWYau3etT4WjH6rJpncc2UAc5w&usqp=CAU",
    },
    {
      id: "footwear",
      title: "Footwear",
      imageUrl:
        "https://m.media-amazon.com/images/I/31sI-rxlmWL._AC_UY1000_.jpg",
    },
    {
      id: "beautyAndGrooming",
      title: "Beauty & Grooming",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBzZMe22iEWMvU_BiAxk8n4W4kfQkKZPMa_A&s",
    },
    {
      id: "homeAndLiving",
      title: "Home & Living",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQydg-hPWV4zFSfYk20qgJVWxRAOJ1YwrJoOw&s",
    },
    {
      id: "accessories",
      title: "Accessories",
      imageUrl:
        "https://media.theeverygirl.com/wp-content/uploads/2024/07/the-everygirl-feature-amazon-summer-accessories-2025.jpg",
    },
    {
      id: "gadgets",
      title: "Gadgets",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiG59Twie2L3rCAN5Ks1e_D6iylqt6gTexlQ&s",
    },
    {
      id: "jewellery",
      title: "Jewellery",
      imageUrl:
        "https://www.urvaa.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-27-at-12.27.59-PM.jpeg",
    },
  ];

  const {
    trendingNow: { spotlight: spotlightItems, trendingStores },
    mensWear: {
      casualWear,
      workWear,
      occasionWear,
      sportsWear,
      genZFashion: menGenZFashion,
    },
    womensWear: {
      westernWear,
      ethnicWear,
      genZFashion: womenGenZFashion,
      genzFootwear,
    },
    kidsWear: { infants, girls, boys, teens, footwear: kidsFootwear },
    footwear: {
      womensFootwear: womensfootwear,
      mensFootwear: mensfootwear,
      genzFootwear: mensGenzFootwear,
    },
    beautyAndGrooming: { grooming, fragrances, hairCare, skincare, makeup },
    homeAndLiving: { kitchenAndDining, homeDecor, bathAndBedding },
    accessories: { mensAccessories, womensAccessories },
    gadgets: { gadGet },
    jewellery: { jewellery },
  } = categoriesData;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    (categoryId as string) || "trending"
  );

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId as string);
    }
  }, [categoryId]);

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const onBackPress = () => {
      handleGoBack();
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
  

  const renderSidebarItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={[
        styles.sidebarItem,
        selectedCategory === item.id && styles.selectedSidebarItem,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <View style={styles.sidebarItemInner}>
        <View
          style={[
            styles.sidebarBorder,
            selectedCategory === item.id && styles.selectedSidebarBorder,
          ]}
        />
        <Image source={{ uri: item.imageUrl }} style={styles.sidebarImage} />
      </View>
      <Text
        style={[
          styles.sidebarText,
          selectedCategory === item.id && styles.selectedSidebarText,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderSpotlightItem = ({ item }: { item: SpotlightItem }) => (
    <TouchableOpacity style={styles.spotlightItem}>
      <View style={styles.spotlightImageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.spotlightImage} />
      </View>
      <Text style={styles.spotlightTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderGridSection = (
    title: string,
    items: (SpotlightItem | StoreItem)[]
  ) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContain}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {categoryTitle ? categoryTitle : "Categories"}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="bag-outline" size={22} color="#333" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <FlatList
            data={sidebarCategories}
            keyExtractor={(item) => item.id}
            renderItem={renderSidebarItem}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Main Content Area */}
        <ScrollView
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {selectedCategory === "trending" && (
            <>
              {renderGridSection("In The Spotlight", spotlightItems)}
              {renderGridSection("Trending Stores", trendingStores)}
            </>
          )}
          {selectedCategory === "men" && (
            <>
              {renderGridSection("Casual Wear", casualWear)}
              {renderGridSection("Work Wear", workWear)}
              {renderGridSection("Occasion Wear", occasionWear)}
              {renderGridSection("Sports Wear", sportsWear)}
              {renderGridSection("Gen Z Fashion", menGenZFashion)}
            </>
          )}
          {selectedCategory === "women" && (
            <>
              {renderGridSection("Western Wear", westernWear)}
              {renderGridSection("Ethnic Wear", ethnicWear)}
              {renderGridSection("Gen Z Fashion", womenGenZFashion)}
              {renderGridSection("Gen Z Footwear", genzFootwear)}
            </>
          )}
          {selectedCategory === "kids" && (
            <>
              {renderGridSection("Infants", infants)}
              {renderGridSection("Girls", girls)}
              {renderGridSection("Boys", boys)}
              {renderGridSection("Teens", teens)}
              {renderGridSection("Footwear", kidsFootwear)}
            </>
          )}
          {selectedCategory === "footwear" && (
            <>
              {renderGridSection("Women's Footwear", womensfootwear)}
              {renderGridSection("GenZ Men's Footwear", mensfootwear)}
              {renderGridSection("GenZ Women's Footwear", mensGenzFootwear)}
            </>
          )}
          {selectedCategory === "beautyAndGrooming" && (
            <>
              {renderGridSection("Grooming", grooming)}
              {renderGridSection("Fragrances", fragrances)}
              {renderGridSection("Hair Care", hairCare)}
              {renderGridSection("Skincare", skincare)}
              {renderGridSection("Makeup", makeup)}
            </>
          )}
          {selectedCategory === "homeAndLiving" && (
            <>
              {renderGridSection("Kitchen & Dining", kitchenAndDining)}
              {renderGridSection("Home Decor", homeDecor)}
              {renderGridSection("Bath & Bedding", bathAndBedding)}
            </>
          )}
          {selectedCategory === "accessories" && (
            <>
              {renderGridSection("Men's Accessories", mensAccessories)}
              {renderGridSection("Women's Accessories", womensAccessories)}
            </>
          )}
          {selectedCategory === "gadgets" && (
            <>{renderGridSection("Gadgets", gadGet)}</>
          )}
          {selectedCategory === "jewellery" && (
            <>{renderGridSection("Jewellery", jewellery)}</>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...spacingStyles.px15,
    ...spacingStyles.py10
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
  sidebar: {
    width: 90,
    backgroundColor: staticColors.bgPrimary,
  },
  sidebarItem: {
    alignItems: "center",
    ...spacingStyles.p10
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
    fontWeight: "600",
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
    ...spacingStyles.mb5
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
    // justifyContent: "space-between",
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
  storeItem: {
    alignItems: "center",
    width: 90,
  },
  storeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: staticColors.bgMuted,
  },
  storeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  storeTitle: {
    fontSize: fontSizes.xs,
    textAlign: "center",
    ...spacingStyles.mt8,
    color: staticColors.darkGray,
    fontWeight: "500",
  },
});

export default CategoriesScreen;
