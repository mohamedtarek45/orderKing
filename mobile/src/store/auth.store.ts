import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { api } from "@/api/axios";

type User = {
  id: string;
  name: string;
  role: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;


  login: (data: { token: string }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,


  login: async (data) => {
    await SecureStore.setItemAsync("token", data.token);

    const response = await api.get("/auth/me");

    set({
      token: data.token,
      user: response.data,
    });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");

    set({
      token: null,
      user: null,
    });
  },

  hydrate: async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("token");

      if (!storedToken) {
        set({
          token: null,
          user: null,
        });
        return;
      }

      const decoded: any = jwtDecode(storedToken);

      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        await SecureStore.deleteItemAsync("token");

        set({
          token: null,
          user: null,
        });

        return;
      }

      const response = await api.get("/auth/me");

      set({
        token: storedToken,
        user: response.data,
      });
    } catch {
      await SecureStore.deleteItemAsync("token");

      set({
        token: null,
        user: null,
      });
    }
  },
}));