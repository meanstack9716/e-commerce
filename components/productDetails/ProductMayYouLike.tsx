import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ProductTab from "./productTab/ProductTab";
import ProductMayYouLikeList from "./ProductMayYouLikeList";

const ProductMayYouLike: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ALL");

  return (
    <View style={styles.container}>
      <ProductTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProductMayYouLikeList activeTab={activeTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProductMayYouLike;
