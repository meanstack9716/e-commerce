import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { fetchUserProfile, resetState, updateProfile } from "@/store/user/userSlice";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import gapSizes from "@/style/gapSizes";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function UserManageAccount() {
    const dispatch = useAppDispatch();
    const [initialLoad, setInitialLoad] = useState(true);

    const { loading, error, success, user } = useSelector(
        (state: RootState) => state.user
    );

    useEffect(() => {
        dispatch(resetState());
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        profile_url: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                profile_url: user.profile_url || '',
            });
        }
    }, [user]);

    useEffect(() => {
        if (success && !initialLoad) {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Profile updated successfully',
            });
            dispatch(resetState());
        }
        setInitialLoad(false);
    }, [success]);

    useEffect(() => {
        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error,
            });
            dispatch(resetState());
        }
    }, [error]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveDetails = () => {
        const { first_name, last_name, email, phone_number } = formData;
        if (
            first_name.trim() &&
            last_name.trim() &&
            email.trim() &&
            phone_number.trim()
        ) {
            dispatch(updateProfile(formData));
        } else {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please fill in all fields.',
            });
        }
    };

    const handleBack = () => {
        router.back();
    };
    return (
        <SafeAreaViewWrapper style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color={staticColors.darkGray} />
                    </TouchableOpacity>
                    <Text style={styles.heading}>Your Profile</Text>
                </View>
                <View style={styles.profileContainer}>
                    <View style={styles.outerCircle}>
                        <View style={styles.innerCircle}>
                            {user?.profile_url ? (
                                <Image
                                    source={{ uri: user.profile_url }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <Ionicons name="person" size={40} color="#005CFF" />
                            )}
                        </View>
                        <TouchableOpacity style={styles.editIcon}>
                            <Ionicons name="pencil" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={formData.first_name}
                        placeholder="First Name"
                        onChangeText={(text) => handleChange('first_name', text)}
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.last_name}
                        placeholder="Last Name"
                        onChangeText={(text) => handleChange('last_name', text)}
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        placeholder="Email"
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        value={formData.phone_number}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        onChangeText={(text) => handleChange('phone_number', text)}
                    />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveDetails}>
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaViewWrapper>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: staticColors.white,
    },
    container: {
        flex: 1,
        ...spacingStyles.py10,
        ...spacingStyles.px15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: gapSizes.lg,
        ...spacingStyles.mb25,
    },
    profileContainer: {
        ...spacingStyles.mb25
    },
    heading: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: staticColors.black,
    },
    outerCircle: {
        width: 110,
        height: 110,
        borderRadius: borderRadius.circle,
        backgroundColor: staticColors.white,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: staticColors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        position: "relative",
    },
    innerCircle: {
        width: 90,
        height: 90,
        borderRadius: borderRadius.circle,
        backgroundColor: "#E5E4FD",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 26,
        height: 26,
        borderRadius: borderRadius.r14,
        backgroundColor: "#005CFF",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: staticColors.white,
    },
    inputContainer: {
        gap: 16,
        ...spacingStyles.mb25
    },
    input: {
        backgroundColor: "#F4F6FF",
        ...spacingStyles.p15,
        borderRadius: borderRadius.r10,
        fontSize: fontSizes.base,
        fontFamily: fontFamilies.raleway,
        borderWidth: 1,
        borderColor: '#E5E4FD',
    },
    saveButton: {
        backgroundColor: "#005CFF",
        ...spacingStyles.py15,
        borderRadius: borderRadius.r12,
        alignItems: "center",
        marginTop: 'auto',
        ...spacingStyles.mb20
    },
    saveButtonText: {
        color: staticColors.white,
        fontSize: fontSizes.base,
        fontFamily: fontFamilies.ralewayBold,
    },
    errorText: {
        color: staticColors.errorColor,
        fontSize: fontSizes.md,
        ...spacingStyles.my10,
        ...spacingStyles.px20,
    },
});