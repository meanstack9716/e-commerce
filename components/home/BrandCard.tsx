import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import brandData from "../../assets/data/brand.json";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
const { width } = Dimensions.get("window");

interface Brand {
  id: string;
  name: string;
  category: string;
  image: string;
}

const BrandCard = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    setBrands(brandData);
  }, []);

  const renderBrandCard = ({ item }: { item: Brand }) => (
    <TouchableOpacity style={styles.brandCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.brandImage}
        resizeMode="cover"
      />
      <View style={styles.brandInfo}>
        <Text style={styles.brandName}>{item.name}</Text>
        <Text style={styles.brandCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.sectionTitle}>CONTINUE BROWSING THESE BRANDS</Text>
      <FlatList
        data={brands}
        renderItem={renderBrandCard}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: staticColors.primary,
    fontFamily: "helveticaBold",
    textAlign: "center",
  },
  brandList: {
    paddingVertical: 10,
  },
  brandCard: {
    width: width * 0.4,
    ...spacingStyles.mr15,
    borderRadius: 10,
    backgroundColor: staticColors.white,
    overflow: "hidden",
    elevation: 1,
  },
  brandImage: {
    width: "100%",
    height: 200,
    backgroundColor: staticColors.bgMuted,
  },
  brandInfo: {
    padding: 15,
    alignItems: "center",
  },
  brandName: {
    fontSize:fontSizes.base,
    fontWeight: "600",
    color: staticColors.darkGray,
    textAlign: "center",
  },
  brandCategory: {
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
    ...spacingStyles.mt2,
  },
});

export default BrandCard;
