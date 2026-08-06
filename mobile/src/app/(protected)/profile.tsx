import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth.store";

export default function Profile() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of ShopSphere?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>My Account 👤</Text>
        <Text style={styles.headerSubtitle}>Manage your profile & preferences</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        <Text style={styles.name}>{user?.name || "Unknown User"}</Text>
        <Text style={styles.email}>{user?.email || "No email found"}</Text>

        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>🛍️ ShopSphere Member</Text>
        </View>
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
  },

  header: {
    paddingTop: 12,
    paddingBottom: 20,
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

  card: {
    backgroundColor: "#1e293b",
    padding: 28,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#6366f1",
  },

  avatarText: {
    color: "#818cf8",
    fontSize: 36,
    fontWeight: "900",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 18,
  },

  infoBadge: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.3)",
  },

  infoBadgeText: {
    color: "#818cf8",
    fontSize: 12,
    fontWeight: "700",
  },

  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  logoutText: {
    color: "#f87171",
    fontSize: 16,
    fontWeight: "800",
  },
});
