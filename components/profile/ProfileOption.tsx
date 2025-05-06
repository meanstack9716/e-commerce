import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/style/staticColors';
import textStyles from '@/style/textStyles';
import spacingStyles from '@/style/spacingStyles';
import fontSizes from '@/style/fontSizes';

interface Props {
  icon: ReactNode;
  label: string;
  subtitle?: string;
  customStyle?: object;
}

export default function ProfileOption({ icon, label, subtitle, customStyle }: Props) {
  return (
    <TouchableOpacity style={[styles.option, customStyle]}>
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>{icon}</View>
        <View>
          <Text style={styles.label}>{label}</Text>
          {subtitle ? <Text style={styles.subTitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={12} color="#8a8a8a" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    ...spacingStyles.p15,
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:10
  },
  iconWrapper: {
    ...spacingStyles.mb10
  },
  label: {
    color: 'black',
    fontSize: fontSizes.sm,
    fontFamily:'helveticaRoundedBold'
  },
  subTitle:{
    ...textStyles.subtitle,
    fontSize:fontSizes.sm
  }
});
