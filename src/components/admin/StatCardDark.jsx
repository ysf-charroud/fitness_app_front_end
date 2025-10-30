// components/admin/StatCardDark.jsx
import { ArrowUp, ArrowDown } from "lucide-react";

export default function StatCardDark({ title, value, change, icon, color }) {
  const isPositive = change.includes("+");
  const iconColor = isPositive ? "text-green-400" : "text-red-400";

  return (
    <div className="p-4 rounded-xl shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-300">{title}</h3>
        <div className={`w-6 h-6 flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-semibold mt-2 text-white">{value}</p>
      <div className="flex items-center mt-2">
        <span className={`text-sm ${iconColor}`}>{change}</span>
        {isPositive ? <ArrowUp className="w-4 h-4 text-green-400 ml-1" /> : <ArrowDown className="w-4 h-4 text-red-400 ml-1" />}
      </div>
    </div>
  );
}