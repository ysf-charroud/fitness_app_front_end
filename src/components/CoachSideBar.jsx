import { DollarSign, Settings, Zap, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
  SidebarGroup,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
 import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { useSelector } from "react-redux"
import useChanged from "@/hooks/useChanged"

function CoachSideBar() {
  const user = useSelector(state => state.auth.user)
  
  const navigationLinks = [
    {
      label: "Programs",
      href: "/coach/programs",
      icon: DollarSign,
    },
    {
      label: "Profile",
      href: "#",
      icon: Zap,
    },
    {
      label: "Settings",
      href: "#",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://avatar.vercel.sh/coach" alt="Coach" />
            <AvatarFallback>CO</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">Coach Dashboard</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">Welcome back</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {navigationLinks.map((link) => (
              <SidebarMenuItem key={link.label} >
                <Link
                  to={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt="User" />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}


export default CoachSideBar