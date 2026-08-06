import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart.store";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/api/axios";
import { Product } from "@/types/product";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.id === product?.id),
  );

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageCard}>
          <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
          {product.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>
                {typeof product.category === "string" ? product.category : product.category?.name}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description || "No description provided for this product."}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footerAction}>
        {cartItem ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => decreaseQuantity(product.id)}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{cartItem.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => increaseQuantity(product.id)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image_url: product.image_url,
              })
            }
            activeOpacity={0.85}
          >
            <Text style={styles.addButtonText}>Add To Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  content: {
    paddingBottom: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },

  notFound: {
    color: "#94a3b8",
    fontSize: 16,
  },

  imageCard: {
    width: "100%",
    height: 300,
    backgroundColor: "#1e293b",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  categoryTag: {
    position: "absolute",
    bottom: 16,
    left: 20,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  categoryText: {
    color: "#818cf8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  detailsCard: {
    padding: 20,
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 8,
  },

  price: {
    fontSize: 26,
    fontWeight: "900",
    color: "#10b981",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#94a3b8",
  },

  footerAction: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#334155",
  },

  addButton: {
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

  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: "#334155",
  },

  qtyButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "700",
  },

  quantity: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "800",
  },
});

