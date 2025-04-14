import { useAuthStore } from "@/stores/auth";

export const useAuth = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const authStore = useAuthStore();

  const auth = async (
    email: string,
    password: string,
    mode: "login" | "signup"
  ) => {
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    if (mode === "signup") {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    }

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || "Failed to authenticate. Check your login data."
      );
      throw error;
    }

    authStore.setAuthData({
      idToken: responseData.idToken,
      localId: responseData.localId,
      expiresIn: responseData.expiresIn,
    });
  };

  const logout = () => {
    authStore.logout();
  };

  return { auth, logout };
};
