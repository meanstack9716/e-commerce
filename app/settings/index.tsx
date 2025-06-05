import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { router } from "expo-router";

export default function SettingPage() {
  return (
    <SafeAreaViewWrapper>
      <View style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal</Text>

          <TouchableOpacity style={styles.item} onPress={() => router.navigate('/accountManage')}>
            <Text style={styles.itemText}>Profile</Text>
            <FontAwesome name="chevron-right" size={14} color="black" />
          </TouchableOpacity>

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Shipping Address</Text>
            <FontAwesome name="chevron-right" size={14} color="black" />
          </TouchableOpacity>

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Payment methods</Text>
            <FontAwesome name="chevron-right" size={14} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop</Text>

          <View style={styles.item}>
            <Text style={styles.itemText}>Order</Text>
            <FontAwesome name="chevron-right" size={14} color="black" />
          </View>

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Terms and Conditions</Text>
            <FontAwesome name="chevron-right" size={14} color="black" />
          </TouchableOpacity>
        </View>
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
    fontWeight: 'bold',
    ...spacingStyles.mb25,
    color: staticColors.black,
  },
  section: {
    ...spacingStyles.mb25
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mb20,
    color: staticColors.black,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...spacingStyles.py10
  },
  itemText: {
    fontSize: fontSizes.base,
    color: staticColors.black,
  },
  itemValue: {
    fontSize: fontSizes.base,
    color: staticColors.black,
  },
  spacer: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
});