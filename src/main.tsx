import Layout from "./layout";
import { StrictMode } from "react";
// import { AppRoutes } from "./route.types";
import { Tracks } from "./pages";
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
            {/* <Route index element={<Home />} /> */}
            <Route index element={<Tracks />} />
            {/* <Route path={AppRoutes.Albums} element={<Albums />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
