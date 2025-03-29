"use client";

import type React from "react";

import { Check, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check for system preference on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const darkModePreference = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(darkModePreference);

      // Apply dark class to html element
      if (darkModePreference) {
        document.documentElement.classList.add("dark");
      }
    }

    // Trigger animations after a small delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <div className="relative w-full min-h-[100vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16 transition-colors duration-500 overflow-hidden">

      {/* Animated grid background */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="w-full h-full animate-grid-fade-in"
          style={
            {
              backgroundImage: `
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
          `,
              backgroundSize: "calc(100% / 12) 80px",
              "--grid-color": isDarkMode
                ? "rgba(55, 65, 81, 1)"
                : "rgba(229, 231, 235, 1)",
            } as React.CSSProperties
          }
        ></div>

        {/* Animated grid dots */}
        <div
          className="absolute inset-0 w-full h-full animate-dots-fade-in opacity-70"
          style={
            {
              backgroundImage: `radial-gradient(circle, var(--dot-color) 1px, transparent 1px)`,
              backgroundSize: "calc(100% / 12) 80px",
              backgroundPosition: "calc(100% / 24) 40px",
              "--dot-color": isDarkMode
                ? "rgba(75, 85, 99, 1)"
                : "rgba(209, 213, 219, 1)",
            } as React.CSSProperties
          }
        ></div>
      </div>

      {/* Content box with animation */}
      <div
        className={`relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl dark:shadow-gray-950/20 max-w-3xl w-full mx-auto p-10 text-center transition-all duration-700 animate-float ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1
          className={`text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Find Expert Service Providers in Your Area
        </h1>
        <p
          className={`text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          Connect with skilled professionals for moving, landscaping, roofing,
          and more. Get personalized quotes and hire with confidence.
        </p>

        <div
          className={`flex flex-wrap gap-4 justify-center mb-10 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <Link
            href="#"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors animate-pulse-subtle relative overflow-hidden group"
          >
            <span className="relative z-10">Register for free</span>
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
          </Link>
          <Link
            href="#"
            className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 group"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            <span>Start free with Google</span>
          </Link>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-300 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex items-center gap-2 group">
            <Check className="h-4 w-4 text-gray-900 dark:text-white transition-transform duration-300 group-hover:scale-125" />
            <span>
              <span className="font-medium">Free forever</span> for basic
              features
            </span>
          </div>
          <div className="flex items-center gap-2 group">
            <Check className="h-4 w-4 text-gray-900 dark:text-white transition-transform duration-300 group-hover:scale-125" />
            <span>
              <span className="font-medium">Top-rated</span>
              professionals ready to help
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
