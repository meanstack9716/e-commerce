import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { fontSizes, fontWeights } from '@/style/typography';
import staticColors from '@/style/staticColors';
import borderRadius from '@/style/borderRadius';
import spacingStyles from '@/style/spacingStyles';
import { CartItemsListProps } from './cardItem.types';

const CartItemsList: React.FC<CartItemsListProps> = ({ cartItems }) => {
    return (
        <View>
            <Text style={styles.sectionTitle}>ITEMS ({cartItems.length})</Text>
            {cartItems.map((item, index) => (
                <View key={item.productId + index} style={styles.itemContainer}>
                    <View style={styles.leftSection}>
                        <View style={styles.imageShadowWrapper}>
                            <View style={styles.imageWrapper}>
                                <Image
                                    source={{ uri: item.images[0] }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>
                    <View style={styles.rightSection}>
                        <Text style={styles.itemPrice}>₹{item.final_price}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semiBold,
        color: staticColors.darkGray,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    imageShadowWrapper: {
        width: 60,
        height: 60,
        backgroundColor: staticColors.white,
        borderRadius: borderRadius.circle,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: staticColors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        ...spacingStyles.mr10,
    },
    imageWrapper: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.circle,
        overflow: "hidden",
    },
    itemImage: {
        width: "100%",
        height: "100%",
    },
    itemTitle: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semiBold,
        flexShrink: 1,
        flexWrap: "wrap",
    },
    rightSection: {
        justifyContent: "center",
        alignItems: "flex-end",
    },
    itemPrice: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semiBold,
    },
});

export default CartItemsList;