import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "@/api/axios";
import { useCartStore } from "@/store/cart.store";
export default function Cart() {
  const items = useCartStore((s) => s.items);
  const increase = useCartStore((s) => s.increaseQuantity);
  const decrease = useCartStore((s) => s.decreaseQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        Alert.alert("Cart is empty");
        return;
      }

      const payload = {
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      await api.post("/orders", payload);

      Alert.alert("Success 🎉", "Order placed successfully");

      clearCart();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Checkout failed");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image source={{ uri: item.image_url }} style={styles.img} />

                <View style={{ flex: 1 }}>
                  <Text>{item.name}</Text>
                  <Text>${item.price}</Text>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity onPress={() => decrease(item.id)}>
                      <Text style={styles.btn}>-</Text>
                    </TouchableOpacity>

                    <Text>{item.quantity}</Text>

                    <TouchableOpacity onPress={() => increase(item.id)}>
                      <Text style={styles.btn}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Total: ${subtotal.toFixed(2)}</Text>

            <TouchableOpacity style={styles.checkout} onPress={handleCheckout}>
              <Text style={{ color: "#fff" }}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Cart is empty</Text>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    marginTop: "50%",
    fontSize: 18,
    color: "#999",
  },
  container: {
    flex: 1,
    padding: 16,
  },

  item: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },

  img: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },

  btn: {
    fontSize: 20,
    paddingHorizontal: 10,
    backgroundColor: "#ddd",
    borderRadius: 6,
  },

  footer: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  checkout: {
    backgroundColor: "black",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
});
