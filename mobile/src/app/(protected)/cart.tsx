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
        Alert.alert("Cart is empty", "Add some products to your cart first.");
        return;
      }

      const payload = {
        items: items.map((i) => ({
          productId: i.id,
          quantity: i.quantity,
        })),
      };

      await api.post("/orders", payload);

      Alert.alert("Success 🎉", "Your order has been placed successfully!");
      clearCart();
    } catch (err: any) {
      Alert.alert("Checkout Failed", err?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>My Cart 🛒</Text>
        <Text style={styles.headerSubtitle}>
          {items.length} {items.length === 1 ? "item" : "items"} in cart
        </Text>
      </View>

      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <Image source={{ uri: item.image_url }} style={styles.img} />

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>${item.price}</Text>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      onPress={() => decrease(item.id)}
                      style={styles.qtyBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => increase(item.id)}
                      style={styles.qtyBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Total Amount</Text>
              <Text style={styles.subtotalValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkout}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Explore products and add items to your cart</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },

  brandTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  img: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: "#0f172a",
  },

  itemInfo: {
    flex: 1,
    marginLeft: 14,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f8fafc",
  },

  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 2,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },

  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f8fafc",
  },

  qtyText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#f8fafc",
  },

  itemTotal: {
    fontSize: 16,
    fontWeight: "900",
    color: "#10b981",
    marginLeft: 8,
  },

  footer: {
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  subtotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#94a3b8",
  },

  subtotalValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#10b981",
  },

  checkout: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  checkoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
});


