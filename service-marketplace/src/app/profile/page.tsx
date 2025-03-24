'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Camera, Loader2, ArrowRight } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { profileUpdateSchema } from '@/lib/formValidation';
import { ProfileFormData } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setUpdatingProfile(true);
      // In a real app this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Profile updated successfully');
      setUpdatingProfile(false);
    } catch (error) {
      toast.error('Failed to update profile');
      setUpdatingProfile(false);
    }
  };

  const ProfileContent = () => (
    <div className="container max-w-4xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and profile
          </p>
        </div>

        <Separator />

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.profileImage} alt={user?.name || ''} />
                <AvatarFallback>
                  {user?.name.split(' ').map(n => n[0]).join('') || ''}
                </AvatarFallback>
              </Avatar>

              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-background"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload profile picture</span>
              </Button>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs uppercase tracking-wide">
                {user?.role === 'admin'
                  ? 'Administrator'
                  : user?.role === 'service_provider'
                    ? 'Service Provider'
                    : 'User'}
              </p>
            </div>
          </div>

          {user?.isServiceProvider && (
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Service Provider Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    You have a service provider account
                  </p>
                </div>
                <Link href={`/service-provider/${user.serviceProviderId}`}>
                  <Button size="sm" variant="outline" className="gap-1">
                    Manage services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account details and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" disabled />
                          </FormControl>
                          <FormDescription>
                            Your email cannot be changed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password to secure your account
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter your current password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showCurrentPassword ? 'Hide password' : 'Show password'}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter your new password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showNewPassword ? 'Hide password' : 'Show password'}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters and include uppercase, lowercase and numbers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your new password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {showConfirmPassword ? 'Hide password' : 'Show password'}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={updatingProfile}>
                      {updatingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {user && !user.isServiceProvider && (
            <Card>
              <CardHeader>
                <CardTitle>Become a Service Provider</CardTitle>
                <CardDescription>
                  Start offering your services on our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  As a service provider, you can list your services, receive bookings,
                  and earn money by helping others with your skills.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/become-provider">
                  <Button>
                    Become a Service Provider
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
