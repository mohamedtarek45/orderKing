import type { LucideIcon } from "lucide-react";

type Color = "blue" | "green" | "purple" | "orange" | "rose";

type Props = {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: Color;
};

const colorStyles: Record<Color, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-50/80 text-blue-600", text: "text-blue-600", ring: "ring-blue-100" },
  green: { bg: "bg-emerald-50/80 text-emerald-600", text: "text-emerald-600", ring: "ring-emerald-100" },
  purple: { bg: "bg-purple-50/80 text-purple-600", text: "text-purple-600", ring: "ring-purple-100" },
  orange: { bg: "bg-orange-50/80 text-orange-600", text: "text-orange-600", ring: "ring-orange-100" },
  rose: { bg: "bg-rose-50/80 text-rose-600", text: "text-rose-600", ring: "ring-rose-100" },
};

const KpiCard = ({ title, value, icon: Icon, color = "blue" }: Props) => {
  const styles = colorStyles[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{value}</h2>
        </div>

        {Icon && (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${styles.bg} ${styles.ring} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;