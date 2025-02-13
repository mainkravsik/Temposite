import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Family, AuthState } from "@/types/auth";
import { auth } from "@/lib/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    family: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("authToken");
    if (token) {
      auth
        .validateToken(token)
        .then(({ user, family }) => {
          setState({
            user,
            family,
            isLoading: false,
          });
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          setState({ user: null, family: null, isLoading: false });
        });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { user, family, token } = await auth.login(email, password);
    localStorage.setItem("authToken", token);
    setState({ user, family, isLoading: false });
  };

  const logout = async () => {
    await auth.logout();
    localStorage.removeItem("authToken");
    setState({ user: null, family: null, isLoading: false });
  };

  const register = async (email: string, password: string, name: string) => {
    const { user, family, token } = await auth.register(email, password, name);
    localStorage.setItem("authToken", token);
    setState({ user, family, isLoading: false });
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!state.user) return;
    const { user, family } = await auth.updateUser(state.user.id, userData);
    setState((prev) => ({ ...prev, user, family }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
