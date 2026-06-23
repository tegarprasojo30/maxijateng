import { LayoutDashboard, TrendingUp, List, RefreshCw, AlertTriangle, BookOpen, ChevronDown, Database, Newspaper } from "lucide-react";
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
  { title: "Daftar Sampel", icon: List, path: "/skth-2025/daftar-sampel" },
  { title: "Ganti Sampel", icon: RefreshCw, url: "https://docs.google.com/spreadsheets/d/1VPe9EZ2e5QCK8jybggZF9LUdtHcAwUtVgJT8zV3APog/edit?usp=sharing" },
  { title: "Anomali Data", icon: AlertTriangle, path: "/skth-2025/anomali-data" },
];

const sktrSubMenus = [
  { title: "Progres", icon: TrendingUp, path: "/sktr-2026/progres" },
  { title: "Daftar Sampel", icon: List, path: "/sktr-2026/daftar-sampel" },
  { title: "Ganti Sampel", icon: RefreshCw, url: "https://docs.google.com/spreadsheets/d/1VPe9EZ2e5QCK8jybggZF9LUdtHcAwUtVgJT8zV3APog/edit?usp=sharing" },
  { title: "Anomali Data", icon: AlertTriangle, path: "/sktr-2026/anomali-data" },
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
        {!collapsed && (
          <div className="px-4 pt-1 pb-3 flex flex-col items-center gap-2 border-b border-sidebar-border mb-2">
            <img src="https://i.ibb.co/k68sM7PM/maxijateng.png" alt="Logo Monev" className="w-48 h-32 object-contain rounded-lg" />
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-3 border-b border-sidebar-border mb-2">
            <img src="https://i.ibb.co/k68sM7PM/maxijateng.png" alt="Logo" className="w-8 h-4 object-contain rounded" />
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold" className="flex items-center w-full">
                    <LayoutDashboard className="h-4 w-4 mr-2 shrink-0" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/data-lpse" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold" className="flex items-center w-full">
                    <Database className="h-4 w-4 mr-2 shrink-0" />
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
                        <BookOpen className="h-4 w-4 mr-4" />
                        {!collapsed && <span>SKTH 2025</span>}
                      </div>
                      {!collapsed && <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-hidden">
                    <SidebarMenuSub>
                      {skthSubMenus.map(item => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            {item.path ? (
                              <NavLink to={item.path} activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                                <item.icon className="h-3.5 w-3.5 mr-2" />
                                <span>{item.title}</span>
                              </NavLink>
                            ) : item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <item.icon className="h-3.5 w-3.5 mr-2" />
                                <span>{item.title}</span>
                              </a>
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
                        <BookOpen className="h-4 w-4 mr-4" />
                        {!collapsed && <span>SKTR 2026</span>}
                      </div>
                      {!collapsed && <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-hidden">
                    <SidebarMenuSub>
                      {sktrSubMenus.map(item => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            {item.path ? (
                              <NavLink to={item.path} activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                                <item.icon className="h-3.5 w-3.5 mr-2" />
                                <span>{item.title}</span>
                              </NavLink>
                            ) : item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <item.icon className="h-3.5 w-3.5 mr-2" />
                                <span>{item.title}</span>
                              </a>
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

              {/* Fenomena */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/fenomena" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold" className="flex items-center w-full">
                    <Newspaper className="h-4 w-4 mr-2 shrink-0" />
                    {!collapsed && <span>Fenomena</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Pedoman */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/pedoman" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold" className="flex items-center w-full">
                    <BookOpen className="h-4 w-4 mr-2 shrink-0" />
                    {!collapsed && <span>Pedoman</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
