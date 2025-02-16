import "./styles/main.css";
import { useState } from "react";
import "@fontsource/manrope/index.css";
import { Outlet } from "react-router";
import { ApiContext } from "@/context/api-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppTitle, Player } from "@/components";
import { Toaster } from "./components/ui/sonner";
import { AudioProvider } from "./context/audio-ref-context";
import { ThemeProvider } from "./context/theme";

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
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppTitle />
        <SidebarProvider
          open={sidebarOpenState}
          onOpenChange={handleSidebarOpenChange}
        >
          {/* <AppSidebar /> */}
          <main className="w-full">
            <AudioProvider>
              <Outlet />

              <Player />
              <Toaster theme="light" />
            </AudioProvider>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </ApiContext.Provider>
  );
}

const SIDEBAR_LOCAL_STORAGE_KEY = "sidebarOpenState";

export default Layout;
