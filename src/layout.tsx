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
            style={{
              // changing the width is weird, so we're changing the padding instead. I don't know how to do it with tailwind.
              paddingRight: `calc(100% - ${sidebarOpenState ? "var(--sidebar-width)" : "var(--sidebar-width-icon)"})`,
            }}
            className={cn(
              "border-border bg-background fixed bottom-0 z-50 h-12 w-full -translate-x-[20px] border-t px-4 transition-all",
            )}
          />
        </main>
      </SidebarProvider>
    </ApiContext.Provider>
  );
}

const SIDEBAR_LOCAL_STORAGE_KEY = "sidebarOpenState";

export default Layout;
