import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  WatchComponent,
  watchComponents,
  ComponentType,
} from "@/data/watchComponents";

export interface WatchConfig {
  case: string;
  dial: string;
  hands: string;
  bezel: string;
}

interface WatchState {
  config: WatchConfig;
  savedConfigs: { name: string; config: WatchConfig }[];
  rotating: boolean;
  zoom: number;
  selectedTab: ComponentType;

  // Actions
  setComponent: (type: ComponentType, id: string) => void;
  saveConfig: (name: string) => void;
  loadConfig: (index: number) => void;
  deleteConfig: (index: number) => void;
  setRotating: (rotating: boolean) => void;
  setZoom: (zoom: number) => void;
  setSelectedTab: (tab: ComponentType) => void;
  resetConfig: () => void;

  // Selectors
  getSelectedComponent: (type: ComponentType) => WatchComponent | undefined;
  getComponentById: (
    type: ComponentType,
    id: string
  ) => WatchComponent | undefined;
}

// Default watch configuration
const defaultConfig: WatchConfig = {
  case: "case_skx007",
  dial: "dial_black",
  hands: "hands_standard",
  bezel: "bezel_steel",
};

export const useWatchStore = create<WatchState>()(
  persist(
    (set, get) => ({
    
      config: { ...defaultConfig },
      savedConfigs: [],
      rotating: true,
      zoom: 5,
      selectedTab: "case",

      setComponent: (type, id) => {
        set((state) => ({
          config: {
            ...state.config,
            [type]: id,
          },
        }));
      },

      saveConfig: (name) => {
        set((state) => ({
          savedConfigs: [
            ...state.savedConfigs,
            { name, config: { ...state.config } },
          ],
        }));
      },

      loadConfig: (index) => {
        const { savedConfigs } = get();
        if (index >= 0 && index < savedConfigs.length) {
          set({ config: { ...savedConfigs[index].config } });
        }
      },

      deleteConfig: (index) => {
        set((state) => ({
          savedConfigs: state.savedConfigs.filter((_, i) => i !== index),
        }));
      },

      setRotating: (rotating) => set({ rotating }),

      setZoom: (zoom) => set({ zoom }),

      setSelectedTab: (tab) => set({ selectedTab: tab }),

      resetConfig: () => set({ config: { ...defaultConfig } }),

      getSelectedComponent: (type) => {
        const { config } = get();
        const componentId = config[type];
        return watchComponents[type].find((c) => c.id === componentId);
      },

      getComponentById: (type, id) => {
        return watchComponents[type].find((c) => c.id === id);
      },
    }),
    {
      name: "watch-configurator",
    }
  )
);
