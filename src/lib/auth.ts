// This is a mock authentication service
// In a real application, you would integrate with a backend service

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

// Mock admin credentials - in a real app, these would be in a secure database
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

// Mock user storage
let users: User[] = [
  {
    id: "1",
    email: ADMIN_EMAIL,
    name: "Admin User",
    role: "admin",
  },
];

export const auth = {
  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          resolve(users[0]);
          return;
        }

        const user = users.find((u) => u.email === email);
        if (user) {
          // In a real app, you would hash and compare passwords
          resolve(user);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  },

  register: (email: string, password: string, name: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (users.some((u) => u.email === email)) {
          reject(new Error("Email already exists"));
          return;
        }

        const newUser: User = {
          id: String(users.length + 1),
          email,
          name,
          role: "user",
        };

        users.push(newUser);
        resolve(newUser);
      }, 1000);
    });
  },

  getAllUsers: (): Promise<User[]> => {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        resolve(users);
      }, 1000);
    });
  },

  deleteUser: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        users = users.filter((u) => u.id !== id);
        resolve();
      }, 1000);
    });
  },
};
