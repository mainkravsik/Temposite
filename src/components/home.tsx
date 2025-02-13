import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import ContentTable from "./content/ContentTable";
import ContentForm from "./content/ContentForm";
import LoginForm from "./auth/LoginForm";
import { auth } from "@/lib/auth";
import RegisterForm from "./auth/RegisterForm";
import UserDashboard from "./user/UserDashboard";

interface HomeProps {
  isAuthenticated?: boolean;
}

export default function Home({ isAuthenticated = false }: HomeProps) {
  const [showContentForm, setShowContentForm] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null,
  );
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const user = await auth.login(data.email, data.password);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    setIsLoading(true);
    try {
      const user = await auth.register(data.email, data.password, data.name);
      setUser(user);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    if (showRegister) {
      return (
        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          onLoginClick={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        onRegisterClick={() => setShowRegister(true)}
      />
    );
  }

  if (user.role !== "admin") {
    return <UserDashboard />;
  }

  const handleEdit = (id: string) => {
    setSelectedContentId(id);
    setShowContentForm(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete content:", id);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setShowContentForm(false);
    setSelectedContentId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {showContentForm ? (
          <ContentForm
            initialData={
              selectedContentId
                ? {
                    title: "Sample Content",
                    description: "Sample Description",
                    slug: "sample-content",
                    content: "Sample content text",
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
          />
        ) : (
          <ContentTable onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </AdminLayout>
  );
}
