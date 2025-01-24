import "./styles/main.css";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import "@fontsource/manrope/index.css";
import { Outlet } from "react-router";
import { AppSidebar, Player } from "@/components";
import { ApiContext } from "@/context/api-context";
import { SidebarProvider } from "@/components/ui/sidebar";

function Layout() {
  const [sidebarOpenState, setSidebarOpenState] = useState<boolean>(
    localStorage.getItem(SIDEBAR_LOCAL_STORAGE_KEY) === "true",
  );

  const handleSidebarOpenChange = (isOpen: boolean) => {
    setSidebarOpenState(isOpen);
    localStorage.setItem(SIDEBAR_LOCAL_STORAGE_KEY, isOpen ? "true" : "false");
  };

  return (
    <ApiContext.Provider value={{ apiClientName: "default" }}>
      <SidebarProvider
        open={sidebarOpenState}
        onOpenChange={handleSidebarOpenChange}
      >
        <AppSidebar />
        <main className="ml-1 w-full px-4 pb-4">
          <Outlet />

          <Player
            className={cn(
              "border-border sticky bottom-0 z-50 min-h-[105px] w-full rounded-t-lg border-t px-6 pr-[calc(var(--spacing)*4+var(--sidebar-width-icon))] transition-all",
              sidebarOpenState &&
                "pr-[calc(var(--spacing)*4+var(--sidebar-width))]",
            )}
          />
        </main>
      </SidebarProvider>
    </ApiContext.Provider>
  );
}

const SIDEBAR_LOCAL_STORAGE_KEY = "sidebarOpenState";

export default Layout;
