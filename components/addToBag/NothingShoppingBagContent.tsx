import spacingStyles from '@/style/spacingStyles';
import staticColors from '@/style/staticColors';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const NothingShoppingBagContent: React.FC = () => {
  return (
    <View style={styles.content}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/256/2374/2374718.png',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: staticColors.cardTitleColor,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: staticColors.lightGray,
    textAlign: 'center',
  },
});

export default NothingShoppingBagContent;