import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/api/axios";

type OrderItem = {
  id: string;
  quantity: number;
  unit_price: number;
  product: {
    id: string;
    name: string;
    image_url: string;
  };
};

type Order = {
  id: string;
  status: string;
  total_amount: number;
  order_items: OrderItem[];
};

export default function OrderDetails() {
  const { id } = useLocalSearchParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.notFoundText}>Order not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.title}>Order Summary</Text>
          <Text style={styles.orderId}>#{order.id}</Text>
        </View>

        <View style={styles.statusChip}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Ordered Items</Text>

      <FlatList
        data={order.order_items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image
              source={{ uri: item.product?.image_url }}
              style={styles.img}
            />

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product?.name}
              </Text>
              <Text style={styles.itemQty}>
                Qty: {item.quantity} × ${item.unit_price}
              </Text>
            </View>

            <Text style={styles.itemTotal}>
              ${(item.quantity * item.unit_price).toFixed(2)}
            </Text>
          </View>
        )}
      />

      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>${order.total_amount}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },

  notFoundText: {
    fontSize: 16,
    color: "#94a3b8",
  },

  cardHeader: {
    backgroundColor: "#1e293b",
    padding: 20,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f8fafc",
  },

  orderId: {
    fontSize: 12,
    color: "#94a3b8",
    fontFamily: "monospace",
    marginTop: 2,
  },

  statusChip: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.3)",
  },

  statusText: {
    color: "#818cf8",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f8fafc",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  listContainer: {
    paddingHorizontal: 20,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },

  img: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#0f172a",
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f8fafc",
  },

  itemQty: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#10b981",
    marginLeft: 8,
  },

  totalBar: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f8fafc",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#10b981",
  },
});
