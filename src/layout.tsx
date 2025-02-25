import "./styles/main.css";
import "@fontsource/manrope/index.css";
import { Outlet } from "react-router";
import { ApiContext } from "@/context/api-context";
import { AppTitle, Player, WithColorFlow } from "@/components";
import { Toaster } from "./components/ui/sonner";
import { AudioProvider } from "./context/audio-ref-context";
import { ThemeProvider } from "./context/theme";
import { apiClients } from "./api";

const DEFAULT_API_CLIENT: keyof typeof apiClients = "default";

function Layout() {
  return (
    <ApiContext.Provider value={{ apiClientName: DEFAULT_API_CLIENT }}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppTitle />
        <WithColorFlow>
          {/* <AppSidebar /> */}
          <main className="w-full">
            <AudioProvider>
              <Outlet />

              <Player />
              <Toaster />
            </AudioProvider>
          </main>
        </WithColorFlow>
      </ThemeProvider>
    </ApiContext.Provider>
  );
}

export default Layout;
