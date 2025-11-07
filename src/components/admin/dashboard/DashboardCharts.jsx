// components/admin/dashboard/DashboardCharts.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRevenueChart } from "@/services/redux/slices/adminSlice";
import { ChartAreaInteractive } from "@/components/admin/dashboard/chart-area-interactive";
import UserRolesPieChart from "@/components/admin/dashboard/UserRolesPieChart";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardCharts() {
  const dispatch = useDispatch();
  const { revenueChart, roleDistribution } = useSelector(
    (state) => state.admin
  );
  const [timeRange, setTimeRange] = useState("30d");

  // Recharger les données quand on change la période
  useEffect(() => {
    let days = 30;
    if (timeRange === "90d") days = 90;
    else if (timeRange === "7d") days = 7;
    
    dispatch(fetchRevenueChart(days));
  }, [timeRange, dispatch]);

  // Pas besoin de filtrer, le backend envoie déjà les bonnes données
  const filteredRevenueData = revenueChart || [];

  // Vérifier s'il y a des revenues
  const hasRevenue = filteredRevenueData.some(item => item.revenue > 0);
  const totalRevenue = filteredRevenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);

  console.log("📊 Chart Data:", {
    dataPoints: filteredRevenueData.length,
    hasRevenue,
    totalRevenue,
    sample: filteredRevenueData.slice(0, 3)
  });

  // Titre dynamique
  const getChartTitle = () => {
    if (timeRange === "7d") return "Revenue (Last 7 Days)";
    if (timeRange === "30d") return "Revenue (Last 30 Days)";
    if (timeRange === "90d") return "Revenue (Last 3 Months)";
    return "Revenue";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{getChartTitle()}</CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} MAD`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#FF8C00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <UserRolesPieChart data={roleDistribution} title="User Roles" />
      <ChartAreaInteractive className={'col-span-2  h-[]'} />
    </div>
    );
  }
      

