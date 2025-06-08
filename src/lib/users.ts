import { User } from '@/types';

// Mock user data for demo purposes
export const users: User[] = [
  {
    id: 'user1',
    email: 'johndoe@example.com',
    name: 'John Doe',
    password: '$2a$10$kIhNiZikbKhKEbvNhHlK8OZ.3VXMcxDAJ.7EsE1lR8YOGCDhnL.Uy', // hashed 'Password123'
    profileImage: 'https://i.pravatar.cc/150?img=60',
    role: 'user',
    isServiceProvider: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 'user2',
    email: 'janesmith@example.com',
    name: 'Jane Smith',
    password: '$2a$10$kIhNiZikbKhKEbvNhHlK8OZ.3VXMcxDAJ.7EsE1lR8YOGCDhnL.Uy', // hashed 'Password123'
    profileImage: 'https://i.pravatar.cc/150?img=45',
    role: 'user',
    isServiceProvider: false,
    createdAt: '2024-01-02T11:30:00Z',
    updatedAt: '2024-01-02T11:30:00Z'
  },
  {
    id: 'sp1',
    email: 'johnsmith@example.com',
    name: 'John Smith',
    password: '$2a$10$kIhNiZikbKhKEbvNhHlK8OZ.3VXMcxDAJ.7EsE1lR8YOGCDhnL.Uy', // hashed 'Password123'
    profileImage: 'https://i.pravatar.cc/150?img=1',
    role: 'service_provider',
    isServiceProvider: true,
    serviceProviderId: '1',
    createdAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-03T09:15:00Z'
  },
  {
    id: 'sp2',
    email: 'sarahjohnson@example.com',
    name: 'Sarah Johnson',
    password: '$2a$10$kIhNiZikbKhKEbvNhHlK8OZ.3VXMcxDAJ.7EsE1lR8YOGCDhnL.Uy', // hashed 'Password123'
    profileImage: 'https://i.pravatar.cc/150?img=5',
    role: 'service_provider',
    isServiceProvider: true,
    serviceProviderId: '2',
    createdAt: '2024-01-04T14:45:00Z',
    updatedAt: '2024-01-04T14:45:00Z'
  },
  {
    id: 'admin1',
    email: 'admin@example.com',
    name: 'Admin User',
    password: '$2a$10$kIhNiZikbKhKEbvNhHlK8OZ.3VXMcxDAJ.7EsE1lR8YOGCDhnL.Uy', // hashed 'Password123'
    profileImage: 'https://i.pravatar.cc/150?img=70',
    role: 'admin',
    isServiceProvider: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Helper functions to work with users data
export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const validatePassword = (
  password: string,
  hashedPassword: string
): boolean => {
  // In a real app, we would use bcrypt.compare(password, hashedPassword)
  // For this mock implementation, we'll just check if hash matches our known hash
  return hashedPassword === '$2a$10$kIhNiZikbKhKEbvNhHlK8OZ.3VXMcxDAJ.7EsE1lR8YOGCDhnL.Uy';
};

export const getUserSession = (user: User) => {
  // Create a session object without sensitive information
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
