import React, { ReactNode } from "react";
import { CartProvider } from "@/components/addToBag/cartContext";

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default AppProvider;
