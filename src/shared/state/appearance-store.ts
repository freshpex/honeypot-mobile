import { create } from "zustand";

type AppearanceMode = "light" | "dark";

type AppearanceState = {
  mode: AppearanceMode;
  toggleMode: () => void;
};

export const useAppearanceStore = create<AppearanceState>((set) => ({
  mode: "light",
  toggleMode: () =>
    set((state) => ({ mode: state.mode === "light" ? "dark" : "light" })),
}));
