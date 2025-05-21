import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView, 
  Text
} from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import colors from '@/style/staticColors';
import spacingStyles from '@/style/spacingStyles';
import staticColors from '@/style/staticColors';
import {fontSizes, fontWeights} from "@/style/typography";
import borderRadius from '@/style/borderRadius';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 40;

interface SlideItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  price: string;
  brands?: string[];
}

interface ImageSliderProps {
  slides: SlideItem[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.floor(offset / SLIDER_WIDTH + 0.5); 
    setActiveIndex(activeIndex);
  };

  const goToSlide = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: SLIDER_WIDTH * index, animated: true });
    }
  };

  const nextSlide = () => {
    if (activeIndex < slides.length - 1) {
      goToSlide(activeIndex + 1);
    } else {
      goToSlide(0); 
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={SLIDER_WIDTH}
          snapToAlignment="center"
          contentContainerStyle={styles.scrollViewContent}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={styles.slide}>
              <Image source={{ uri: slide.imageUrl }} style={styles.image} />
              <View style={styles.textOverlay}>
                {slide.brands && (
                  <View style={styles.brandContainer}>
                    {slide.brands.map((brand, idx) => (
                      <View key={idx} style={styles.brandBadge}>
                        <Text style={styles.brandText}>{brand}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
                <Text style={styles.price}>{slide.price}</Text>
              </View>
              <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
                <FontAwesome6 name="chevron-right" size={16} color={staticColors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.paginationDot, 
              activeIndex === index ? styles.paginationDotActive : null
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.my15,
    width: '100%',
    alignItems: 'center',
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    overflow: 'hidden', 
  },
  scrollViewContent: {

  },
  slide: {
    width: SLIDER_WIDTH,
    height: 220,
    borderRadius: borderRadius.r16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    ...spacingStyles.p15,
    width: '100%',
  },
  brandContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  brandBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    ...spacingStyles.py5,
   ...spacingStyles.px10,
    borderRadius: borderRadius.r5,
    marginRight: 6,
  },
  brandText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  price: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    ...spacingStyles.mt10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.r4,
    backgroundColor:staticColors.lightGray,
    ...spacingStyles.mx2
  },
  paginationDotActive: {
    backgroundColor: staticColors.textLightGray,
  },
  nextButton: {
    position: 'absolute',
    right: 10,
    bottom: '8%',
    width: 30,
    height: 30,
    borderRadius: borderRadius.r16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageSlider;