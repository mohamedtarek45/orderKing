import { jwtDecode } from "jwt-decode";
export const getMe = async () => {
  console.log("getMe");
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("getMe2");
    return null;
  }
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000;
  if (decoded?.exp && decoded.exp < now) {
    localStorage.removeItem("token");
    console.log("getMe4");
    return null;
  }
  try {
    const res = await fetch(import.meta.env.VITE_PUBLIC_API_URL + "/auth/me", {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    const result = await res.json();
    if (result?.role === "admin") {
      return result;
    }
    localStorage.removeItem("token");
    return null;
  } catch (err) {
    localStorage.removeItem("token");
    console.log("getMe6");
    console.log(err);
  }
};
