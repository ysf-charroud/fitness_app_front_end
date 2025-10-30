import React from "react";
import {
  Profile
} from "@/page/Profile"
export default function GymDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Gym Dashboard</h1>
      <p className="mt-2">Welcome Gym — manage your facilities, memberships, and classes here.</p>
      <Profile/>
    </div>
  );
}
