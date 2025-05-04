import Home from "@/app/page";
import { ServiceProvider, Review, Category, Message, Conversation } from "@/types";
import { Droplet, Hammer, PaintBucket, Trash, Trees, Truck, Zap } from "lucide-react";

export const categories: Category[] = [
  { id: "1", name: "Moving", icon: Truck },
  { id: "2", name: "Landscaping", icon: Trees },
  { id: "3", name: "Roofing", icon: Home },
  { id: "4", name: "Cleaning", icon: Trash },
  { id: "5", name: "Plumbing", icon: Droplet },
  { id: "6", name: "Electrical", icon: Zap },
  { id: "7", name: "Painting", icon: PaintBucket },
  { id: "8", name: "Carpentry", icon: Hammer },
];
// : ServiceProvider[]
export const serviceProviders = [
  {
    id: "1",
    name: "John Smith",
    profileImage: "https://i.pravatar.cc/150?img=1",
    coverImage:
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop",
    location: "New York, NY",
    rating: 4.8,
    reviewCount: 124,
    hourlyRate: 75,
    description: "Professional mover with 10+ years of experience",
    serviceType: "Moving",
    portfolioImages: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&auto=format&fit=crop",
    ],
    about:
      "I specialize in residential and commercial moving services. With over a decade of experience, I ensure safe and efficient relocation of your belongings.",
    services: [
      {
        id: "101",
        name: "Local Moving",
        description: "Full-service local moving within the city",
        price: 150,
        duration: "4-6 hours",
      },
      {
        id: "102",
        name: "Packing Services",
        description: "Professional packing of all your belongings",
        price: 100,
        duration: "3-4 hours",
      },
      {
        id: "103",
        name: "Furniture Assembly",
        description: "Assembly and disassembly of furniture",
        price: 75,
        duration: "1-3 hours",
      },
    ],
    price: "40 $",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    profileImage: "https://i.pravatar.cc/150?img=5",
    coverImage:
      "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&auto=format&fit=crop",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviewCount: 89,
    hourlyRate: 65,
    description: "Expert landscaper creating beautiful outdoor spaces",
    serviceType: "Landscaping",
    portfolioImages: [
      "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599629954294-14df9ec8357e?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598902108854-10e335adac99?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1597844116362-d8cc293f147c?w=500&auto=format&fit=crop",
    ],
    about:
      "I transform ordinary yards into extraordinary landscapes. With a keen eye for design and plant selection, I create sustainable outdoor spaces that enhance the beauty of your property.",
    services: [
      {
        id: "201",
        name: "Garden Design",
        description: "Custom garden design and planning",
        price: 200,
        duration: "2-3 hours",
      },
      {
        id: "202",
        name: "Lawn Maintenance",
        description: "Regular lawn care and maintenance",
        price: 80,
        duration: "1-2 hours",
      },
      {
        id: "203",
        name: "Irrigation Installation",
        description: "Installation of efficient irrigation systems",
        price: 300,
        duration: "4-5 hours",
      },
    ],
    price: "20 $",
  },
  {
    id: "3",
    name: "Michael Davis",
    profileImage: "https://i.pravatar.cc/150?img=3",
    coverImage:
      "https://images.unsplash.com/photo-1632139368676-a0b3e4613e3f?w=800&auto=format&fit=crop",
    location: "Chicago, IL",
    rating: 4.7,
    reviewCount: 56,
    hourlyRate: 90,
    description: "Certified roofer specializing in repairs and installations",
    serviceType: "Roofing",
    portfolioImages: [
      "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622993006748-e0ab0bd1050a?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626890631686-28c800069c2a?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&auto=format&fit=crop",
    ],
    about:
      "I provide high-quality roofing services for residential and commercial properties. My team uses only premium materials to ensure durability and weather resistance.",
    services: [
      {
        id: "301",
        name: "Roof Inspection",
        description: "Comprehensive roof inspection and assessment",
        price: 120,
        duration: "1-2 hours",
      },
      {
        id: "302",
        name: "Roof Repair",
        description: "Repair of leaks and damaged areas",
        price: 350,
        duration: "3-6 hours",
      },
      {
        id: "303",
        name: "Roof Replacement",
        description: "Complete roof replacement with quality materials",
        price: 5000,
        duration: "2-3 days",
      },
    ],
    price: "50 $ ",
  },
  {
    id: "4",
    name: "Emily Wilson",
    profileImage: "https://i.pravatar.cc/150?img=10",
    coverImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop",
    location: "Houston, TX",
    rating: 4.6,
    reviewCount: 78,
    hourlyRate: 55,
    description: "Detail-oriented house cleaner for spotless results",
    serviceType: "Cleaning",
    portfolioImages: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&auto=format&fit=crop",
    ],
    about:
      "I offer professional cleaning services for homes and offices. Using eco-friendly products, I ensure a thorough clean that promotes a healthy living environment.",
    services: [
      {
        id: "401",
        name: "Deep Cleaning",
        description: "Thorough cleaning of all surfaces and areas",
        price: 180,
        duration: "4-5 hours",
      },
      {
        id: "402",
        name: "Regular Maintenance",
        description: "Weekly or bi-weekly cleaning service",
        price: 120,
        duration: "2-3 hours",
      },
      {
        id: "403",
        name: "Move-in/Move-out Cleaning",
        description: "Comprehensive cleaning for property transitions",
        price: 250,
        duration: "5-7 hours",
      },
    ],
    price: "50 $ ",
  },
];

export const reviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Robert Brown",
    userImage: "https://i.pravatar.cc/150?img=11",
    serviceProviderId: "1",
    rating: 5,
    comment:
      "John was punctual, efficient, and careful with our belongings. Highly recommend his moving services!",
    createdAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Amanda Garcia",
    userImage: "https://i.pravatar.cc/150?img=9",
    serviceProviderId: "1",
    rating: 4,
    comment: "Great service overall. The team was professional, although they arrived a bit late.",
    createdAt: "2024-01-22T16:45:00Z",
  },
  {
    id: "3",
    userId: "user3",
    userName: "David Chen",
    userImage: "https://i.pravatar.cc/150?img=12",
    serviceProviderId: "2",
    rating: 5,
    comment:
      "Sarah transformed our backyard into a beautiful garden. Her attention to detail is amazing!",
    createdAt: "2024-02-28T09:15:00Z",
  },
  {
    id: "4",
    userId: "user4",
    userName: "Jennifer Williams",
    userImage: "https://i.pravatar.cc/150?img=24",
    serviceProviderId: "3",
    rating: 4,
    comment: "Michael did a great job repairing our roof. Very knowledgeable and professional.",
    createdAt: "2024-03-05T11:30:00Z",
  },
  {
    id: "5",
    userId: "user5",
    userName: "Thomas Martin",
    userImage: "https://i.pravatar.cc/150?img=15",
    serviceProviderId: "4",
    rating: 5,
    comment: "Emily's cleaning service is exceptional. Our house has never looked better!",
    createdAt: "2024-02-10T13:20:00Z",
  },
];

export const conversations: Conversation[] = [
  {
    id: "conv1",
    participants: ["user1", "1"],
    lastMessage: {
      id: "msg1",
      senderId: "user1",
      receiverId: "1",
      content: "When can you come for the moving job?",
      timestamp: "2024-03-18T09:30:00Z",
      isRead: true,
    },
    updatedAt: "2024-03-18T09:30:00Z",
  },
  {
    id: "conv2",
    participants: ["user3", "2"],
    lastMessage: {
      id: "msg2",
      senderId: "2",
      receiverId: "user3",
      content: "I can start on your garden next Monday. Does that work for you?",
      timestamp: "2024-03-17T15:45:00Z",
      isRead: false,
    },
    updatedAt: "2024-03-17T15:45:00Z",
  },
];

export const messages: Record<string, Message[]> = {
  conv1: [
    {
      id: "msg1-1",
      senderId: "user1",
      receiverId: "1",
      content: "Hi John, I need help moving next weekend. Are you available?",
      timestamp: "2024-03-15T10:15:00Z",
      isRead: true,
    },
    {
      id: "msg1-2",
      senderId: "1",
      receiverId: "user1",
      content: "Hello! Yes, I have availability next weekend. What day works best for you?",
      timestamp: "2024-03-15T10:30:00Z",
      isRead: true,
    },
    {
      id: "msg1-3",
      senderId: "user1",
      receiverId: "1",
      content: "Saturday would be perfect. It's a 2-bedroom apartment.",
      timestamp: "2024-03-15T10:45:00Z",
      isRead: true,
    },
    {
      id: "msg1-4",
      senderId: "1",
      receiverId: "user1",
      content: "Saturday works. I'll need about 4-5 hours for a 2-bedroom. Does 9 AM work?",
      timestamp: "2024-03-15T11:00:00Z",
      isRead: true,
    },
    {
      id: "msg1-5",
      senderId: "user1",
      receiverId: "1",
      content: "When can you come for the moving job?",
      timestamp: "2024-03-18T09:30:00Z",
      isRead: true,
    },
  ],
  conv2: [
    {
      id: "msg2-1",
      senderId: "user3",
      receiverId: "2",
      content: "Hi Sarah, I'm interested in your garden design service.",
      timestamp: "2024-03-17T14:20:00Z",
      isRead: true,
    },
    {
      id: "msg2-2",
      senderId: "2",
      receiverId: "user3",
      content: "Great! Can you tell me more about your space and what you're looking for?",
      timestamp: "2024-03-17T14:35:00Z",
      isRead: true,
    },
    {
      id: "msg2-3",
      senderId: "user3",
      receiverId: "2",
      content:
        "I have a small backyard, about 500 sq ft. Looking for a low-maintenance garden with native plants.",
      timestamp: "2024-03-17T15:00:00Z",
      isRead: true,
    },
    {
      id: "msg2-4",
      senderId: "2",
      receiverId: "user3",
      content: "I can start on your garden next Monday. Does that work for you?",
      timestamp: "2024-03-17T15:45:00Z",
      isRead: false,
    },
  ],
};
