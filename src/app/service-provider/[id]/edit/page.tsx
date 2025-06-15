"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
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

interface EditServiceProviderPageProps {
  params: {
    id: string;
  };
}

export default function EditServiceProviderPage({ params }: EditServiceProviderPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
  const [existingData, setExistingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    shouldUnregister: false,
    defaultValues: {
      name: "",
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

  // Fetch existing service provider data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/service-providers/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setExistingData(data);

        // Pre-fill form with existing data
        form.reset({
          name: data.name,
          location: data.location,
          description: data.description,
          serviceType: data.serviceType,
          hourlyRate: data.hourlyRate,
          about: data.about,
          services: data.services,
        });

        // Set image previews
        if (data.coverImage) setCoverImagePreview(data.coverImage);
        if (data.portfolioImages) setPortfolioPreviews(data.portfolioImages);
      } catch (error) {
        toast.error("Failed to load service provider data");
        router.push(`/service-provider/${params.id}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, form, router]);

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

      const response = await fetch(`/api/service-providers/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Your service provider profile has been updated successfully!");
      router.push(`/service-provider/${params.id}`);
    } catch (error) {
      toast.error("Failed to update service provider profile");
    } finally {
      setSubmitting(false);
    }
  };

  const EditProviderContent = () => {
    if (isLoading) {
      return (
        <div className="container max-w-3xl py-10 mt-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading profile data...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container max-w-3xl py-10 mt-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Service Provider Profile</h1>
            <p className="text-muted-foreground">
              Update your service provider information and offerings
            </p>
          </div>

          <Separator />

          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Update Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Make changes to your service provider profile. All changes will be reflected
                  immediately.
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Provider Details</CardTitle>
              <CardDescription>Update your service information</CardDescription>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brief Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell customers about your services in a few words"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hourly Rate ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell customers more about yourself and your experience"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload Sections */}
                  <div className="space-y-4">
                    <div>
                      <Label>Cover Image</Label>
                      <div className="mt-2">
                        {coverImagePreview ? (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <Image
                              src={coverImagePreview}
                              alt="Cover preview"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeCoverImage}
                              className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
                            <Label
                              htmlFor="cover-upload"
                              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                            >
                              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Click to upload cover image
                              </span>
                            </Label>
                            <input
                              id="cover-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "cover")}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Portfolio Images (up to 5)</Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {portfolioPreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden"
                          >
                            <Image
                              src={preview}
                              alt={`Portfolio ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removePortfolioImage(index)}
                              className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {portfolioPreviews.length < 5 && (
                          <div className="flex items-center justify-center aspect-square border-2 border-dashed rounded-lg">
                            <Label
                              htmlFor="portfolio-upload"
                              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                            >
                              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Add portfolio image
                              </span>
                            </Label>
                            <input
                              id="portfolio-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, "portfolio")}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <EditProviderContent />
    </ProtectedRoute>
  );
}
