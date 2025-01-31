import { create } from "zustand";

interface appStore {}

export const useAppStore = create<appStore>(() => ({}));
