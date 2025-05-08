import { IMAGE_URIS } from '@/constants/imageLinks';
import fontSizes from '@/style/fontSizes';
import spacingStyles from '@/style/spacingStyles';
import staticColors from '@/style/staticColors';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EmptyShoppingBagMessage: React.FC = () => {
  return (
    <View style={styles.content}>
      <Image
        source={{
          uri:IMAGE_URIS.EMPTYBAGIMAGE
        }}
        style={styles.bagImage}
      />
      
      <Text style={styles.mainText}>Hey, it feels so light!</Text>
      <Text style={styles.subText}>
        There is nothing in your bag. Let's add some items.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagImage: {
    width: 150,
    height: 150,
  ...spacingStyles.mb15
  },
  mainText: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: staticColors.textSubtitle,
    textAlign: 'center',
  },
  subText: {
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
    textAlign: 'center',
  },
});

export default EmptyShoppingBagMessage;