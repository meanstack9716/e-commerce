import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth/authSlice";
import { useCallback } from "react";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { useAppDispatch } from "@/store/hooks";

export default function SettingPage() {
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    router.push("/");
  }, [dispatch]);

  const handleGoBack = useCallback(() => {
    router.back();
    return true;
  }, []);

  const settingsData = [
    {
      title: "Personal",
      items: [
        { label: "Profile", route: "userManageAccount" },
        { label: "Referal Code", route: "ReferAndEarnScreen" },
        { label: "Reward & Point", route: "RewardAndPonit" },
        { label: "Payment methods", route: null },
      ],
    },
    {
      title: "Shop",
      items: [
        { label: "Order", route: "/orderHistory" },
        { label: "Faq", route: 'faq' },
        // { label: "About Us", route: null },
        // { label: "Terms and Use", route: null },
        // { label: "Privacy Policy", route: null },
        { label: "Logout", isLogout: true },
        { label: "Change BaseURL", route: "/BaseURL" },
      ],
    },
  ];

  const SettingItem = ({ item }: { item: any }) => (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          if (item.isLogout) handleLogout();
          else if (item.route) router.push(item.route);
        }}
        accessible
        accessibilityLabel={item.label}
      >
        <Text style={styles.itemText}>{item.label}</Text>
        <FontAwesome name="chevron-right" size={14} color="black" />
      </TouchableOpacity>
      <View style={styles.spacer} />
    </>
  );

  return (
    <SafeAreaViewWrapper >
      <View style={styles.container}>
        <View style={styles.headerContain}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Settings</Text>
        </View>

        {settingsData.map((section, sectionIndex) => (
          <View style={styles.section} key={sectionIndex}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <SettingItem item={item} key={itemIndex} />
            ))}
          </View>
        ))}
      </View>
    </SafeAreaViewWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...spacingStyles.px15,
    backgroundColor: staticColors.white,
  },
  headerContain: {
    flexDirection: 'row',
    alignItems: 'center',
    ...spacingStyles.mb20,
  },
  backButton: {
    ...spacingStyles.mr15
  },
  header: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: staticColors.black,
  },
  section: {
    ...spacingStyles.mb20,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mb10,
    color: staticColors.black,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.py15,
  },
  itemText: {
    fontSize: fontSizes.base,
    color: staticColors.black,
  },
  spacer: {
    height: 1,
    backgroundColor: staticColors.lightGray || "#eee",
    marginVertical: 4,
  },
});
