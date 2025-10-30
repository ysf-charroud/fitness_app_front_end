// components/admin/dashboard/Stats.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../../../services/redux/slices/adminSlice";

const Stats = () => {
  const dispatch = useDispatch();
  const { stats, error } = useSelector((state) => state.admin);

  useEffect(() => {
    console.log("🔄 Dispatch fetchStats...");
    dispatch(fetchStats());
  }, [dispatch]);

  // Debug des données Redux
  console.log("📊 Stats depuis Redux:", stats);
  console.log("❌ Erreur depuis Redux:", error);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur: </strong> {error.message || "Erreur de chargement"}
          <div className="mt-2 text-sm">
            <button 
              onClick={() => dispatch(fetchStats())}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-sm text-gray-500">Total athletes</h2>
          <p className="text-2xl font-semibold mt-2">
            {stats?.totalAthletes || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-sm text-gray-500">Active Programs</h2>
          <p className="text-2xl font-semibold mt-2">
            {stats?.totalPrograms || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-sm text-gray-500">Total Gyms</h2>
          <p className="text-2xl font-semibold mt-2">
            {stats?.totalGyms || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-sm text-gray-500">Total Coaches</h2>
          <p className="text-2xl font-semibold mt-2">
            {stats?.totalCoaches || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;