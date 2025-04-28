import CartItem from "@/components/cart/CartItem";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Image,
  Pressable,
} from "react-native";
const cartItems = [
  {
    id: "1",
    title: "Black Leather Jacket",
    size: "XL",
    price: 83.97,
    image: {
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSyRRIVWSL4QuEhb2u6a-0lzXgrSzJ3aAnpw&s",
    },
    quantity: 1,
  },
  {
    id: "2",
    title: "Flared High-Rise jeans",
    size: "M",
    price: 124,
    image: {
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUljjiDjJ5OtWjV7urp8NCsYOyCXo6z5PZhQ&s",
    },
    quantity: 1,
  },
  {
    id: "3",
    title: "Women's Party Mojaris",
    size: "XL",
    price: 129,
    image: {
      uri: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSE8fZhrUbU3YEvEFGi1j1GoLw05pzN6NSEUa5F1NhsVopNyRjhHEtlAN_iNwGB5pVP9-wSDTM67GXqzwK9tqW1Uf2hYVFvBAjysPN5sewV",
    },
    quantity: 1,
  },
  {
    id: "4",
    title: "Red Georgette Saree",
    size: "SM",
    price: 140,
    image: {
      uri: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTBWrzO7CE2er50L1EXr5o9USv4bO1c7OVd3R8bTpeP_z5SN7_ufgNx67LV7sg8MUL-fzW_JGH60px5y-Uiucn00vIfeiBt4AUWAPgzqSo",
    },
    quantity: 1,
  },
  {
    id: "5",
    title: "Solid Georgette Saree",
    size: "XLL",
    price: 190,
    image: {
      uri: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTrunehSuY_MI-q0IdeShXwcaToXVVwl2qy_RzCgRUqcjFS-ABJ_Sjkt8BSx5WI9hx1U5EZFZvT-RRkS4OJD53kpYu6-bB6CbdDonTgLIPs8pLfXbn9uR9r",
    },
    quantity: 1,
  },
  {
    id: "6",
    title: "Kashvi Alluring Women Lehenga",
    size: "XL",
    price: 110,
    image: {
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScIxr4OeDtm5xDBpIURCDJc440kEbSC2uXTA&s",
    },
    quantity: 1,
  },
  {
    id: "7",
    title: "Gown with attached dupatta ",
    size: "L",
    price: 190,
    image: {
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMyNKSYYFe0zUfIrjDY1NFfGHISrUn4h1hjQ&s",
    },
    quantity: 1,
  },
  {
    id: "8",
    title: "Black Chiffon Dress with Embroidery Yoke",
    size: "M",
    price: 90,
    image: {
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHjml9iU6SIoq1nvaBb66VglGs-4zG-wfV2w&s",
    },
    quantity: 1,
  },
  {
    id: "9",
    title: "A-line kurta set",
    size: "xl",
    price: 80,
    image: {
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKLwW-mxhMza3P7Jx7AjuwhPMfSllYOYDRtQ&s",
    },
    quantity: 1,
  },
  {
    id: "10",
    title: "Peach Cotton Ethnic Motif",
    size: "M",
    price: 70,
    image: {
      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqlksgpECthiiePEDR-GM3Q5u5mF7McUprYA&s",
    },
    quantity: 1,
  },
];
type CartItemType = {
  id: string;
  title: string;
  size: string;
  price: number;
  image: { uri: string };
  quantity: number;
};
const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItemType[]>(cartItems);
  const [selectedItem, setSelectedItem] = useState<CartItemType | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const handleDeletePress = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setSelectedItem(item);
      setModalVisible(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setModalVisible(false);
      setSelectedItem(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Cart</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem {...item} onDelete={(id) => handleDeletePress(id)} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.header}>Remove From Cart</Text>
            {selectedItem && (
              <>
                <Image
                  source={{ uri: selectedItem.image.uri }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.modalPrice}>{selectedItem.size}</Text>
                  <Text style={styles.modalPrice}>${selectedItem.price}</Text>
                </View>

                <View style={styles.modalButtonContainer}>
                  <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.removeButton]}
                    onPress={handleConfirmDelete}
                  >
                    <Text style={styles.removeText}>Yes, Remove</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor:colors.whiteColor,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    ...spacingStyles.mb20,
    textAlign: "center",
    fontFamily: "HelveticaBold",
    borderBottomWidth: 1,
    borderColor: colors.lightColor,
    borderStyle: "dotted",
    color:colors.primaryColor
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: colors.whiteColor,
    ...spacingStyles.p20,
    alignItems: "center",
    elevation: 10,
    marginTop: "auto",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    ...spacingStyles.mb10
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    ...spacingStyles.mb10
  },
  itemInfo: {
    ...spacingStyles.mb20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  modalPrice: {
    fontSize: 16,
    color: colors.primaryColor,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    ...spacingStyles.mx5,
    alignItems: "center",
  },
  cancelButton: {
    borderColor:colors.primaryColor,
    borderWidth:1,
  },
  removeButton: {
    backgroundColor: colors.primaryColor,
  },
  cancelText:{
    color:colors.primaryColor,
    fontFamily:'Helvetica',
  },
  removeText:{
    color:colors.whiteColor,
    fontFamily:'Helvetica',
  }

});
