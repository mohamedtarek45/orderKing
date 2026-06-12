import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
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
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!order) {
    return <Text>Order not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Order #{order.id.slice(0, 6)}
      </Text>

      <Text style={styles.status}>
        Status: {order.status}
      </Text>

      <FlatList
        data={order.order_items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.product.image_url }}
              style={styles.img}
            />

            <View style={{ flex: 1 }}>
              <Text>{item.product.name}</Text>

              <Text>
                {item.quantity} × ${item.unit_price}
              </Text>
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>
        Total: ${order.total_amount}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  status: {
    marginBottom: 15,
    color: "gray",
  },

  item: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  img: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },

  total: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 15,
  },
});