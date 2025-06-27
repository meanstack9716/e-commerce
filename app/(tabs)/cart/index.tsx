import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import useBackHandler from "@/utils/useBackHandler";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAddresses } from "@/store/address/addressSlice";
import {
  fetchCartItemsApi,
  removeFromCartApi,
  updateCartItemQuantityApi,
} from "@/store/cart/cartSlice";
import ContactCard from "@/components/contactCard/ContactCard";
import EmptyCart from "@/components/cart-items/emptyCart";
import { CartItem } from "@/interfaces";
import { getFormattedAddress } from "@/utils/formatAddress";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import CardItemCard from "@/components/cart-items/cartItemCard";
import ProductDeleteConfirmationModal from "@/modal/ProductDeleteConfirmationModal";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import { commonStyles } from "@/style/commonStyle";

const ShoppingBagScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, loading } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.auth.token);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const selectedAddressId = useSelector(
    (state: RootState) => state.address.selectedAddressId
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const [confirmationModalDetails, setConfirmationModalDetails] = useState<{
    message: string;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
  }>({
    message: "",
  });

  const handleGoBack = () => {
    router.back();
    return true;
  };

  useBackHandler(handleGoBack);

  useFocusEffect(
    useCallback(() => {
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
    }, [isAuthenticated, token])
  );

  useEffect(() => {
    if (selectedItems.length === 0 && cartItems.length > 0) {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  }, [cartItems]);

  const handleCloseModal = () => {
    setIsConfirmationModalVisible(false);
    setConfirmationModalDetails({
      message: "",
    });
  };

  const onDeleteCartItem = (id: string) => {
    setConfirmationModalDetails({
      message: `Are you sure you want to remove this item from bag?`,
      onPrimaryAction: handleCloseModal,
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
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (selectedCartItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "No Items Selected",
        text2: "Please select at least one item to place an order.",
      });
      return;
    }

    const path = "/placeorder";
    router.navigate({
      pathname: path,
      params: { selectedItems: selectedItems },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaViewWrapper style={styles.container}>
        <FullScreenLoader visible={isLoading} />
      </SafeAreaViewWrapper>
    );
  }

  return (
    <SafeAreaViewWrapper>
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.container}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.itemCountHeader}>
            <Text style={commonStyles.itemCountTitle}>Cart</Text>
            {isAuthenticated && token && (
              <View style={commonStyles.itemCountWrap}>
                <Text style={commonStyles.itemCount}>
                  {cartItems.length ? cartItems.length : 0}
                </Text>
              </View>
            )}
          </View>
          {isAuthenticated && token && (
            <ContactCard
              title="Shipping Address"
              information={[getFormattedAddress(addresses, selectedAddressId)]}
            />
          )}
          {isAuthenticated && token && cartItems.length ? (
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
        {isAuthenticated && token && cartItems.length ? (
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
        ) : (
          <></>
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
    </SafeAreaViewWrapper>
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
  backButton: {
    ...spacingStyles.mr12,
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
