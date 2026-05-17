import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { Toaster } from "../../components/ui/sonner";
import { toast } from "sonner";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import {
  Sidebar, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "../../components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { ReactNode } from "react";

export type NavItem = { label: string; to: string; icon?: React.ReactNode };

export function AdminOuter({
  navItems, title, subtitle, actions, children,
}: {
  navItems: NavItem[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarProvider defaultOpen={true}>
      {isMobile && openMobile && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setOpenMobile(false)} />
      )}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:hidden"
        style={{ transform: openMobile ? "translateX(0)" : "translateX(-100%)" }}>
        <div className="flex flex-col h-full p-3">
          <div className="flex items-center gap-2 px-1 py-2">{renderBrand()}</div>
          <Separator className="bg-sidebar-border mt-2" />
          <nav className="flex-1 py-3 space-y-1">
            {navItems.map(({ label, to }) => {
              const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
              return (
                <Link key={to} to={to} onClick={() => setOpenMobile(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                    ${active ? "bg-primary/15 text-primary font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}
                  `}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-sidebar-border">
            <button onClick={() => { logout(); navigate({ to: "/login" }); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>
              Log out
            </button>
          </div>
        </div>
      </div>

      <Sidebar className="hidden md:flex bg-sidebar border-sidebar-border">
        <SidebarHeader className="px-3 py-4">{renderBrand()}</SidebarHeader>
        <Separator className="mx-2 bg-sidebar-border" />
        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/45">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ label, to }) => {
                  const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
                  return (
                    <SidebarMenuItem key={to}>
                      <SidebarMenuButton asChild isActive={active} tooltip={label} className="text-[13px]">
                        <Link to={to}>{label}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-2 py-3">
          <Separator className="mb-2 mx-1 bg-sidebar-border" />
          {renderUserDropdown()}
        </SidebarFooter>
      </Sidebar>

      <main className="min-h-screen bg-background md:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 md:hidden">
          <button onClick={() => setOpenMobile(true)} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted" aria-label="Open sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
          </button>
          <span className="text-sm font-semibold tracking-tight">Admin Panel</span>
        </header>
        <div className="hidden items-center gap-2 border-b border-border px-6 py-2.5 md:flex bg-muted/30">
          <SidebarTrigger className="h-8 w-8" />
          <Separator orientation="vertical" className="h-5" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 border-b border-border px-4 py-3 md:hidden">{actions}</div>}
        <div className="p-4 sm:p-6 lg:p-8">
          {subtitle ? <p className="mb-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors closeButton />
    </SidebarProvider>
  );

  function renderBrand() {
    return (
      <Link to="/admin" className="flex items-center gap-2 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/></svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight text-sidebar-foreground">LabelFlow</div>
          <div className="text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">Admin Panel</div>
        </div>
      </Link>
    );
  }

  function renderUserDropdown() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                {user?.companyName?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 leading-tight">
              <div className="truncate text-[13px] font-medium">{user?.companyName || "Admin"}</div>
              <div className="truncate text-[11px] text-sidebar-foreground/55">{user?.companyEmail || ""}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-52">
          <DropdownMenuLabel className="text-xs">Signed in as</DropdownMenuLabel>
          <DropdownMenuLabel className="text-xs font-normal text-sidebar-foreground/55">{user?.companyEmail}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs cursor-pointer" onSelect={() => navigate({ to: "/admin/settings" })}>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-destructive focus:text-destructive cursor-pointer"
            onSelect={() => { logout(); navigate({ to: "/login" }); }}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
