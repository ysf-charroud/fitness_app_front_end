// pages/admin/statistics.jsx
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRevenueStats } from "@/services/redux/slices/adminSlice";
import RecentTransactionsTable from "../components/admin/RecentTransactionsTable";
import {
  Wallet,
  Users,
  LineChart,
  DollarSign,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import { Card } from "@/components/ui/card";

export default function Statistics() {
  const dispatch = useDispatch();
  const { revenueStats } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchRevenueStats());
  }, [dispatch]);

  if (!revenueStats) {
    return <div className="p-6 text-white">Loading...</div>;
  }
  // Données pour le tableau
  const transactionsData = [
    {
      orderId: "AR-47380416-61",
      productImage: "/placeholder.svg?height=40&width=40",
      productName: "Meta Quest 3",
      productSpec: "512Gb • White",
      price: 499,
      customerName: "Liam Smith",
      dateCheckout: "02 Apr 2025, 8:15 am",
      paymentMethod: "VISA",
      email: "smith@example.com",
    },
    {
      orderId: "AR-47380416-62",
      productImage: "/placeholder.svg?height=40&width=40",
      productName: "iPhone 15 Pro Max",
      productSpec: "256Gb • Black",
      price: 1099,
      customerName: "Emma Johnson",
      dateCheckout: "01 Apr 2025, 10:30 am",
      paymentMethod: "Mastercard",
      email: "emma.johnson@example.com",
    },
    {
      orderId: "AR-47380416-63",
      productImage: "/placeholder.svg?height=40&width=40",
      productName: "AirPods Pro",
      productSpec: "2nd Gen • White",
      price: 249,
      customerName: "John Doe",
      dateCheckout: "31 Mar 2025, 14:20 pm",
      paymentMethod: "PayPal",
      email: "john.doe@example.com",
    },
  ];

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

    

      {/* Section des graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Mensuel</h3>
              <p className="text-sm text-gray-500">Evolution des revenus</p>
            </div>
            <TrendingUp className="text-blue-500 w-5 h-5" />
          </div>
          {/* Ici, vous pouvez intégrer votre graphique de revenus */}
        </Card>

        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Distribution des Ventes</h3>
              <p className="text-sm text-gray-500">Par catégorie</p>
            </div>
            <ShoppingBag className="text-indigo-500 w-5 h-5" />
          </div>
          {/* Ici, vous pouvez intégrer votre graphique de distribution */}
        </Card>
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
              <p className="text-xl font-semibold text-gray-900">+124</p>
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
              <p className="text-xl font-semibold text-gray-900">$1,429</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LineChart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Croissance</p>
              <p className="text-xl font-semibold text-gray-900">+12.5%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-semibold text-gray-900">854</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tableau des transactions récentes */}
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Transactions Récentes</h3>
          <p className="text-sm text-gray-500">Liste des dernières transactions</p>
        </div>
        <RecentTransactionsTable data={transactionsData} />
      </Card>
    </div>
  );
}