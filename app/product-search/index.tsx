import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "@/interfaces";
import { useAppDispatch } from "@/store/hooks";
import { fetchProducts } from "@/store/product/productsSlice";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import { fontSizes, fontWeights } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";

const ProductSearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const dispatch = useAppDispatch();
  const products = useSelector((state: any) => state.products.data);
  const loading = useSelector((state: any) => state.products.loading);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      setIsSearchSubmitted(true);
      dispatch(
        fetchProducts({
          params: {
            searchTerm: searchTerm,
          },
        })
      );
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchSubmitted(false);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.gallery?.[0]?.img_url }}
        style={styles.productImage}
      />
      <Text style={styles.productName}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  return (
    <SafeAreaViewWrapper>
      <View style={styles.container}>
        <View style={commonStyles.searchContainer}>
          <Text style={commonStyles.searchContainerText}>Shop</Text>
          <View style={commonStyles.searchInputContainer}>
            <TextInput
              placeholder="Search"
              style={commonStyles.searchInput}
              placeholderTextColor={staticColors.gray200}
              value={searchTerm}
              onChangeText={(text) => setSearchTerm(text)}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            <TouchableOpacity>
              <Ionicons
                name="camera-outline"
                size={20}
                color={staticColors.blue400}
              />
            </TouchableOpacity>
            {searchTerm ? (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={staticColors.darkGray}
                  style={styles.clearIcon}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {isSearchSubmitted ? (
          loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : products.length > 0 ? (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.productList}
            />
          ) : (
            <Text style={styles.noResultsText}>No products found</Text>
          )
        ) : null}
      </View>
    </SafeAreaViewWrapper>
  );
};

export default ProductSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...spacingStyles.px5,
  },
  productList: {
    ...spacingStyles.py2,
  },
  row: {
    justifyContent: "space-between",
    ...spacingStyles.mb10,
  },
  productCard: {
    flex: 1,
    ...spacingStyles.mx5,
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r5,
    ...spacingStyles.p10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: fontSizes.xs,
    fontFamily: fontFamilies.nunitoSans,
    fontWeight: fontWeights.medium,
    color: staticColors.black,
    ...spacingStyles.mb5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: staticColors.black,
  },
  loadingText: {
    textAlign: "center",

    fontSize: 16,
    color: staticColors.darkGray,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: staticColors.darkGray,
  },
  clearIcon: {
    marginLeft: 10,
  },
});
