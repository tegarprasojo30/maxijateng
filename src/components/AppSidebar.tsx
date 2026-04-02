import { LayoutDashboard, TrendingUp, List, RefreshCw, AlertTriangle, Download, BookOpen, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const surveySubMenus = [
  { title: "Progres", icon: TrendingUp, suffix: "/progres" },
  { title: "Daftar Sampel", icon: List, suffix: "/daftar-sampel" },
  { title: "Ganti Sampel", icon: RefreshCw, suffix: "/ganti-sampel" },
  { title: "Anomali Data", icon: AlertTriangle, suffix: "/anomali-data" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Dashboard</span>}
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
                      {surveySubMenus.map(item => (
                        <SidebarMenuSubItem key={item.suffix}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={`/skth-2025${item.suffix}`} activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                              <item.icon className="h-3.5 w-3.5 mr-2" />
                              <span>{item.title}</span>
                            </NavLink>
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
                      {surveySubMenus.map(item => (
                        <SidebarMenuSubItem key={item.suffix}>
                          <SidebarMenuSubButton asChild>
                            <NavLink to={`/sktr-2026${item.suffix}`} activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                              <item.icon className="h-3.5 w-3.5 mr-2" />
                              <span>{item.title}</span>
                            </NavLink>
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
                  <NavLink to="/download" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                    <Download className="h-4 w-4 mr-2" />
                    {!collapsed && <span>Download</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Pedoman */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/pedoman" activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                    <BookOpen className="h-4 w-4 mr-2" />
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
