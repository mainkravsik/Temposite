import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./components/home";
import DashboardPage from "./components/dashboard/DashboardPage";
import UsersPage from "./components/users/UsersPage";
import SettingsPage from "./components/settings/SettingsPage";
import BudgetPage from "./components/budget/BudgetPage";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import routes from "tempo-routes";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <BudgetPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <SettingsPage />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <AppRoutes />
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
