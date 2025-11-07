// components/admin/dashboard/DashboardCharts.jsx
"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
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
  const { revenueChart, roleDistribution } = useSelector(
    (state) => state.admin
  );
  const [timeRange, setTimeRange] = useState("90d")

  const filteredRevenueData = revenueChart.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue (Last 30 Days)</CardTitle>
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
      

