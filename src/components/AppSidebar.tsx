import { LayoutDashboard, TrendingUp, List, RefreshCw, AlertTriangle, Download, BookOpen, ChevronDown, Database } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

const skthSubMenus = [
  { title: "Progres", icon: TrendingUp, path: "/skth-2025/progres" },
  { title: "Daftar Sampel", icon: List, suffix: "/daftar-sampel" },
  { title: "Ganti Sampel", icon: RefreshCw, suffix: "/ganti-sampel" },
  { title: "Anomali Data", icon: AlertTriangle, suffix: "/anomali-data" },
];

const sktrSubMenus = [
  { title: "Progres", icon: TrendingUp, suffix: "/progres" },
  { title: "Daftar Sampel", icon: List, suffix: "/daftar-sampel" },
  { title: "Ganti Sampel", icon: RefreshCw, suffix: "/ganti-sampel" },
  { title: "Anomali Data", icon: AlertTriangle, suffix: "/anomali-data" },
];

function handleComingSoon(e: React.MouseEvent) {
  e.preventDefault();
  toast.info("Fitur belum tersedia");
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-2">
        {/* Logo & Title */}
        {!collapsed && (
          <div className="px-4 py-3 flex flex-col items-center gap-2 border-b border-sidebar-border mb-2">
            <img
              src="https://i.ibb.co.com/gLVCpHJR/Chat-GPT-Image-Apr-6-2026-12-23-59-PM.png"
              alt="Logo Monev"
              className="w-24 h-24 object-contain rounded-lg"
            />
            <p className="text-xs text-center leading-tight text-sidebar-foreground font-medium opacity-90">
              Monitoring dan Evaluasi Survei Statistik Konstruksi Jawa Tengah
            </p>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-3 border-b border-sidebar-border mb-2">
            <img
              src="https://i.ibb.co.com/gLVCpHJR/Chat-GPT-Image-Apr-6-2026-12-23-59-PM.png"
              alt="Logo"
              className="w-8 h-8 object-contain rounded"
            />
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" onClick={handleComingSoon} className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Dashboard</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Data LPSE */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                    <Database className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Data LPSE</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* SKTH 2025 */}
              <Collapsible defaultOpen={currentPath.startsWith("/skth-2025")} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {!collapsed && <span>SKTH 2025</span>}
                      </div>
                      {!collapsed && <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {skthSubMenus.map(item => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            {item.path ? (
                              <NavLink to={item.path} activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                                <item.icon className="h-3.5 w-3.5 mr-2" />
                                <span>{item.title}</span>
                              </NavLink>
                            ) : (
                              <a href="#" onClick={handleComingSoon} className="flex items-center">
                                <item.icon className="h-3.5 w-3.5 mr-2" />
                                <span>{item.title}</span>
                              </a>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* SKTR 2026 */}
              <Collapsible defaultOpen={currentPath.startsWith("/sktr-2026")} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {!collapsed && <span>SKTR 2026</span>}
                      </div>
                      {!collapsed && <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {sktrSubMenus.map(item => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <a href="#" onClick={handleComingSoon} className="flex items-center">
                              <item.icon className="h-3.5 w-3.5 mr-2" />
                              <span>{item.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Download */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" onClick={handleComingSoon} className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Download</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Pedoman */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" onClick={handleComingSoon} className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Pedoman</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
