"use client";

import { motion } from "framer-motion";
import { Grid3X3, LogOut, Menu, Moon, Search, Sun, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { NavUser } from "./NavUser";
import { getUserSession } from "@/lib/users";
import { useSession } from "@/hooks/use-session";
import { SignOut } from "../auth/sign-out";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState<typeof User | null>(null);

  console.log("session : ", session);

  // useEffect(() => {
  //   if (session) setUser(session?.user);
  // }, [session, isPending]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/blog", label: "Blog" },
    { href: "/marketplace", label: "Marketplace" },
  ];

  // const authNavigationItems = user
  //   ? [
  //       { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
  //       ...(session?.user.isServiceProvider
  //         ? [
  //             {
  //               name: "My Services",
  //               href: `/service-provider/${session?.user.serviceProviderId}`,
  //               icon: <Grid3X3 className="h-5 w-5" />,
  //               label: "My Services",
  //             },
  //           ]
  //         : []),
  //     ]
  //   : [];

  // const allNavigationItems = [...navLinks, ...authNavigationItems];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-[#0B3B2D]/30 backdrop-blur-lg text-white py-4"
    >
      <div className="w-11/12 mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              Service
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-sky-300 transition">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              // <NavUser user={session.user} />
              <SignOut />
            ) : (
              <Button
                className="text-white rounded-full text-md bg-sky-500/80 hover:bg-sky-500/40 backdrop-blur-xl hidden md:block"
                size="lg"
                onClick={() => router.push("/login")}
              >
                Login / Register
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden md:flex">
              {isMounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#0B3B2D] text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg hover:text-sky-300 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4">
                    {session ? (
                      <SignOut />
                    ) : (
                      <Button
                        className="text-white rounded-full text-md bg-sky-500/40 backdrop-blur-xl "
                        size="lg"
                        onClick={() => router.push("/login")}
                      >
                        Login / Register
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="flex md:hidden"
                    >
                      {isMounted && theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
