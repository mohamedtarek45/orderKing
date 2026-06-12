import { useAuthStore } from "../store/userStore.ts";
import { Navigate } from "react-router-dom";
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <div>{children}</div>;
};

export default ProtectedLayout;
