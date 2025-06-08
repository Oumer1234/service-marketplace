"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Info, Upload, X } from "lucide-react";
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
import { serviceProviderSchema, ServiceProviderFormData } from "@/lib/formValidation";
import { useAuthStore } from "@/stores/authStore";
import { categories } from "@/lib/data";
import { toast } from "sonner";
import { useSession } from "@/hooks/use-session";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface Service {
  name: string;
  description: string;
  price: number;
  duration: string;
}

interface ServiceProviderFormValues {
  name: string;
  location: string;
  description: string;
  serviceType: string;
  hourlyRate: number;
  about: string;
  services: Service[];
}

export default function BecomeProviderPage() {
  const router = useRouter();
  // const { user } = useAuthStore();
  const { data, isPending } = useSession();
  const user = data?.user;
  const [submitting, setSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

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
      services: [
        {
          name: "",
          description: "",
          price: 0,
          duration: "1 hour",
        },
      ],
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
        services: form.getValues("services"),
      });
    }
  }, [form, user]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "portfolio"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "portfolio") {
      const newFiles = Array.from(files);
      if (portfolioImages.length + newFiles.length > 5) {
        toast.error("You can only upload up to 5 portfolio images");
        return;
      }
      setPortfolioImages((prev) => [...prev, ...newFiles]);

      // Create previews for new images
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPortfolioPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    } else if (type === "cover") {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Cover image must be less than 5MB");
        return;
      }
      setCoverImage(file);

      // Create preview for cover image
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
    setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview("");
  };

  const onSubmit = async (data: ServiceProviderFormData) => {
    try {
      setSubmitting(true);

      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (coverImage) formData.append("coverImage", coverImage);
      portfolioImages.forEach((file, index) => {
        formData.append(`portfolioImages`, file);
      });

      // In a real app, this would be an API call
      const response = await fetch("/api/service-providers", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create profile");

      toast.success("Your service provider profile has been created. Welcome aboard!");
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to create service provider profile");
    } finally {
      setSubmitting(false);
    }
  };

  const BecomeProviderContent = () => (
    <div className="container max-w-3xl py-10 mt-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Become a Service Provider</h1>
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
                Fill out the form below to create your service provider profile. Once approved, you
                can start adding services and receiving bookings.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Provider Details</CardTitle>
            <CardDescription>Enter information about your services</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <FormDescription>Enter the area where you provide services</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="flex items-center flex-col gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "cover")}
                      />
                      {coverImagePreview && (
                        <div className="relative w-full h-72">
                          <Image
                            src={coverImagePreview}
                            alt="Cover preview"
                            fill
                            className="object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={removeCoverImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload a cover image for your profile (max 5MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Portfolio Images</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, "portfolio")}
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload images showcasing your work (up to 5 images, max 5MB each)
                    </p>

                    {portfolioPreviews.length > 0 && (
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {portfolioPreviews.map((preview, index) => (
                          <div key={index} className="relative w-20 h-20">
                            <Image
                              src={preview}
                              alt={`Portfolio ${index + 1}`}
                              fill
                              className="object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removePortfolioImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <FormLabel>Base Hourly Rate (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Your base hourly rate. You can create specific services with different
                        pricing later.
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
                        />
                      </FormControl>
                      <FormDescription>
                        This will appear in search results and listings (max 150 characters)
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
                        Provide detailed information about your background and services
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Add Your Services</h3>
                  {form.getValues("services").map((_, index: number) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg">
                      <FormField
                        control={form.control}
                        name={`services.${index}.name` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.description` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`services.${index}.price` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (USD)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`services.${index}.duration` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 1 hour, 2 hours" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const currentServices = form.getValues("services");
                      form.setValue("services", [
                        ...currentServices,
                        {
                          name: "",
                          description: "",
                          price: 0,
                          duration: "1 hour",
                        },
                      ]);
                    }}
                  >
                    Add Another Service
                  </Button>
                </div>

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
      <ProtectedRoute redirectTo="/profile" checkFunction={() => user?.isServiceProvider !== true}>
        <BecomeProviderContent />
      </ProtectedRoute>
    </ProtectedRoute>
  );
}
