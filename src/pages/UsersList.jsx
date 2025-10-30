// page/admin/UsersList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, activateUser, deactivateUser, deleteUser } from "../services/redux/slices/adminSlice";
import UserTable from "../components/admin/UserTable";

export default function UsersList() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleActivate = async (id) => {
    try {
      await dispatch(activateUser(id)).unwrap();
      // Rafraîchir la liste des utilisateurs
    } catch (error) {
      console.error("Error activating user:", error);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await dispatch(deactivateUser(id)).unwrap();
      
      // Rafraîchir la liste des utilisateurs
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      // Rafraîchir la liste des utilisateurs
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4 p-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <div>Loading users...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-6">
      <h2 className="text-xl font-semibold">Users</h2>
      <UserTable
        data={users}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />
    </div>
  );
}
