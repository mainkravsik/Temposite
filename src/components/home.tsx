import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import ContentTable from "./content/ContentTable";
import ContentForm from "./content/ContentForm";
import LoginForm from "./auth/LoginForm";

interface HomeProps {
  isAuthenticated?: boolean;
}

export default function Home({ isAuthenticated = false }: HomeProps) {
  const [showContentForm, setShowContentForm] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    null,
  );

  if (!isAuthenticated) {
    return (
      <LoginForm onSubmit={(data) => console.log("Login attempt:", data)} />
    );
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
