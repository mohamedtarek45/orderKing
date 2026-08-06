import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/auth";
import { Loader2, Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/userStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        import.meta.env.VITE_PUBLIC_API_URL + "/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");
      const token = data?.session?.access_token;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      const user = await getMe();
      if (user) {
        toast.success("Welcome back to ShopSphere 🎉");
        setUser(user);
        navigate("/home");
      } else {
        toast.error("You do not have admin permissions");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* Dynamic ambient mesh background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 rounded-2xl shadow-xl shadow-indigo-500/25 mb-2 ring-1 ring-white/20">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            ShopSphere
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Store Management & Commerce Operations
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleLogin}
          className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-slate-950/80 space-y-5"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Email
            </label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="admin@shopsphere.com"
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition placeholder-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative group">
              <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-violet-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition placeholder-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>Access Control Panel</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


