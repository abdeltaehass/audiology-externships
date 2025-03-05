import { UserModel } from "@/types";
import { persistNSync } from "persist-and-sync";
import { create } from "zustand";

export type AuthenticatedState = {
  user: UserModel;
  isAuthenticated: true;
};

export type UnauthenticatedState = {
  user: null;
  isAuthenticated: false | null;
};

export type CombinedAuthState = AuthenticatedState | UnauthenticatedState;

export type AuthStore<AuthState = CombinedAuthState> = {
  updateUser: (data: UserModel) => void;
  signIn: (data: UserModel) => void;
  signOut: () => void;
} & AuthState;

export const useAuthStore = create<AuthStore>(
  persistNSync(
    (set) => ({
      user: null,
      isAuthenticated: null,
      updateUser: (data) => {
        set((state) => ({
          user: { ...state.user, ...data },
        }));
      },
      signIn: (data) => {
        set((state) => ({
          ...state,
          user: data,
          isAuthenticated: true,
        }));
      },
      signOut: () => set({ user: null, isAuthenticated: null }),
    }),
    { name: "auth", storage: "localStorage", initDelay: 0 }
  )
);
