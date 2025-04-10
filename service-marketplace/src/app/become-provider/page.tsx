"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Info } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { serviceProviderSchema } from "@/lib/formValidation";
import { ServiceProviderFormData } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { categories } from "@/lib/data";
import { toast } from "sonner";

export default function BecomeProviderPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    shouldUnregister: false, // ✅ Prevents fields from unmounting
    defaultValues: {
      name: user?.name || "",
      location: "",
      description: "",
      serviceType: "",
      hourlyRate: 50,
      about: "",
    },
  });

  const { isSubmitting } = form.formState; // ✅ Tracks submission state more efficiently

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        location: form.getValues("location"),
        description: form.getValues("description"),
        serviceType: form.getValues("serviceType"),
        hourlyRate: form.getValues("hourlyRate"),
        about: form.getValues("about"),
      });
    }
  }, [user]);

  const onSubmit = async (data: ServiceProviderFormData) => {
    try {
      setSubmitting(true);

      // In a real app this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        "Your service provider profile has been created. Welcome aboard!"
      );

      // In a real app, we would get the new provider ID from the API response
      // and redirect to the provider profile page
      router.push("/profile");

      setSubmitting(false);
    } catch (error) {
      toast.error("Failed to create service provider profile");
      setSubmitting(false);
    }
  };

  const BecomeProviderContent = () => (
    <div className="container max-w-3xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Become a Service Provider
          </h1>
          <p className="text-muted-foreground">
            Join our platform and start offering your services to customers
          </p>
        </div>

        <Separator />

        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Get Started in Minutes</h3>
              <p className="text-sm text-muted-foreground">
                Fill out the form below to create your service provider profile.
                Once approved, you can start adding services and receiving
                bookings.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Provider Details</CardTitle>
            <CardDescription>
              Enter information about your services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business/Display Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is how your name will appear to customers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the area where you provide services
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the main category of services you provide
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Your base hourly rate. You can create specific services
                        with different pricing later.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe your services"
                          className="resize-none"
                          rows={2}
                          {...field}
                          value={field.value ?? ""} // ✅ Ensures input remains controlled
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormDescription>
                        This will appear in search results and listings (max 150
                        characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About You</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell customers about your experience, qualifications, and expertise"
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide detailed information about your background and
                        services
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Profile...
                      </>
                    ) : (
                      "Create Provider Profile"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ProtectedRoute redirectTo="/login">
      <ProtectedRoute
        redirectTo="/profile"
        checkFunction={() => user?.isServiceProvider !== true}
      >
        <BecomeProviderContent key={user?.id || "new"} />
      </ProtectedRoute>
    </ProtectedRoute>
  );
}
