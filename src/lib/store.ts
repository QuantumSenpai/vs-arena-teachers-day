import { create } from "zustand";

export interface TeamConfig {
  name: string;
  image: string;
  color: string;
}

interface AppState {
  screen: "setup" | "battle";
  leftTeam: TeamConfig;
  rightTeam: TeamConfig;
  setScreen: (screen: "setup" | "battle") => void;
  updateLeftTeam: (config: Partial<TeamConfig>) => void;
  updateRightTeam: (config: Partial<TeamConfig>) => void;
  resetMatch: () => void;
}

const DEFAULT_LEFT: TeamConfig = {
  name: "Player 1",
  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
  color: "#3b82f6",
};

const DEFAULT_RIGHT: TeamConfig = {
  name: "Player 2",
  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
  color: "#ff0000",
};

export const useStore = create<AppState>((set) => ({
  screen: "setup",
  leftTeam: DEFAULT_LEFT,
  rightTeam: DEFAULT_RIGHT,

  setScreen: (screen) => set({ screen }),
  updateLeftTeam: (config) => set((state) => ({ leftTeam: { ...state.leftTeam, ...config } })),
  updateRightTeam: (config) => set((state) => ({ rightTeam: { ...state.rightTeam, ...config } })),

  // FIX 20: Fully clears match data, returns to setup screen, and purges browser storage
  resetMatch: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("vs-arena-state");
        localStorage.removeItem("vs-arena-storage");
        localStorage.removeItem("vs-arena-match");
        sessionStorage.clear();
      } catch (e) {
        console.warn("Storage clear error", e);
      }
    }
    set({
      screen: "setup",
      leftTeam: { name: "", image: "", color: "#3b82f6" },
      rightTeam: { name: "", image: "", color: "#ff0000" },
    });
  },
}));
