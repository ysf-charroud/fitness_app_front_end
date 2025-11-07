// page/admin/Dashboard.jsx
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchRevenueChart,
  fetchRoleDistribution,
  fetchLastTransactions,
  fetchBestPrograms,
} from "../services/redux/slices/adminSlice"; 

// Composants internes
import DashboardStats from "../components/admin/dashboard/DashboardStats";
import DashboardCharts from "../components/admin/dashboard/DashboardCharts";
import DashboardContent from "../components/admin/dashboard/DashboardContent";

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRevenueChart(30)); // Charger les 30 derniers jours par défaut
    dispatch(fetchRoleDistribution());
    dispatch(fetchLastTransactions());
    dispatch(fetchBestPrograms());
  }, [dispatch]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      <DashboardStats />
      <DashboardCharts />
      <DashboardContent />
    </div>
  );
}
