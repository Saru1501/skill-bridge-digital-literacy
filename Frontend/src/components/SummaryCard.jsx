export default function SummaryCard({ title, value, subtitle = "", tone = "default" }) {
  const toneClasses = {
    default: "bg-white text-gray-900",
    dark: "bg-black text-white",
    success: "bg-green-50 text-green-900",
    warning: "bg-yellow-50 text-yellow-900",
    info: "bg-blue-50 text-blue-900",
  };

  return (
    <div className={`rounded-2xl p-5 shadow-sm text-left ${toneClasses[tone] || toneClasses.default}`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {subtitle && <p className="mt-2 text-sm opacity-80">{subtitle}</p>}
    </div>
  );
}