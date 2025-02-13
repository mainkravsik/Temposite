export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  familyId?: string;
}

export interface Family {
  id: string;
  name: string;
  members: User[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  family: Family | null;
  isLoading: boolean;
}
