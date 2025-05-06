import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";

interface OfferDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  offerPrice: string;
  extraDiscount: string;
}

const { height: screenHeight } = Dimensions.get("window");

const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({
  visible,
  onClose,
  offerPrice,
  extraDiscount,
}) => {
  const [showMoreOffers, setShowMoreOffers] = useState(false);
  const [showCouponDetails, setShowCouponDetails] = useState(false);
  const [showFederalDetails, setShowFederalDetails] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const offerDetails = [
    {
      text: "Applicable only on Myntra FWD offer Products",
      showTnc: true,
    },
    {
      text: "Get 10% Instant Discount",
    },
    {
      text: "Offer eligible on orders of ₹850 and above",
    },
    {
      text: "Maximum Discount of ₹350 during the offer period",
    },
    {
      text: "Enter your IDFC FIRST SWYP Credit Card Details or Select your saved IDFC FIRST SWYP Credit Card in the payment page",
    },
    {
      text: "Discount will be auto-applied in the payment page once the card eligibility is verified",
    },
    {
      text: "Offer Period: 00:00 hrs 1st April'2025 to 23:59 hrs 30th April'2025",
    },
  ];

  const toggleMoreOffers = () => {
    setShowMoreOffers((prevState) => {
      const newState = !prevState;
      if (newState && scrollViewRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
      return newState;
    });
  };
  const toggleCouponDetails = () =>
    setShowCouponDetails((prevState) => !prevState);
  const toggleFederalDetails = () =>
    setShowFederalDetails((prevState) => !prevState);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Image
                  source={require("@/assets/images/images/mega-deal.png")}
                  style={styles.headerImage}
                  resizeMode="contain"
                />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.modalTitle}>Get at ₹{offerPrice}</Text>
                <Text style={styles.modalSubtitle}>
                  Extra ₹{extraDiscount} Off
                </Text>
              </View>

              <Text style={styles.modalDescription}>
                Combine coupons & offers to get maximum discount
              </Text>

              <ScrollView
                style={styles.offersContainer}
                contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
              >
                {/* Coupon Section */}
                <View style={styles.offerSection}>
                  <View style={styles.offerHeader}>
                    <Text style={styles.offerLabel}>Coupon MYNTRASAVE</Text>
                    <Text style={styles.offerValue}>₹58 off</Text>
                  </View>
                  <Text style={styles.offerDetails}>On orders above ₹900</Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={toggleCouponDetails}
                  >
                    <View style={styles.detailsButton}>
                      <Text style={styles.detailsButtonText}>Details</Text>
                      <MaterialIcons
                        name={
                          showCouponDetails
                            ? "keyboard-arrow-up"
                            : "keyboard-arrow-down"
                        }
                        size={18}
                        color={staticColors.discountText}
                      />
                    </View>
                  </TouchableOpacity>
                  {showCouponDetails && (
                    <View style={styles.expandedDetails}>
                      <Text style={styles.detailPoint}>
                        • Valid only on first purchase
                      </Text>
                      <Text style={styles.detailPoint}>
                        • Maximum discount ₹100
                      </Text>
                    </View>
                  )}
                </View>

                {/* Federal Bank Offer */}
                <View style={styles.offerSection}>
                  <View style={styles.offerHeader}>
                    <View style={styles.bankRow}>
                      <Text style={styles.bankIconPlaceholder}>
                        <MaterialCommunityIcons
                          name="bank"
                          size={22}
                          color="black"
                        />
                      </Text>
                      <Text style={styles.offerLabel}>Federal Bank</Text>
                    </View>
                    <Text style={styles.offerValue}>₹32 off</Text>
                  </View>
                  <Text style={styles.offerDetails}>10% Instant Discount</Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={toggleFederalDetails}
                  >
                    <View style={styles.detailsButton}>
                      <Text style={styles.detailsButtonText}>Details</Text>
                      <MaterialIcons
                        name={
                          showFederalDetails
                            ? "keyboard-arrow-up"
                            : "keyboard-arrow-down"
                        }
                        size={18}
                        color={staticColors.discountText}
                      />
                    </View>
                  </TouchableOpacity>
                  {showFederalDetails && (
                    <View style={styles.expandedDetails}>
                      <Text style={styles.detailPoint}>
                        • Applicable on all products
                      </Text>
                      <Text style={styles.detailPoint}>
                        • Minimum order ₹500
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.moreOffersSection,
                    !showMoreOffers && styles.collapsedSection,
                  ]}
                >
                  <View style={styles.moreOffersHeader}>
                    <View style={styles.offerIconRow}>
                      <View style={styles.offerIcon}>
                        <Text>⚙️</Text>
                      </View>
                      <Text style={styles.moreOffersText}>
                        More Offers Available
                      </Text>
                    </View>
                    <TouchableOpacity onPress={toggleMoreOffers}>
                      <View style={styles.viewLessRow}>
                        <Text style={styles.viewLessText}>
                          {showMoreOffers ? "View Less" : "View All"}
                        </Text>
                        <MaterialIcons
                          name={
                            showMoreOffers
                              ? "keyboard-arrow-up"
                              : "keyboard-arrow-down"
                          }
                          size={18}
                          color={staticColors.discountText}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {showMoreOffers && (
                    <>
                      <View style={styles.cardOfferSection}>
                        <View style={styles.bankRow}>
                          <Text style={styles.bankIconPlaceholder}>🏛️</Text>
                          <Text style={styles.cardName}>
                            IDFC FIRST SWYP Credit Card
                          </Text>
                        </View>
                        <View style={styles.cardOfferDetails}>
                          {offerDetails.map((item, index) => (
                            <View key={index} style={styles.bulletItem}>
                              <Text style={styles.bulletPoint}>•</Text>
                              <Text style={styles.bulletText}>
                                {item.text}
                                {item.showTnc && (
                                  <Text style={styles.tandcText}> T&C</Text>
                                )}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.cardOfferSection}>
                        <View style={styles.bankRow}>
                          <Text style={styles.bankIconPlaceholder}>
                            <MaterialCommunityIcons
                              name="bank"
                              size={22}
                              color="black"
                            />
                          </Text>
                          <Text style={styles.cardName}>
                            HDFC Bank Credit Card EMI
                          </Text>
                        </View>
                        <View style={styles.cardOfferDetails}>
                          {offerDetails.map((item, index) => (
                            <View key={index} style={styles.bulletItem}>
                              <Text style={styles.bulletPoint}>•</Text>
                              <Text style={styles.bulletText}>
                                {item.text}
                                {item.showTnc && (
                                  <Text style={styles.tandcText}> T&C</Text>
                                )}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.cardOfferSection}>
                        <View style={styles.bankRow}>
                          <Text style={styles.bankIconPlaceholder}>
                            <MaterialCommunityIcons
                              name="bank"
                              size={22}
                              color="black"
                            />
                          </Text>
                          <Text style={styles.cardName}>HSBC</Text>
                        </View>
                        <View style={styles.cardOfferDetails}>
                          {offerDetails.map((item, index) => (
                            <View key={index} style={styles.bulletItem}>
                              <Text style={styles.bulletPoint}>•</Text>
                              <Text style={styles.bulletText}>
                                {item.text}
                                {item.showTnc && (
                                  <Text style={styles.tandcText}> T&C</Text>
                                )}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.cardOfferSection}>
                        <View style={styles.bankRow}>
                          <Text style={styles.bankIconPlaceholder}>
                            <MaterialCommunityIcons
                              name="bank"
                              size={22}
                              color="black"
                            />
                          </Text>
                          <Text style={styles.cardName}>
                            Innovative Kotak credit Card
                          </Text>
                        </View>
                        <View style={styles.cardOfferDetails}>
                          {offerDetails.map((item, index) => (
                            <View key={index} style={styles.bulletItem}>
                              <Text style={styles.bulletPoint}>•</Text>
                              <Text style={styles.bulletText}>
                                {item.text}
                                {item.showTnc && (
                                  <Text style={styles.tandcText}> T&C</Text>
                                )}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </>
                  )}
                </View>
                <Text style={styles.modalText}>
                  Final price may change based on the items in your bag
                </Text>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: staticColors.modalOverlayLight,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: staticColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...spacingStyles.p15,
    maxHeight: screenHeight * 0.45,
    flexGrow: 1,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    right: 5,
    top: 8,
  },
  headerImage: {
    width: 75,
    height: 75,
    marginTop: -40,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...spacingStyles.pt10,
    gap: 15,
  },
  modalTitle: {
    fontSize: fontSizes['lg'],
    fontWeight: "bold",
    color: staticColors.darkGray,
  },
  modalSubtitle: {
    backgroundColor: staticColors.darkGreen,
    ...spacingStyles.px10,
    ...spacingStyles.py5,
    borderRadius: 10,
    color: staticColors.white,
  },
  modalDescription: {
    fontSize: fontSizes.sm,
    ...spacingStyles.p5,
    textAlign: "center",
    color: staticColors.textLightGray,
  },
  offersContainer: {
    flex: 1,
  },
  offerSection: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 10,
    ...spacingStyles.mx10,
    ...spacingStyles.mb10,
    ...spacingStyles.p10,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerLabel: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: staticColors.darkGray,
  },
  offerValue: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: staticColors.darkGreen,
  },
  offerDetails: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
  },
  detailsButton: {
    alignSelf: "flex-start",
    ...spacingStyles.mt2,
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: fontSizes.sm,
    color: staticColors.discountText,
    fontWeight: "600",
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankIconPlaceholder: {
    fontSize: fontSizes.md,
    marginRight: 8,
  },
  moreOffersSection: {
    ...spacingStyles.mx10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: staticColors.lightGray,
  },
  collapsedSection: {
    marginBottom: 0,
  },
  moreOffersHeader: {
    backgroundColor: staticColors.lightGreen,
    borderRadius: 10,
    ...spacingStyles.p10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  offerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: staticColors.white,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mr5,
  },
  moreOffersText: {
    fontSize: fontSizes.base,
    fontWeight: "600",
    color: staticColors.darkGray,
  },
  viewLessText: {
    fontSize: fontSizes.sm,
    color: staticColors.discountText,
    fontWeight: "600",
  },

  viewLessRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardOfferSection: {
    backgroundColor: staticColors.white,
    borderRadius: 10,
    ...spacingStyles.p10,
  },
  cardName: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
    color: staticColors.darkGray,
  },
  cardOfferDetails: {
    borderBottomColor: staticColors.lightGray,
    borderStyle: "dotted",
    borderBottomWidth: 1,
  },
  bulletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bulletPoint: {
    fontSize: fontSizes.sm,
    ...spacingStyles.mx5,
    color: staticColors.shadowColor,
  },
  bulletText: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
    flex: 1,
  },
  tandcText: {
    fontSize: fontSizes.sm,
    color: staticColors.discountText,
    ...spacingStyles.ml10,
  },
  expandedDetails: {
    ...spacingStyles.mt10,
  },
  detailPoint: {
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
  },
  modalText: {
    fontSize: fontSizes.xs,
    textAlign: "center",
    ...spacingStyles.mt10,
    ...spacingStyles.pt2,
    borderTopWidth: 1,
    borderStyle: "dotted",
    borderTopColor: staticColors.borderLight,
    color: staticColors.textSecondary,
  },
});

export default OfferDetailsModal;
