// pages/admin/ProgramsList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrograms, updateProgramStatus } from "../services/redux/slices/adminSlice";
import ProgramsTable from "../components/admin/ProgramsTable";

export default function ProgramsList() {
  const dispatch = useDispatch();
  const { programs, programsLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch]);

  const refreshPrograms = () => {
    dispatch(fetchPrograms());
  };

  const handleApprove = async (programId) => {
    try {
      await dispatch(updateProgramStatus({ id: programId, status: "approved" })).unwrap();
      refreshPrograms();
    } catch (error) {
      console.error("Error approving program:", error);
    }
  };

  const handleReject = async (programId) => {
    try {
      await dispatch(updateProgramStatus({ id: programId, status: "rejected" })).unwrap();
      refreshPrograms();
    } catch (error) {
      console.error("Error rejecting program:", error);
    }
  };

  const handleDelete = async (programId) => {
    // Vous devez implémenter deleteProgram dans votre slice si ce n'est pas fait
    // Pour l'instant, je laisse un placeholder
    try {
      // Remplacez ceci par votre action Redux réelle
      // await dispatch(deleteProgram(programId)).unwrap();
      alert(`Program ${programId} would be deleted.`);
      refreshPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
    }
  };

  const handleViewDetails = (program) => {
    console.log("View program details:", program);
  };

  if (programsLoading) {
    return (
      <div className="w-full space-y-4 p-6">
        <h2 className="text-xl font-semibold">Programs</h2>
        <div>Loading programs...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-6">
      <h2 className="text-xl font-semibold">Programs Management</h2>
      <ProgramsTable
        data={programs}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}