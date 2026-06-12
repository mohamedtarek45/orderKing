import { create } from "zustand";
type User = {
  id: string;
  name: string;
  role: string;
  email: string;
};
type AuthState = {
  user: User | null;
  login: (data : User) => Promise<void>;
  logout: () => Promise<void>;

};
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (data) => {
    set({
      user: data,
    });
  },
  logout: async () => {
    localStorage.removeItem('token');
    set({
      user: null,
    });
  },

}));