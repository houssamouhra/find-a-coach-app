import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface AuthData {
  idToken: string | null;
  localId: string | null;
  expiresIn: string | null;
}

let logoutTimer: ReturnType<typeof setTimeout>;

export const useAuthStore = defineStore("auth", () => {
  const userId = ref<string | null>(null);
  const token = ref<null | string>(null);
  const tokenExpiration = ref<string | null>(null);
  const didAutoLogout = ref<boolean>(false);

  // const safeToken = computed(() => {
  //   if (!token.value) {
  //     throw new Error("No token — user not authenticated.");
  //   }
  //   return token.value;
  // });

  // const safeUserId = computed(() => {
  //   if (!userId.value) throw new Error("No user ID found");
  //   return userId.value as string;
  // });

  const setAuthData = (payload: AuthData) => {
    userId.value = payload.localId;
    token.value = payload.idToken;
    tokenExpiration.value = payload.expiresIn;

    const expiresInMs = +payload.expiresIn! * 1000;
    const expirationDate = new Date().getTime() + expiresInMs;

    localStorage.setItem("token", payload.idToken || "");
    localStorage.setItem("userId", payload.localId || "");
    localStorage.setItem("tokenExpiration", expirationDate.toString());

    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      autoLogout();
    }, expiresInMs);

    didAutoLogout.value = false;
  };

  const clearAuth = () => {
    userId.value = null;
    token.value = null;
    tokenExpiration.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");
    clearTimeout(logoutTimer);
  };

  const logout = () => {
    clearAuth();
    didAutoLogout.value = false;
  };

  const autoLogout = () => {
    logout();
    didAutoLogout.value = true;
  };

  const tryLogin = () => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedTokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = +storedTokenExpiration! - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    token.value = storedToken;
    userId.value = storedUserId;
    tokenExpiration.value = storedTokenExpiration;
    didAutoLogout.value = false;

    logoutTimer = setTimeout(() => {
      autoLogout();
    }, expiresIn);
  };

  const isAuthenticated = computed(() => !!token.value);

  return {
    userId,
    token,
    tokenExpiration,
    // safeToken,
    // safeUserId,
    isAuthenticated,
    setAuthData,
    tryLogin,
    clearAuth,
    logout,
    didAutoLogout,
  };
});
