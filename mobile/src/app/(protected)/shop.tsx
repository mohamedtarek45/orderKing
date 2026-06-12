import { useCallback, useEffect, useState } from "react";
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

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
};

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("all");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products", {
        params: {
          search,
          category: category === "all" ? "" : category,
        },
      });

      setProducts(res.data);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(input);
    }, 900);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    fetchProducts();
  }, [search, category]);
  console.log(products);
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(async () => {
      await fetchProducts();
      setRefreshing(false);
    }, 1000);
  }, [search, category]);

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
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
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
            <View style={styles.card}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

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
    backgroundColor: "#fff",
    gap: 12,
    paddingVertical: 10,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#ddd",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  price: {
    color: "green",
    marginTop: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
  },
});
