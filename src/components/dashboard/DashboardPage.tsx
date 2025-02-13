import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, FileText, Settings } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card>
    <CardContent className="flex items-center p-6">
      <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="1,234"
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="Content Items"
          value="342"
          icon={<FileText className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="Active Users"
          value="573"
          icon={<BarChart className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="Settings"
          value="12"
          icon={<Settings className="h-4 w-4 text-primary" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "User John Doe registered",
                "New content item created",
                "Settings updated",
                "User profile modified",
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 bg-muted/50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  <p className="text-sm">{activity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "Add new user",
              "Create content",
              "Update settings",
              "View reports",
            ].map((action, i) => (
              <div
                key={i}
                className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium">{action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
