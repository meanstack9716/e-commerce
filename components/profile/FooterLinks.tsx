import colors from '@/style/staticColors';
import spacingStyles from '@/style/spacingStyles';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type FooterLinksProps = {
  onLinkPress: (label: string) => void;
};

const links = ['FAQs', 'ABOUT US', 'TERMS OF USE', 'PRIVACY POLICY', 'GRIEVANCE REDRESSAL'];

export default function FooterLinks({ onLinkPress }: FooterLinksProps) {
  return (
    <View style={styles.container}>
      {links.map((link, index) => (
        <TouchableOpacity key={index} onPress={() => onLinkPress(link)}>
          <Text style={styles.link}>{link}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.mt5,
    ...spacingStyles.px25,
    ...spacingStyles.pb,
  },
  link: {
    fontSize: 12,
    ...spacingStyles.p10,
    color: colors.textMuted,
    fontFamily:'HelveticaBold'
  },
});

