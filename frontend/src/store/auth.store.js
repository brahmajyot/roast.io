import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  accessToken: null,

  setAuth: (data) =>
    set({
      user: data.user,

      accessToken:
        data.accessToken,
    }),

  logout: () =>
    set({
      user: null,

      accessToken: null,
    }),
}));

export default useAuthStore;