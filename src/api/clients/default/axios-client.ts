import axios from "axios";

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/graphql";

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

