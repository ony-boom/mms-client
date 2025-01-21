import "./styles/main.css";
import "@fontsource/manrope/index.css";
import { Outlet } from "react-router";
import { ApiContext } from "@/context/ApiContext.ts";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function Layout() {
  return (
    <ApiContext.Provider value={{ apiClientName: "default" }}>
      <SidebarProvider>
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

export default Layout;
