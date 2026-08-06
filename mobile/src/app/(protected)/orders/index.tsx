import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "@/api/axios";
import { router, useFocusEffect } from "expo-router";

type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
      case "processing":
      case "shipped":
        return { bg: "rgba(99, 102, 241, 0.15)", text: "#818cf8", border: "rgba(129, 140, 248, 0.3)" };
      case "completed":
      case "delivered":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      default:
        return { bg: "rgba(148, 163, 184, 0.15)", text: "#94a3b8", border: "rgba(148, 163, 184, 0.3)" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>My Orders 📦</Text>
        <Text style={styles.headerSubtitle}>Track your order history & status</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const badge = getStatusBadge(item.status);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/(protected)/orders/${item.id}` as any)}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.id}>Order #{item.id.slice(0, 8)}</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: badge.bg, borderColor: badge.border },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: badge.text }]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.date}>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "Recent"}
                </Text>
                <Text style={styles.total}>${item.total_amount}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyText}>No orders placed yet</Text>
          </View>
        }
      />
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
    paddingBottom: 16,
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
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  id: {
    fontWeight: "700",
    fontSize: 15,
    color: "#f8fafc",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#334155",
  },

  date: {
    fontSize: 13,
    color: "#94a3b8",
  },

  total: {
    fontSize: 18,
    fontWeight: "900",
    color: "#10b981",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },

  emptyIcon: {
    fontSize: 52,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#94a3b8",
  },
});


