import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth/authSlice";

export default function SettingPage() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

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
        { label: "Terms and Conditions", route: null },
        { label: "Logout", isLogout: true },
      ],
    },
  ];

  return (
    <SafeAreaViewWrapper>
      <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        {settingsData.map((section, sectionIndex) => (
          <View style={styles.section} key={sectionIndex}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    if (item.isLogout) {
                      handleLogout();
                    } else if (item.route) {
                      router.push(item.route);
                    }
                  }}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                  <FontAwesome name="chevron-right" size={14} color="black" />
                </TouchableOpacity>

                {itemIndex !== section.items.length - 1 && (
                  <View style={styles.spacer} />
                )}
              </View>
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
  header: {
    fontSize: fontSizes.xl,
    fontWeight: "bold",
    ...spacingStyles.mb25,
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
    ...spacingStyles.py10,
  },
  itemText: {
    fontSize: fontSizes.base,
    color: staticColors.black,
  },
  spacer: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
});
