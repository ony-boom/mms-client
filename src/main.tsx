import Layout from "./Layout";
import { StrictMode } from "react";
import { AppRoutes } from "./route.types";
import { Home, Tracks, Albums } from "./pages";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path={AppRoutes.Tracks} element={<Tracks />} />
            <Route path={AppRoutes.Albums} element={<Albums />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
