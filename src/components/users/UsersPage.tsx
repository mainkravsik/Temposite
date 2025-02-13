import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Trash2, UserCog, Users as UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CreateFamilyDialogProps {
  onSubmit: (name: string, memberIds: string[]) => void;
  users: User[];
}

function CreateFamilyDialog({ onSubmit, users }: CreateFamilyDialogProps) {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, selectedUsers);
    setName("");
    setSelectedUsers([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UsersIcon className="mr-2 h-4 w-4" />
          Create Family
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Family</DialogTitle>
          <DialogDescription>
            Create a new family and add members to it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Family Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter family name"
            />
          </div>
          <div className="space-y-2">
            <Label>Select Members</Label>
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={user.id}
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers([...selectedUsers, user.id]);
                    } else {
                      setSelectedUsers(
                        selectedUsers.filter((id) => id !== user.id),
                      );
                    }
                  }}
                />
                <label htmlFor={user.id}>
                  {user.name} ({user.email})
                </label>
              </div>
            ))}
          </div>
          <Button type="submit" disabled={!name || selectedUsers.length === 0}>
            Create Family
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await auth.getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFamily = async (name: string, memberIds: string[]) => {
    try {
      await auth.createFamily(name, memberIds);
      await loadUsers();
      toast({
        title: "Success",
        description: "Family created successfully",
      });
    } catch (error) {
      console.error("Failed to create family:", error);
      toast({
        title: "Error",
        description: "Failed to create family",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await auth.deleteUser(id);
      await loadUsers(); // Reload the users list
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage your users here</p>
        </div>
        <div className="space-x-2">
          <Button>
            <UserCog className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <CreateFamilyDialog
            onSubmit={handleCreateFamily}
            users={users.filter((u) => !u.familyId)}
          />
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.familyId ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          Family Member
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                          No Family
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === "admin"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
