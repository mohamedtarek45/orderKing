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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }
  console.log(product);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: product.image_url }} style={styles.image} />

      <Text style={styles.name}>{product.name}</Text>

      <Text style={styles.price}>${product.price}</Text>

      {product.category && (
        <View style={styles.category}>
          <Text>{product.category.name}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        {product.description || "No description available"}
      </Text>
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
              price: product.price,
              image_url: product.image_url,
            })
          }
        >
          <Text style={styles.addButtonText}>Add To Cart</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 20,
  },

  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "green",
    marginHorizontal: 20,
    marginTop: 10,
  },

  category: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    marginHorizontal: 20,
    color: "#555",
  },
  addButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 20,
  },

  qtyButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  quantity: {
    fontSize: 20,
    fontWeight: "700",
  },
});
