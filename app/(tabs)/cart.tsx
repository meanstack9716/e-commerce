import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import useBackHandler from "@/utils/useBackHandler";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import ProductInfoScreen from "@/components/addToBag/ProductInfoSection";
import ShoppingCartScreen from "@/components/addToBag/ShoppingCartScreen";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { Button } from "@/components/common/Button";
import LoginModal from "@/app/(auth)/loginModal";
import SignUpModal from "@/app/(auth)/signUpModal";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAddresses } from "@/store/address/addressSlice";
import { fetchCartItemsApi } from "@/store/cart/cartSlice";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";
import { fontFamilies } from "@/style/fontFamilies";
import ContactCard from "@/components/contactCard/ContactCard";
import images from "@/constants/images";

const ShoppingBagScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const token = useSelector((state: RootState) => state.auth.token);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  // const [isSignupModalVisible, setSignupModalVisible] = useState(false);

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

  // const handlePlaceOrder = () => {
  //   if (!isAuthenticated) {
  //     setLoginModalVisible(true);
  //     return;
  //   }
  //   const selectedItems = cartItems.filter((item) => item.isSelected);
  //   if (selectedItems.length === 0) {
  //     Toast.show({
  //       type: "error",
  //       text1: "No Items Selected",
  //       text2: "Please select at least one item to place an order.",
  //     });
  //     return;
  //   }

  //   const path = addresses.length ? "/placeorder" : "/addNewAddress";
  //   router.navigate({
  //     pathname: path,
  //     params: { selectedItems: JSON.stringify(selectedItems) },
  //   });
  // };

  // const handleCloseLoginModal = () => {
  //   setLoginModalVisible(false);
  // };

  // const handleCloseSignupModal = () => {
  //   setSignupModalVisible(false);
  // };

  // const handleOpenSignupModal = () => {
  //   setLoginModalVisible(false);
  //   setSignupModalVisible(true);
  // };

  // const handleOpenLoginModal = () => {
  //   setSignupModalVisible(false);
  //   setLoginModalVisible(true);
  // };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <FullScreenLoader visible={isLoading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.itemCountWrap}>
          <Text style={styles.itemCount}>{cartItems.length}</Text>
        </View>
      </View>
      <ContactCard
        title="Shipping Address"
        information={[
          "26, Duong So 2, Thao Dien Ward, An Phu, District 2, Ho Chi Minh city",
        ]}
      />

      <View style={styles.notfoundContainer}>
        <View style={styles.notFoundLogoWrap}>
                    <Image source={images.emptyCart} style={styles.cartImage} resizeMode="contain"/>
        </View>
      </View>

      {/* Header */}
      {/* <View style={styles.header}>
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

      <LoginModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        onSignupPress={handleOpenSignupModal}
      />

      <SignUpModal
        visible={isSignupModalVisible}
        onClose={handleCloseSignupModal}
        onLoginPress={handleOpenLoginModal}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.px25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.md,
    ...spacingStyles.py10,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.ralewayBold,
  },
  itemCountWrap: {
    borderRadius: borderRadius.circle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: staticColors.iceBlue,
    ...spacingStyles.px10,
    ...spacingStyles.pb6,
  },
  itemCount: {
    fontSize: fontSizes.lg,
    textAlign: "center",
    fontFamily: fontFamilies.ralewayBold,
  },
  backButton: {
    ...spacingStyles.p5,
  },
  notfoundContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.py20,
  },
  notFoundLogoWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    borderRadius: borderRadius.circle,
    width: "60%",
    aspectRatio: 1,
    overflow: "hidden",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: "white",
  },
  cartImage: {
    width: 100,
    height: 100  
  }
  // headerContain: {
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // headerTitle: {
  //   fontSize: fontSizes.base,
  //   fontWeight: fontWeights.medium,
  //   color: staticColors.darkGray,
  // },
  // iconButton: {
  //   ...spacingStyles.ml10,
  // },
  // PlaceButton: {
  //   backgroundColor: staticColors.primary,
  //   ...spacingStyles.p15,
  //   borderRadius: borderRadius.r0,
  //   marginBottom: 0,
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // },
  // PlaceText: { fontSize: fontSizes.base, letterSpacing: 1 },
});

export default ShoppingBagScreen;
