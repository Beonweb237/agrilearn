import { create } from "zustand";

interface AppState {
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Offline mode
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;

  // Active category filter
  activeCategory: string;
  setActiveCategory: (category: string) => void;

  // Toast notifications
  toast: { message: string; type: "success" | "error" | "info" } | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),

  isOffline: false,
  setIsOffline: (offline) => set({ isOffline: offline }),

  activeCategory: "all",
  setActiveCategory: (category) => set({ activeCategory: category }),

  toast: null,
  showToast: (message, type = "info") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  clearToast: () => set({ toast: null }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
