import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import useBackHandler from "@/utils/useBackHandler";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAddresses } from "@/store/address/addressSlice";
import {
  fetchCartItemsApi,
  removeFromCartApi,
  updateCartItemQuantityApi,
} from "@/store/cart/cartSlice";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";
import { fontFamilies } from "@/style/fontFamilies";
import ContactCard from "@/components/contactCard/ContactCard";
import EmptyCart from "@/components/cart-items/emptyCart";
import { CartItem } from "@/interfaces";
import { getFormattedAddress } from "@/utils/formatAddress";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import CardItemCard from "@/components/cart-items/cartItemCard";
import ProductDeleteConfirmationModal from "@/modal/ProductDeleteConfirmationModal";
import Toast from "react-native-toast-message";

const ShoppingBagScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, loading } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.auth.token);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [confirmationModalDetails, setConfirmationModalDetails] = useState<{
    message: string;
    onPrimaryAction: () => void;
    onSecondaryAction: () => void;
  }>({
    message: "",
    onPrimaryAction: () => {},
    onSecondaryAction: () => {},
  });

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

  useEffect(() => {
    if (!selectedItems.length && cartItems.length) {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  }, [cartItems]);

  const handleCloseModal = () => {
    setIsConfirmationModalVisible(false);
    setConfirmationModalDetails({
      message: "",
      onPrimaryAction: () => {},
      onSecondaryAction: () => {},
    });
  };

  const onDeleteCartItem = (id: string) => {
    setConfirmationModalDetails({
      message: `Are you sure you want to remove this item from bag?`,
      onPrimaryAction: () => {
        handleCloseModal();
      },
      onSecondaryAction: async () => {
        dispatch(removeFromCartApi({ ids: [id] }));
        handleCloseModal();
      },
    });
    setIsConfirmationModalVisible(true);
  };

  const onCartItemQuantityUpdate = (quantity: number, cartId: string) => {
    if (quantity === 0) {
      onDeleteCartItem(cartId);
    } else {
      dispatch(
        updateCartItemQuantityApi({
          id: cartId,
          quantity: quantity,
        })
      );
    }
  };

  const onToggleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <CardItemCard
        cartItem={item}
        selectedItems={selectedItems}
        onToggleSelect={onToggleSelect}
        from="cart"
        onPressDelete={onDeleteCartItem}
        onQuantityChange={onCartItemQuantityUpdate}
      />
    );
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.length && selectedItems.includes(item.id)) {
        return total + item.product.final_price * item.quantity;
      }
      return total;
    }, 0);
  };

  const handlePlaceOrder = () => {
    const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
    if (selectedCartItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "No Items Selected",
        text2: "Please select at least one item to place an order.",
      });
      return;
    }

    const path = addresses.length ? "/placeorder" : "/addNewAddress";
    router.navigate({
      pathname: path,
      params: { selectedItems: JSON.stringify(selectedCartItems) },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <FullScreenLoader visible={isLoading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.container}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Cart</Text>
            <View style={styles.itemCountWrap}>
              <Text style={styles.itemCount}>{cartItems.length}</Text>
            </View>
          </View>
          {isAuthenticated && (
            <ContactCard
              title="Shipping Address"
              information={[getFormattedAddress(addresses)]}
            />
          )}
          {cartItems.length ? (
            <View style={styles.itemsWrapper}>
              <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                scrollEnabled={false}
                keyExtractor={(item, index) => item.id}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                initialNumToRender={10}
              />
            </View>
          ) : (
            <EmptyCart />
          )}
        </ScrollView>
        {cartItems.length && (
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPrice}>
              Total ₹ {calculateTotalPrice()}
            </Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                calculateTotalPrice() === 0 && styles.disableButton,
              ]}
              onPress={handlePlaceOrder}
              disabled={calculateTotalPrice() === 0}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ProductDeleteConfirmationModal
        visible={isConfirmationModalVisible}
        title="Delete Cart Item"
        message={confirmationModalDetails.message}
        primaryButtonText="CANCEL"
        secondaryButtonText="REMOVE"
        onFirstButtonPress={confirmationModalDetails.onPrimaryAction}
        onSecondButtonPress={confirmationModalDetails.onSecondaryAction}
        onClose={handleCloseModal}
        isLoading={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: staticColors.gray100,
  },
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.px12,
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
    ...spacingStyles.mr12
  },
  itemsWrapper: {
    ...spacingStyles.py15,
  },
  totalPriceContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.px25,
    ...spacingStyles.py15,
    ...spacingStyles.mt5,
  },
  totalPrice: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },
  checkoutButton: {
    backgroundColor: staticColors.blue500,
    ...spacingStyles.px30,
    ...spacingStyles.py10,
    borderRadius: borderRadius.r12,
  },
  checkoutButtonText: {
    fontSize: fontSizes.md,
    color: staticColors.white,
    fontFamily: fontFamilies.nunitoSans,
  },
  disableButton: {
    backgroundColor: staticColors.mutedGray,
  },
});

export default ShoppingBagScreen;
