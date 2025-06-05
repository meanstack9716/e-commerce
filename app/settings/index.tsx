import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth/authSlice";
import { useCallback } from "react";

export default function SettingPage() {
  const dispatch = useDispatch();

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
        { label: "Profile", route: "/accountManage" },
        { label: "Shipping Address", route: null },
        { label: "Payment methods", route: null },
      ],
    },
    {
      title: "Shop",
      items: [
        { label: "Order", route: null },
        { label: "Faq", route: "/faq" },
        { label: "About Us", route: null },
        { label: "Terms and Use", route: null },
        { label: "Privacy Policy", route: null },
        { label: "Logout", isLogout: true },
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
    <SafeAreaViewWrapper>
      <View style={styles.container}>
        <View style={styles.headerContain}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons
              name="arrow-back"
              size={20}
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
    ...spacingStyles.px5,
    backgroundColor: staticColors.white,
  },
  headerContain: {
    flexDirection: 'row',
    alignItems: 'center',
    ...spacingStyles.mb25,
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
    ...spacingStyles.mb25,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mb20,
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
