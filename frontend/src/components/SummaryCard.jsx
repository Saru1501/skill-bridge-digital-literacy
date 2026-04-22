export default function SummaryCard({ title, value, subtitle = "", tone = "default", icon }) {
  const toneClasses = {
    default: "bg-white text-gray-800 border-gray-100",
    dark: "bg-gradient-to-br from-gray-800 to-black text-white border-gray-800",
    success: "bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-900 border-emerald-100",
    warning: "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 border-amber-100",
    info: "bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-900 border-indigo-100",
  };

  return (
    <div className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${toneClasses[tone] || toneClasses.default}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold tracking-wide uppercase opacity-70">{title}</p>
        {icon && (
          <span className="p-2 rounded-xl bg-white/20 backdrop-blur-sm shadow-sm flex items-center justify-center">
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-4xl font-extrabold tracking-tight">{value}</p>
      </div>
      {subtitle && <p className="mt-3 text-sm font-medium opacity-70">{subtitle}</p>}
    </div>
  );
}