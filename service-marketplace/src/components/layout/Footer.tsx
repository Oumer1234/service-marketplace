"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const footerSections = {
    Company: [
      { label: "About Us", href: "/about" },
      { label: "All Services", href: "/services" },
      { label: "Features", href: "/features" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Careers", href: "/careers", badge: "We're Hiring" },
    ],
    Community: [
      { label: "Blog", href: "/blog" },
      { label: "Affiliate Program", href: "/affiliate" },
      { label: "Testimonials", href: "/testimonials" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Legals", href: "/legal" },
    ],
    Socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "X (Twitter)", href: "https://twitter.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "TikTok", href: "https://tiktok.com" },
    ],
    Categories: [
      { label: "Home Services", href: "/category/home" },
      { label: "Handyman Services", href: "/category/handyman" },
      { label: "Moving & Delivery", href: "/category/moving" },
      { label: "Personal Assistance", href: "/category/personal" },
      { label: "See All", href: "/categories" },
    ],
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 pb-8 ">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="text-2xl font-bold text-[#0B3B2D] dark:text-white">
              Service Marketplace
            </Link>
            <div className="mt-4 text-gray-600 dark:text-white">
              <p>48533 Canada</p>
              {/* <p>78251-2238</p> */}
              <p className="mt-2">+ 1-234-567-8900</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {Object.entries(footerSections).map(([title, links]) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-[#0B3B2D] dark:text-white">
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-[#0B3B2D] transition-colors duration-200 dark:text-gray-300"
                      >
                        {link.label}
                        {/* {link.badge && (
                          <span className="ml-2 bg-black text-white text-xs px-2 py-0.5 rounded">
                            {link.badge}
                          </span>
                        )} */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-200 pt-8 text-center text-gray-600 dark:text-gray-300"
        >
          <p>© 2025 Service Marketplace. All Right Reserved</p>
        </motion.div>
      </div>
    </footer>
  );
}
