import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useState } from "react";

import {
  AntDesign
} from "@expo/vector-icons";
import FAQs from "@/components/profile/FAQs";
import AboutUs from "@/components/profile/AboutUs";
import TermsOfUs from "@/components/profile/TermsOfUs";
import PrivacyPolicy from "@/components/profile/PrivacyPolicy";
import Grievance from "@/components/profile/Grievance";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FooterLinks from "@/components/profile/FooterLinks";
import { useRouter } from "expo-router";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import fontSizes from "@/style/fontSizes";
import ProfileListSection from "@/components/profile/ProfileListSection";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import UserProfile from "@/components/profile/UserProfile";
export default function ProfileScreen() {
  const [selectedSection, setSelectedSection] = useState("Profile");
  const router = useRouter();
  const insets = useSafeAreaInsets();
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const backButtonListener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (selectedSection !== "Profile") {
          setSelectedSection("Profile");
          return true;
        }
        return false;
      }
    );

    return () => {
      backButtonListener.remove();
    };
  }, [selectedSection]);

  const getSelectedProfileSectionContent = () => {
    const sectionComponents: { [key: string]: React.ReactNode } = {
      Profile: (
        <>
          {isAuthenticated ? <ProfileListSection />  :    <UserProfile /> }
          <FooterLinks onLinkPress={(link) => setSelectedSection(link)} />
          <View style={styles.optionsContainer}>
            <Text style={styles.versionText}>APP VERSION 4.2503.21</Text>
          </View>
        </>
      ),
      FAQs: <FAQs />,
      "ABOUT US": <AboutUs />,
      "TERMS OF USE": <TermsOfUs />,
      "PRIVACY POLICY": <PrivacyPolicy />,
      "GRIEVANCE REDRESSAL": <Grievance />,
    };

    return sectionComponents[selectedSection] || <ProfileHeader />;
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (selectedSection !== "Profile") {
              setSelectedSection("Profile");
            } else {
              router.back();
            }
          }}
        >
          <AntDesign name="arrowleft" size={18} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{selectedSection}</Text>
      </View>

      <ScrollView style={styles.container}>
        {getSelectedProfileSectionContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    ...spacingStyles.mr10,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: "Arial",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  optionsContainer: {
    backgroundColor: colors.bgSecondary,
  },
  versionText: {
    fontSize: fontSizes.sm,
    textAlign: "center",
    color: colors.textSecondary,
    ...spacingStyles.py25,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.pl10,
    backgroundColor: colors.white,
    ...spacingStyles.py10,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  qrIcon: {
    ...spacingStyles.mt10,
  },
});
