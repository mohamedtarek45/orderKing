const styles: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  processing: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  completed: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  cancelled: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", dot: "bg-rose-500" },
};

export default function StatusBadge({ status }: { status: string }) {
  const current = styles[status?.toLowerCase()] ?? {
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${current.bg} ${current.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}