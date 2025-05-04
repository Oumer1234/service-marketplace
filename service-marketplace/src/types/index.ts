export interface ServiceProvider {
  id: string;
  userId: string;
  name: string;
  price: string;
  profileImage: string;
  coverImage: string;
  location: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  description: string;
  serviceType: string;
  portfolioImages: string[];
  about: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  serviceProviderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type SortOption = "rating" | "price_low" | "price_high" | "most_reviews";

export interface FilterOptions {
  location?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  availability?: string;
  sortBy?: SortOption;
}

// New user related types
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  profileImage?: string;
  role: UserRole;
  isServiceProvider: boolean;
  serviceProviderId?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "user" | "admin" | "service_provider";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  isServiceProvider: boolean;
  serviceProviderId?: string;
}

export interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  profileImage?: FileList;
}

export interface ServiceProviderFormData {
  name: string;
  location: string;
  description: string;
  serviceType: string;
  hourlyRate: number;
  about: string;
}
