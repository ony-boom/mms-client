import "./styles/main.css";
import { useState } from "react";
import "@fontsource/manrope/index.css";
import { Outlet } from "react-router";
import { AppSidebar, Player, TrackLoadToast } from "@/components";
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
        <main className="ml-1 w-full">
          <div className="mb-12 min-h-screen">
            <Outlet />
          </div>

          <Player />
          <TrackLoadToast />
        </main>
      </SidebarProvider>
    </ApiContext.Provider>
  );
}

const SIDEBAR_LOCAL_STORAGE_KEY = "sidebarOpenState";

export default Layout;
