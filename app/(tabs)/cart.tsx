import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import useBackHandler from "@/utils/useBackHandler";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
import ProductInfoScreen from "@/components/addToBag/ProductInfoSection";
import ShoppingCartScreen from "@/components/addToBag/ShoppingCartScreen";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { Button } from "@/components/common/Button";
import LoginModal from "@/app/(auth)/loginModal";
import SignUpModal from "@/app/(auth)/signUpModal";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAddresses } from "@/store/address/addressSlice";
import { fetchCartItemsApi } from "@/store/cart/cartSlice";

const ShoppingBagScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleGoBack = () => {
    router.back();
    return true;
  };

  useBackHandler(handleGoBack);

  useEffect(() => {
    const loadCartData = async () => {
      try {
        if (isAuthenticated && token) {
          await dispatch(fetchCartItemsApi()).unwrap();
          await dispatch(fetchAddresses()).unwrap();
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartData();
  }, [dispatch, isAuthenticated, token]);

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      setLoginModalVisible(true);
      return;
    }

    const selectedItems = cartItems.filter((item) => item.isSelected);
    if (selectedItems.length === 0) {
      alert("Please select at least one item to place an order.");
      return;
    }

    if (addresses.length > 0) {
      router.navigate({
        pathname: "/placeorder",
        params: { selectedItems: JSON.stringify(selectedItems) },
      });
    } else {
      router.navigate({
        pathname: "/addNewAddress",
        params: { selectedItems: JSON.stringify(selectedItems) },
      });
    }
  };

  const handleCloseLoginModal = () => {
    setLoginModalVisible(false);
  };

  const handleCloseSignupModal = () => {
    setSignupModalVisible(false);
  };

  const handleOpenSignupModal = () => {
    setLoginModalVisible(false);
    setSignupModalVisible(true);
  };

  const handleOpenLoginModal = () => {
    setSignupModalVisible(false);
    setLoginModalVisible(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={23}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
        </View>
        <FullScreenLoader visible={isLoading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContain}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SHOPPING BAG</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="heart-outline"
            size={22}
            color={staticColors.darkGray}
          />
        </TouchableOpacity>
      </View>
      <ShoppingCartScreen />
      <ProductInfoScreen />

      {cartItems.length > 0 && (
        <Button
          title="PLACE ORDER"
          style={styles.PlaceButton}
          onPress={handlePlaceOrder}
          textStyle={styles.PlaceText}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        onSignupPress={handleOpenSignupModal}
      />

      {/* Signup Modal */}
      <SignUpModal
        visible={isSignupModalVisible}
        onClose={handleCloseSignupModal}
        onLoginPress={handleOpenLoginModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgSecondary,
  },
  header: {
    flexDirection: "row",
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
  iconButton: {
    ...spacingStyles.ml10,
  },
  PlaceButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.p15,
    borderRadius: 0,
    marginBottom: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  PlaceText: { fontSize: fontSizes.base, letterSpacing: 1 },
});

export default ShoppingBagScreen;
