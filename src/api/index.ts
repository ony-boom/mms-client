export * from "./types";
import { defaultApi, defaultRestApi } from "./clients";

export const apiClients = {
  default: defaultApi,
  defaultRest: defaultRestApi,
};
