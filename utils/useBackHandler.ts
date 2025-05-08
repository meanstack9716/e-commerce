import { useEffect } from "react";
import { BackHandler } from "react-native";

const useBackHandler = (handler: () => boolean) => {
  useEffect(() => {
    const backButtonListener = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => backButtonListener.remove();
  }, [handler]);
};

export default useBackHandler;
