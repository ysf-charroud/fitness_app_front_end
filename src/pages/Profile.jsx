import React from "react";
import { useNavigate } from "react-router-dom"; // or react-router-dom if not Next.js
import { useSelector, useDispatch } from "react-redux";
import { resetAuth } from "@/services/redux/slices/authSlice";

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
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
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
      dispatch(resetAuth());
      navigate("/login");
    }
  };

  return (
    <div className="p-6">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
         <Avatar className="cursor-pointer">
          <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
          <AvatarFallback>
            {user?.name
              ? user.name
                  .split(' ')
                  .map((n) => n.charAt(0))
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
         <DropdownMenuItem onClick={() => navigate("/ProfilePage")}>
            Profile
        </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSub>
          </DropdownMenuSub>
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