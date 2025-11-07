// pages/admin/statistics.jsx
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionStats } from "@/services/redux/slices/adminSlice";
import RecentTransactionsTable from "../components/admin/RecentTransactionsTable";
import {
  Wallet,
  Users,
  LineChart,
  DollarSign,
} from 'lucide-react';
import { Card } from "@/components/ui/card";

export default function Statistics() {
  const dispatch = useDispatch();
  const { stats, recentTransactions, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchTransactionStats());
  }, [dispatch]);

  if (loading || !stats) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header avec titre et période */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Statistics</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble des performances</p>
        </div>
        <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
          <option>Cette semaine</option>
          <option>Ce mois</option>
          <option>Cette année</option>
        </select>
      </div>

      {/* Section des métriques additionnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nouveaux Clients</p>
              <p className="text-xl font-semibold text-gray-900">{stats.transactionCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenu Journalier</p>
              <p className="text-xl font-semibold text-gray-900">{stats.dailyRevenue} MAD</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LineChart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Croissance Mensuelle</p>
              <p className="text-xl font-semibold text-gray-900">+{stats.monthlyGrowth}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue Total</p>
              <p className="text-xl font-semibold text-gray-900">{stats.totalRevenue} MAD</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau des transactions  */}
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900"> All Transactions </h3>
        
        </div>
        <RecentTransactionsTable data={recentTransactions} />
      </Card>
    </div>
  );
}