import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps = {}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isCollapsed={isSidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with collapse button */}
        <header className="h-16 bg-white border-b flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mr-4"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          {children || (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select an option from the sidebar
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
