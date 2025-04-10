"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";

// Review type definition
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  serviceProviderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  serviceType?: string;
}

// Sample data
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
    serviceType: "Moving Assistance",
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
    serviceType: "House Cleaning",
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
    serviceType: "Landscaping",
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
    serviceType: "Plumbing",
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
    serviceType: "Personal Assistance",
  },
  {
    id: "6",
    userId: "user6",
    userName: "Annette Black",
    userImage: "https://i.pravatar.cc/150?img=5",
    serviceProviderId: "5",
    rating: 4.5,
    comment:
      "I needed someone to run errands for me while I was recovering from surgery. The personal assistant I hired was a lifesaver. She was reliable, friendly, and got everything done perfectly. This service is a game-changer.",
    createdAt: "2024-01-15T10:20:00Z",
    serviceType: "Personal Assistance",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-indigo-500 text-indigo-500" />
      ))}
      {hasHalfStar && <StarHalf className="w-5 h-5 fill-indigo-500 text-indigo-500" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-5 h-5 text-indigo-500" />
      ))}
    </div>
  );
};

const TestimonialCard = ({ review }: { review: Review }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-900 p-6 flex flex-col h-full"
    >
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
          <Image src={review.userImage} alt={review.userName} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-50">{review.userName}</h3>
          <RatingStars rating={review.rating} />
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-auto">{review.comment}</p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="inline-block px-3 py-1 bg-background text-gray-700 dark:text-gray-200 rounded-3xl text-sm">
          {review.serviceType}
        </span>
      </div>
    </motion.div>
  );
};

export default function TestimonialSection() {
  return (
    <section className="py-16 px-4 w-11/12 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div className="max-w-2xl mb-6 md:mb-0">
          <h2 className="text-4xl font-medium text-gray-200 dark:text-gray-400 mb-4">
            What Our Customers Are Saying
          </h2>
          <p className="text-gray-600">
            Discover why our clients love us! Read real testimonials from satisfied customers who
            have experienced our top-notch services and see how we've made their lives easier.
          </p>
        </div>

        <div className="flex items-center">
          <div className="mr-3">
            <div className="text-sm font-medium">Excellent</div>
            <div className="flex">
              <Star className="w-5 h-5 fill-indigo-500 text-indigo-500" />
              <Star className="w-5 h-5 fill-indigo-500 text-indigo-500" />
              <Star className="w-5 h-5 fill-indigo-500 text-indigo-500" />
              <Star className="w-5 h-5 fill-indigo-500 text-indigo-500" />
              <StarHalf className="w-5 h-5 fill-indigo-500 text-indigo-500" />
            </div>
          </div>
          <div className="text-indigo-600 font-medium flex items-center">
            <span className="mr-1">Trustpilot</span>
          </div>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {reviews.map((review) => (
          <TestimonialCard key={review.id} review={review} />
        ))}
      </motion.div>
    </section>
  );
}
