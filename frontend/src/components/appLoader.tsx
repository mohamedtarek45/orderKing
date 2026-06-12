import { Loader2 } from "lucide-react";

const AppLoader = () => {
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center gap-4 z-50">
      <div className="relative flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />{" "}
      </div>
      <p className="text-slate-400 text-base tracking-widest uppercase">
        Loading
      </p>
    </div>
  );
};

export default AppLoader;
