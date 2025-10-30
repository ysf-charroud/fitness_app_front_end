import React from "react";
import { useNavigate } from "react-router-dom"; // or react-router-dom if not Next.js

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  //DropdownMenuPortal,
  DropdownMenuSeparator,
  //DropdownMenuShortcut,
  DropdownMenuSub,
 // DropdownMenuSubContent,
 // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
function Profile() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // send request to backend to clear refresh token cookie
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // send cookies (refresh token)
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        // try to read message
        const body = await res.json().catch(() => ({}));
        console.error("Logout failed:", body.message || res.status);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // clear client-side auth state and redirect
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } catch {
          /* ignore */
        }
      navigate("/login");
    }
  };

  return (
    <div className="p-6">
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DropdownMenuTrigger>
         <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>YC</AvatarFallback>
        </Avatar>
        </DropdownMenuTrigger>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
         <DropdownMenuItem onClick={() => navigate("/profilePage")}>
            Profile
        </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
export { Profile };