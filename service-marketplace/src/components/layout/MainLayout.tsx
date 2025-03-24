'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, MessageSquare, User, Home, Grid3X3, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/stores/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Marketplace', href: '/marketplace', icon: <Grid3X3 className="h-5 w-5" /> },
    { name: 'Messages', href: '/messages', icon: <MessageSquare className="h-5 w-5" /> },
  ];

  const authNavigationItems = user
    ? [
        { name: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
        ...user.isServiceProvider
          ? [{ name: 'My Services', href: `/service-provider/${user.serviceProviderId}`, icon: <Grid3X3 className="h-5 w-5" /> }]
          : [],
      ]
    : [];

  const allNavigationItems = [...navigationItems, ...authNavigationItems];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span className="text-primary">Service</span>
                    <span>Marketplace</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {allNavigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 text-base font-medium transition-colors hover:text-foreground/80 ${
                          pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}

                    {user && (
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 text-base font-medium"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </Button>
                    )}

                    {!user && (
                      <>
                        <Link
                          href="/login"
                          className={`flex items-center gap-2 text-base font-medium transition-colors hover:text-foreground/80 ${
                            pathname === '/login' ? 'text-foreground' : 'text-foreground/60'
                          }`}
                        >
                          <User className="h-5 w-5" />
                          Login
                        </Link>
                        <Link
                          href="/register"
                          className={`flex items-center gap-2 text-base font-medium transition-colors hover:text-foreground/80 ${
                            pathname === '/register' ? 'text-foreground' : 'text-foreground/60'
                          }`}
                        >
                          <User className="h-5 w-5" />
                          Register
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-1 font-bold text-xl md:gap-2">
              <span className="text-primary">Service</span>
              <span>Marketplace</span>
            </Link>
          </div>
          <div className="hidden flex-1 md:flex md:justify-center md:px-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services, categories, or providers..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {isMounted && theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Link href="/messages">
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 overflow-hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.profileImage}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground w-[200px] truncate text-sm">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {user.isServiceProvider && (
                    <DropdownMenuItem asChild>
                      <Link href={`/service-provider/${user.serviceProviderId}`}>My Services</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="container flex items-center md:hidden px-4 pb-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col gap-4 px-4 md:px-6">
          <div className="flex flex-col gap-2 md:flex-row md:justify-between">
            <div className="flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-1 font-bold text-xl md:gap-2">
                <span className="text-primary">Service</span>
                <span>Marketplace</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Find reliable service providers in your area
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">Company</h3>
                <nav className="flex flex-col gap-1">
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    About
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Careers
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Contact
                  </Link>
                </nav>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">Legal</h3>
                <nav className="flex flex-col gap-1">
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Terms
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Privacy
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Cookies
                  </Link>
                </nav>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">Support</h3>
                <nav className="flex flex-col gap-1">
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Help Center
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    FAQ
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:underline">
                    Contact Support
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Service Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="md:hidden">
                {isMounted && theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
