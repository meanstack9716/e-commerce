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
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootState } from "@/store/store";
import FAQs from "@/components/profile/FAQs";
import AboutUs from "@/components/profile/AboutUs";
import TermsOfUs from "@/components/profile/TermsOfUs";
import PrivacyPolicy from "@/components/profile/PrivacyPolicy";
import Grievance from "@/components/profile/Grievance";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FooterLinks from "@/components/profile/FooterLinks";
import ProfileListSection from "@/components/profile/ProfileListSection";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import {fontSizes, fontWeights} from "@/style/typography";
import { APP_VERSION } from "@/constants/constants";
import staticColors from "@/style/staticColors";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/store/auth/authSlice";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import UserProfile from "@/components/profile/UserProfile";

export default function ProfileScreen() {
  const [activeProfileSection, setActiveProfileSection] = useState("Profile");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    const backButtonListener = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (activeProfileSection !== "Profile") {
          setActiveProfileSection("Profile");
          return true;
        }
        return false;
      }
    );

    return () => {
      backButtonListener.remove();
    };
  }, [activeProfileSection]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getSelectedProfileSectionContent = () => {
    const sectionComponents: { [key: string]: React.ReactNode } = {
      Profile: (
        <>
          {isAuthenticated ? <UserProfile /> : <ProfileListSection />}
          {/* <FooterLinks onLinkPress={(link) => setActiveProfileSection(link)} />
          {isAuthenticated && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )} */}
          {/* <View style={styles.optionsContainer}>
            <Text style={styles.versionText}>APP VERSION {APP_VERSION}</Text>
          </View> */}
        </>
      ),
      FAQs: <FAQs />,
      "ABOUT US": <AboutUs />,
      "TERMS OF USE": <TermsOfUs />,
      "PRIVACY POLICY": <PrivacyPolicy />,
      "GRIEVANCE REDRESSAL": <Grievance />,
    };

    return sectionComponents[activeProfileSection] || <ProfileHeader />;
  };

  return (
    <View style={[styles.container]}>
      {/* <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (activeProfileSection !== "Profile") {
              setActiveProfileSection("Profile");
            } else {
              router.back();
            }
          }}
        >
          <AntDesign name="arrowleft" size={18} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{activeProfileSection}</Text>
      </View> */}

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
    fontWeight: fontWeights.bold,
    color: colors.primary,
    fontFamily:fontFamilies.arial,
  },
  container: {
    flex: 1,
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
  logoutButton: {
    borderWidth: 1,
    borderColor: staticColors.primary,
    ...spacingStyles.py10,
    ...spacingStyles.mx15,
    marginVertical: 10,
    borderRadius: borderRadius.r8,
    alignItems: "center",
  },
  logoutText: {
    fontSize: fontSizes.base,
    color: colors.primary,
    fontWeight: fontWeights.semiBold,
  },
});
