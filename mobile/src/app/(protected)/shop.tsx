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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/api/axios";
import { router } from "expo-router";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cart.store";

const categories = [
  { id: "all", label: "All", icon: "✨" },
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "food", label: "Food", icon: "🍔" },
  { id: "electronics", label: "Electronics", icon: "⚡" },
  { id: "home-kitchen", label: "Home", icon: "🏠" },
  { id: "books", label: "Books", icon: "📚" },
];

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("all");

  const didMount = useRef(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
    if (!didMount.current) {
      didMount.current = true;
      fetchProducts("", "all");
      return;
    }

    const timer = setTimeout(() => {
      fetchProducts(input, category);
    }, 400);

    return () => clearTimeout(timer);
  }, [input, category]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts(input, category).finally(() => {
      setRefreshing(false);
    });
  }, [input, category]);

  const handleAddToCart = (e: any, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>ShopSphere 🛍️</Text>
          <Text style={styles.headerSubtitle}>Discover top rated products</Text>
        </View>

        <TouchableOpacity
          style={styles.cartIconBadge}
          onPress={() => router.push("/(protected)/cart")}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20 }}>🛒</Text>
          {totalCartCount > 0 && (
            <View style={styles.badgeCounter}>
              <Text style={styles.badgeCounterText}>{totalCartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search products & categories..."
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
          style={styles.searchInput}
        />
        {input.length > 0 && (
          <TouchableOpacity onPress={() => setInput("")} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Horizontal Scroll */}
      <View style={{ height: 48, marginBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {categories.map((cat) => {
            const isActive = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[styles.tab, isActive && styles.activeTab]}
                activeOpacity={0.75}
              >
                <Text style={styles.tabIcon}>{cat.icon}</Text>
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Products Grid */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loaderText}>Loading Marketplace...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptySubtitle}>Try searching with different keywords</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366f1"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => router.push(`/(protected)/products/${item.id}` as any)}
              activeOpacity={0.88}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image_url || "https://via.placeholder.com/150" }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                {item.category ? (
                  <View style={styles.categoryChip}>
                    <Text style={styles.categoryChipText}>
                      {typeof item.category === "string" ? item.category : item.category?.name || "General"}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.cardDetails}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>${item.price}</Text>

                  <TouchableOpacity
                    style={styles.addCartBtn}
                    onPress={(e) => handleAddToCart(e, item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addCartBtnText}>+ Add</Text>
                  </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
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

  cartIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    position: "relative",
  },

  badgeCounter: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#0f172a",
  },

  badgeCounterText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#f8fafc",
  },

  clearBtn: {
    padding: 4,
  },

  clearBtnText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
  },

  tabsContainer: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: "center",
  },

  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },

  activeTab: {
    backgroundColor: "#6366f1",
    borderColor: "#818cf8",
  },

  tabIcon: {
    fontSize: 13,
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
  },

  activeTabText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  listContainer: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },

  gridRow: {
    justifyContent: "space-between",
    marginBottom: 14,
  },

  productCard: {
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  imageContainer: {
    width: "100%",
    height: 130,
    backgroundColor: "#0f172a",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  categoryChip: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  categoryChipText: {
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  cardDetails: {
    padding: 12,
    justifyContent: "space-between",
    flex: 1,
  },

  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f8fafc",
    lineHeight: 18,
    marginBottom: 8,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#10b981",
  },

  addCartBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },

  addCartBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loaderText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
  },
});


