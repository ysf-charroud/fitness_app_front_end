// components/admin/dashboard/DashboardStats.jsx
import { useSelector } from "react-redux";
import { Users, Building, User, DollarSign } from "lucide-react";
import { Link } from "react-router";

// ✅ Define hover colors
const HOVER_COLORS = {
  "bg-blue-50": "hover:bg-blue-100",
  "bg-green-50": "hover:bg-green-100",
  "bg-purple-50": "hover:bg-purple-100",
  "bg-orange-50": "hover:bg-orange-100",
};

export default function DashboardStats() {
  const { stats } = useSelector((state) => state.admin);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Link to="/admin/athletes" className="block">
        <StatCard
          title="Total Athletes"
          value={stats?.totalAthletes || 0}
          icon={<Users className="w-6 h-6 text-blue-500" />}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
        />
      </Link>

      <Link to="/admin/gyms" className="block">
        <StatCard
          title="Total Gyms"
          value={stats?.totalGyms || 0}
          icon={<Building className="w-6 h-6 text-green-500" />}
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />
      </Link>

      <Link to="/admin/coaches" className="block">
        <StatCard
          title="Total Coaches"
          value={stats?.totalCoaches || 0}
          icon={<User className="w-6 h-6 text-purple-500" />}
          bgColor="bg-purple-50"
          borderColor="border-purple-200"
        />
      </Link>

      <Link to="/admin/statistics" className="block">
        <StatCard
          title="Revenues"
          value={`${stats?.totalRevenue || 0} MAD`}
          icon={<DollarSign className="w-6 h-6 text-orange-500" />}
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
        />
      </Link>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor, borderColor }) {
  const hoverColor = HOVER_COLORS[bgColor] || "";

  return (
    <div
      className={`${bgColor} ${borderColor} p-6 rounded-xl shadow-sm border 
        transition-all duration-300 ease-in-out
        hover:shadow-md hover:-translate-y-1
        ${hoverColor}
        cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-500">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}