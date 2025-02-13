import { User, Family } from "@/types/auth";

// Mock storage
let users: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin",
    role: "admin",
  },
  {
    id: "2",
    email: "user1@example.com",
    name: "User 1",
    role: "user",
    familyId: "1",
  },
  {
    id: "3",
    email: "user2@example.com",
    name: "User 2",
    role: "user",
    familyId: "1",
  },
];

let families: Family[] = [
  {
    id: "1",
    name: "Family 1",
    members: [users[1], users[2]],
    createdAt: new Date().toISOString(),
  },
];

export const auth = {
  validateToken: async (token: string) => {
    // In a real app, validate the token with your backend
    const userId = localStorage.getItem("userId");
    if (!userId) throw new Error("Invalid token");

    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    const family = families.find((f) => f.id === user.familyId);
    return { user, family, token };
  },

  login: async (email: string, password: string) => {
    // Simulate API call
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("Invalid credentials");

    const family = families.find((f) => f.id === user.familyId);
    const token = "mock-jwt-token";
    localStorage.setItem("userId", user.id);

    return { user, family, token };
  },

  logout: async () => {
    localStorage.removeItem("userId");
  },

  register: async (email: string, password: string, name: string) => {
    if (users.some((u) => u.email === email)) {
      throw new Error("Email already exists");
    }

    const newUser: User = {
      id: String(users.length + 1),
      email,
      name,
      role: "user",
    };

    users.push(newUser);
    const token = "mock-jwt-token";
    localStorage.setItem("userId", newUser.id);

    return { user: newUser, family: null, token };
  },

  getAllUsers: async () => {
    return users;
  },

  updateUser: async (userId: string, userData: Partial<User>) => {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    users[userIndex] = { ...users[userIndex], ...userData };
    const user = users[userIndex];
    const family = families.find((f) => f.id === user.familyId);

    return { user, family };
  },

  createFamily: async (name: string, memberIds: string[]) => {
    const familyId = String(families.length + 1);
    const members = users.filter((u) => memberIds.includes(u.id));

    const newFamily: Family = {
      id: familyId,
      name,
      members,
      createdAt: new Date().toISOString(),
    };

    // Update users with new familyId
    members.forEach((member) => {
      const userIndex = users.findIndex((u) => u.id === member.id);
      users[userIndex] = { ...users[userIndex], familyId };
    });

    families.push(newFamily);
    return newFamily;
  },

  deleteFamily: async (familyId: string) => {
    // Remove familyId from users
    users = users.map((user) =>
      user.familyId === familyId ? { ...user, familyId: undefined } : user,
    );

    families = families.filter((f) => f.id !== familyId);
  },

  addFamilyMember: async (familyId: string, userId: string) => {
    const family = families.find((f) => f.id === familyId);
    if (!family) throw new Error("Family not found");

    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    // Update user's familyId
    const userIndex = users.findIndex((u) => u.id === userId);
    users[userIndex] = { ...user, familyId };

    // Update family members
    const familyIndex = families.findIndex((f) => f.id === familyId);
    families[familyIndex] = {
      ...family,
      members: [...family.members, users[userIndex]],
    };

    return families[familyIndex];
  },

  removeFamilyMember: async (familyId: string, userId: string) => {
    const family = families.find((f) => f.id === familyId);
    if (!family) throw new Error("Family not found");

    // Remove familyId from user
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], familyId: undefined };
    }

    // Remove user from family members
    const familyIndex = families.findIndex((f) => f.id === familyId);
    families[familyIndex] = {
      ...family,
      members: family.members.filter((m) => m.id !== userId),
    };

    return families[familyIndex];
  },
};
