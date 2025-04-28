import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '@/style/staticColors';
import textStyles from '@/style/textStyles';
import spacingStyles from '@/style/spacingStyles';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: React.ReactNode;
  children: React.ReactNode;
};

export default function Collapsible({ title, children }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand}>
        <Text>{title}</Text>
        <View style={styles.iconContainer}>
          <AntDesign
            name={expanded ? 'up' : 'down'}
            size={16}
            color={colors.lightColor}
          />
        </View>
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.mb15,
    borderBottomWidth: 1,
    borderColor: colors.lightColor,
    ...spacingStyles.pb10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
 
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 20, 
  },
  content: {
    ...spacingStyles.pt10
  },
});
