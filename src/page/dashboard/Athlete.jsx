import React from "react";
import {
  Profile
} from "@/page/Profile"
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export default function AthleteDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Athlete Dashboard</h1>
      <p className="mt-2">Welcome Athlete — track progress, plans, and goals here.</p>
      <Profile/>
    </div>
  );
}
