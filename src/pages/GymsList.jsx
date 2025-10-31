// page/admin/GymsList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGyms, approveGym, rejectGym, deleteGym } from "../services/redux/slices/adminSlice";
import GymsTable from "../components/admin/GymsTable";

export default function GymsList() {
  const dispatch = useDispatch();
  const { gyms, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  const refreshGyms = () => {
    dispatch(fetchGyms());
  };

  const handleApprove = async (gymId) => {
    try {
      await dispatch(approveGym(gymId)).unwrap();
      refreshGyms();
    } catch (error) {
      console.error("Error approving gym:", error);
    }
  };

  const handleReject = async (gymId) => {
    try {
      await dispatch(rejectGym(gymId)).unwrap();
      refreshGyms();
    } catch (error) {
      console.error("Error rejecting gym:", error);
    }
  };

  const handleDelete = async (gymId) => {
    try {
      await dispatch(deleteGym(gymId)).unwrap();
      refreshGyms();
    } catch (error) {
      console.error("Error deleting gym:", error);
    }
  };

  const handleViewDetails = (gym) => {
    console.log("View gym details:", gym);
    // Vous pouvez ajouter d'autres logiques ici si nécessaire
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 p-6">
        <h2 className="text-xl font-semibold">Gyms</h2>
        <div>Loading gyms...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-6">
      <h2 className="text-xl font-semibold">Gyms Management</h2>
      <GymsTable
        data={gyms}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}