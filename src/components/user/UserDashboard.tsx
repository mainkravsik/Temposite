import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserDashboard() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <Card className="max-w-2xl mx-auto bg-white">
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a user dashboard placeholder. More features coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
