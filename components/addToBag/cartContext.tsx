import React, { createContext, useContext, useState } from "react";
import { Profile } from "../../types/types";

interface CartItem {
  id: string;
  title: string;
  price: string;
  images: string[];
  quantity: number;
  selectedSize?: string;
  seller?: string;
  originalPrice?: string;
  isSelected?: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Profile, selectedSize?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleItemSelection: (id: string) => void;
  deleteSelectedItems: () => void;
  moveToWishlist: (itemIds: string[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Profile, selectedSize?: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            images: product.images,
            quantity: 1,
            selectedSize,
            seller: "",
            originalPrice: (parseFloat(product.price) * 1.69).toFixed(0),
            isSelected: true,
          },
        ];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleItemSelection = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  const deleteSelectedItems = () => {
    setCartItems((prevItems) => prevItems.filter((item) => !item.isSelected));
  };

  const moveToWishlist = (itemIds: string[]) => {
    const itemsToMove = cartItems.filter((item) => itemIds.includes(item.id));
    console.log(`Moving items to wishlist:`, itemsToMove);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleItemSelection,
        deleteSelectedItems,
        moveToWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
