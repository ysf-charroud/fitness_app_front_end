// pages/admin/CoachesList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoaches } from "../services/redux/slices/adminSlice";
import CoachesTable from "../components/admin/CoachesTable";

export default function CoachesList() {
  const dispatch = useDispatch();
  const { coaches, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchCoaches());
  }, [dispatch]);

  const handleViewDetails = (coach) => {
    console.log("View coach details:", coach);
    // Vous pouvez ajouter un log ou une analytics si besoin
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 p-6">
        <h2 className="text-xl font-semibold">Coaches</h2>
        <div>Loading coaches...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-6">
      <h2 className="text-xl font-semibold">Coaches List</h2>
      <CoachesTable
        data={coaches}
        onViewDetails={handleViewDetails}

      />
    </div>
  );
}