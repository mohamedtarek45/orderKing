import { Outlet, useNavigation } from "react-router-dom";
import AppLoader from "../components/appLoader.tsx";
import { getMe } from "../services/auth";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/userStore.ts";
const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const [loading, setLoading] = useState(true);
  const setUser = useAuthStore((state) => state.login);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getMe();
        setUser(result);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser]);

  return (
    <div className="min-h-screen bg-slate-50">

      {isLoading || loading ? <AppLoader /> : <Outlet />}
    </div>
  );
};

export default AppLayout;
