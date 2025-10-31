"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconSettings } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/page/Profile";
import { DollarSign } from "lucide-react";

function CoachSideBar({ children }) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Programs",
      href: "/coach/programs",
      icon: (
        <DollarSign className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/coach/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden border border-neutral-200 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      <Sidebar
        open={open}
        setOpen={setOpen}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <SidebarBody className="flex flex-col justify-between gap-10 relative">
          {/* ✅ Profile Section */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              open
                ? "absolute top-4 left-4 w-auto translate-x-0 opacity-100"
                : "absolute top-4 left-1/2 -translate-x-1/2 opacity-80"
            )}
          >
            <Profile />
          </div>

          {/* Navigation Links */}
          <div
            className={cn(
              "flex flex-col gap-2 transition-all duration-300 ease-in-out mt-24",
              open ? "pl-4" : "pl-0 items-center"
            )}
          >
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main content */}
      {children}
    </div>
  );
}

export default CoachSideBar;
