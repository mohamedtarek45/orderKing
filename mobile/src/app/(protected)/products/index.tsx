import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/api/axios";
import { router } from "expo-router";
import { Product } from "@/types/product";

const categories = [
  "all",
  "clothing",
  "food",
  "electronics",
  "home-kitchen",
  "books",
];

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("all");

  const didMount = useRef(false);

  const fetchProducts = async (searchText: string, cat: string) => {
    try {
      setLoading(true);

      const params: any = {
        search: searchText,
      };

      if (cat && cat !== "all") {
        params.category = cat;
      }

      const res = await api.get("/products", { params });

      setProducts(res.data ?? []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // يمنع أول mount الغلط في dev mode
    if (!didMount.current) {
      didMount.current = true;
      fetchProducts("", "all");
      return;
    }

    const timer = setTimeout(() => {
      fetchProducts(input, category);
    }, 500);

    return () => clearTimeout(timer);
  }, [input, category]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(input, category).finally(() => {
      setRefreshing(false);
    });
  }, [input, category]);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Search products..."
        value={input}
        onChangeText={setInput}
        style={styles.search}
      />

      <View style={styles.tabs}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.tab, category === cat && styles.activeTab]}
          >
            <Text style={{ color: category === cat ? "#fff" : "#000" }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : products.length === 0 ? (
        <Text style={styles.empty}>No products found</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push(`/(protected)/products/${item.id}` as any)
              }
            >
              <View style={styles.card}>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  activeTab: {
    backgroundColor: "#000",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },
  name: { fontSize: 16, fontWeight: "600" },
  price: { color: "green", marginTop: 4 },
  empty: { textAlign: "center", marginTop: 50, color: "#777" },
});