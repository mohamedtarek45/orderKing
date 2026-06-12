import type { LucideIcon } from "lucide-react";

type Color = "blue" | "green" | "purple" | "orange" | "rose";

type Props = {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: Color;
};

const colorStyles: Record<Color, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
};

const KpiCard = ({ title, value, icon: Icon, color = "blue" }: Props) => {
  const styles = colorStyles[color];

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-500">{title}</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{value}</h2>
      </div>

      {Icon && (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles.bg}`}>
          <Icon className={`h-6 w-6 ${styles.text}`} />
        </div>
      )}
    </div>
  );
};

export default KpiCard;