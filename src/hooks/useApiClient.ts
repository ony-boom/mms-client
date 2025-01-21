import { useContext } from "react";
import { apiClients } from "@/api";
import type { Api } from "@/api/Api.ts";
import { ApiContext } from "@/context/ApiContext";

export const useApiClient = (): Api => {
  const apiContext = useContext(ApiContext);

  return apiClients[apiContext.apiClientName];
};
