import "./styles/main.css";
import { useState } from "react";
import "@fontsource/manrope/index.css";
import { Outlet } from "react-router";
import { ApiContext } from "@/context/ApiContext.ts";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
        <main className="px-4 py-2 w-full">
          <SidebarTrigger />
          <div className="ml-1 mt-2">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </ApiContext.Provider>
  );
}

const SIDEBAR_LOCAL_STORAGE_KEY = "sidebarOpenState";

export default Layout;
