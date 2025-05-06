import spacingStyles from '@/style/spacingStyles';
import staticColors from '@/style/staticColors';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function BrandRating() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Brand Rating</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>4.1 ★</Text>
        <Text style={styles.ratingDetails}>
          118.4K Ratings* | 116.2K items sold last year
        </Text>
      </View>
      <Text style={styles.note}>
        *Based on ratings of the products sold by the brand.
      </Text>

      <Text style={styles.sectionHeader}>MORE INFORMATION</Text>

      <Text style={styles.subHeader}>Product Code: 32361470</Text>

      <TouchableOpacity onPress={toggleExpanded} style={styles.viewMoreButton}>
        <Text style={styles.viewMoreText}>
          {isExpanded ? 'View Less' : 'View More'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <>
          <Text style={styles.subHeader}>Manufacturer Detail</Text>
          <Text style={styles.detail}>
            RADHAMANI TEXTILES PVT. LTD., NO. 27, VTMS ARCADE, YELENKUNTE,
            MANGAMMANAPALYA, Hosur main Road, Bengaluru-560068
          </Text>

          <Text style={styles.subHeader}>Packer Detail</Text>
          <Text style={styles.detail}>
            RADHAMANI TEXTILES PVT. LTD., NO. 27, VTMS ARCADE, YELENKUNTE,
            MANGAMMANAPALYA, Hosur main Road, Bengaluru-560068
          </Text>

          <Text style={styles.subHeader}>Country of Origin</Text>
          <Text style={styles.detail}>India</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px15,
    ...spacingStyles.py15
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    ...spacingStyles.py5,
    color: staticColors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  ...spacingStyles.mb5
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    ...spacingStyles.mr10
  },
  ratingDetails: {
    fontSize: 13,
    color: staticColors.cardTitleColor
  },
  note: {
    fontSize: 12,
    color: staticColors.shadowColor,
    ...spacingStyles.mb20
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 13,
    fontWeight: 'bold',
...spacingStyles.mb5,
    color:staticColors.shadowColor
  },
  detail: {
    fontSize: 14,
    color: staticColors.shadowColor,
    
  },
  viewMoreButton: {
  ...spacingStyles.pb5
  },
  viewMoreText: {
    fontSize: 14,
    color: staticColors.offerColor,
    fontWeight: 'bold',
  },
});