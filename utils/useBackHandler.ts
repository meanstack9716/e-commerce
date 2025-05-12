import { BackHandler } from "react-native";

const useBackHandler = (handler: () => boolean) => {
    const backButtonListener = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => backButtonListener.remove();
};

export default useBackHandler;
