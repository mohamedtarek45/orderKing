import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { api } from "@/api/axios";
import { router } from "expo-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Required", "Please fill in all fields");
      return;
    }
    try {
      setLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      Alert.alert("Account Created 🎉", "You can now log in with your credentials", [
        { text: "Log In", onPress: () => router.push("/(public)/login") },
      ]);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>✨</Text>
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join ShopSphere to start ordering</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            placeholder="John Doe"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text style={styles.buttonText}>Register Now</Text>
          )}
        </TouchableOpacity>

        <Pressable style={styles.footerLink} onPress={() => router.push("/(public)/login")}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.highlightText}>Log In</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },

  logoText: {
    fontSize: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f8fafc",
  },

  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 8,
    letterSpacing: 0.8,
  },

  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#f8fafc",
  },

  button: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonText: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16,
  },

  footerLink: {
    marginTop: 20,
    alignItems: "center",
  },

  footerText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
  },

  highlightText: {
    color: "#f59e0b",
    fontWeight: "700",
  },
});