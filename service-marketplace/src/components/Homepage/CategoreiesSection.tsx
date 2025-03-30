"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Grid3X3,
  Briefcase,
  ShoppingBag,
  Utensils,
  Code,
  Palette,
  Camera,
  Music,
  BookOpen,
  HeartPulse,
  Home,
  Truck,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Assuming this is your categories array structure
const categories = [
  { id: "business", name: "Business" , icon: Briefcase},
  { id: "shopping", name: "Shopping" , icon: ShoppingBag},
  { id: "food", name: "Food & Dining" ,icon : Utensils},
  { id: "technology", name: "Technology" , icon: Code},
  { id: "design", name: "Design" ,icon: Palette},
  { id: "photography", name: "Photography" , icon: Camera},
  { id: "music", name: "Music" ,icon:Music },
  { id: "education", name: "Education" ,icon:BookOpen },
  { id: "health", name: "Health & Wellness" ,icon:HeartPulse },
  { id: "home", name: "Home Services" , icon:Home },
  { id: "delivery", name: "Delivery" , icon:Truck}, 
  { id: "beauty", name: "Beauty" , icon:Scissors },
];

export default function CategoriesSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-3">
              Explore Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover top-rated service providers across various categories
              tailored to your needs
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          whileInView={isLoaded ? "show" : "hidden"}
        >
          {categories.map((category) => {
            const IconComponent = category.icon

            return (
              <motion.div key={category.id} variants={item}>
                <Link
                  href={`/marketplace?category=${category.id}`}
                  className="block h-full"
                >
                  <div
                    className={`relative h-full group rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden 
                      hover:ring-2 hover:ring-indigo-500 hover:dark:ring-indigo-100"
                        
                    `}
                    // onMouseEnter={() => setActiveCategory(category.id)}
                    // onMouseLeave={() => setActiveCategory(null)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 flex flex-col items-center text-center h-full">
                      <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 " />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {category.name}
                      </h3>
                      <div className="mt-auto pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronRight className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mx-auto" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="/marketplace">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 py-6 h-auto rounded-full shadow-md hover:shadow-lg transition-all duration-300 group">
              <span>View all categories</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
