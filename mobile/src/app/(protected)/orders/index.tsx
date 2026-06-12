import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import { api } from "@/api/axios";
import { router } from "expo-router";

type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "shipped":
        return "blue";
      case "delivered":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(`/(protected)/orders/${item.id}` as any)
            }
          >
            <Text style={styles.id}>
              Order #{item.id.slice(0, 6)}
            </Text>

            <Text style={styles.total}>
              ${item.total_amount}
            </Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.badgeText}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 12,
  },

  id: {
    fontWeight: "600",
    fontSize: 16,
  },

  total: {
    marginTop: 5,
    color: "green",
    fontWeight: "600",
  },

  badge: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
});