/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
// CHANGE: Imported useFieldArray to properly manage dynamic form fields.
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Info, Upload, X, Plus } from "lucide-react";
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

// CHANGE: Removed the duplicate ServiceProviderFormValues interface. We will use ServiceProviderFormData from Zod.
// CHANGE: Moved the BecomeProviderContent component outside of the main component to prevent re-creation on every render.
const BecomeProviderContent = ({
  form,
  onSubmit,
  coverImage,
  setCoverImage,
  coverImagePreview,
  setCoverImagePreview,
  portfolioImages,
  setPortfolioImages,
  portfolioPreviews,
  setPortfolioPreviews,
}: any) => {
  // Using 'any' for props for simplicity here, but you can define a proper props interface.
  // CHANGE: Destructured isSubmitting directly from form state. This is the canonical way.
  const { isSubmitting } = form.formState;

  // CHANGE: useFieldArray hook is now the source of truth for the services array.
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

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
      setPortfolioImages((prev: File[]) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPortfolioPreviews((prev: string[]) => [...prev, reader.result as string]);
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePortfolioImage = (index: number) => {
    setPortfolioImages((prev: File[]) => prev.filter((_, i) => i !== index));
    setPortfolioPreviews((prev: string[]) => prev.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview("");
  };

  // CHANGE: Simplified functions to use `append` and `remove` from useFieldArray.
  const addNewService = () => {
    append({
      name: "",
      description: "",
      price: 0,
      duration: "1 hour",
    });
  };

  const removeService = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("You must have at least one service");
    }
  };

  return (
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
                            // CHANGE: Coerce value to number to prevent Zod errors.
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                      {/* {portfolioPreviews.map((preview, index) => ( */}
                      {portfolioPreviews.map((preview: string, index: number) => (
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
                            multiple // Allow multiple files selection
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "portfolio")}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Services</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addNewService}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Service
                    </Button>
                  </div>
                  {/* CHANGE: Looping over `fields` from useFieldArray. */}
                  {/* Using `field.id` as the key is crucial for React to handle animations and state correctly. */}
                  {fields.map((field, index) => (
                    <Card key={field.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Service {index + 1}</CardTitle>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeService(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`services.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Basic Cleaning" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`services.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe what this service includes"
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
                            name={`services.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    {...field}
                                    // CHANGE: Coerce value to number to prevent Zod errors.
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value) || 0)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`services.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="30 minutes">30 minutes</SelectItem>
                                    <SelectItem value="1 hour">1 hour</SelectItem>
                                    <SelectItem value="2 hours">2 hours</SelectItem>
                                    <SelectItem value="3 hours">3 hours</SelectItem>
                                    <SelectItem value="4 hours">4 hours</SelectItem>
                                    <SelectItem value="Full day">Full day</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* CHANGE: Using `isSubmitting` from react-hook-form for the disabled state. */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function BecomeProviderPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // CHANGE: Removed the redundant `submitting` state.
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

  const form = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    // CHANGE: The `shouldUnregister: false` is often not needed with `useFieldArray` and can be removed if it causes issues. Keeping it for now.
    shouldUnregister: false,
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

  // CHANGE: This useEffect is now much cleaner and more efficient.
  // It only runs when `user` data changes and uses `setValue` for a targeted update
  // without re-rendering the whole form or overwriting other user inputs.
  useEffect(() => {
    if (user && user.name && !form.getValues("name")) {
      form.setValue("name", user.name);
    }
  }, [user, form]);

  const onSubmit = async (data: ServiceProviderFormData) => {
    // CHANGE: No need for `setSubmitting(true)` here. RHF handles it.
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (coverImage) formData.append("coverImage", coverImage);
      portfolioImages.forEach((file) => {
        formData.append(`portfolioImages`, file);
      });

      const response = await fetch("/api/service-providers", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create profile");

      toast.success("Your service provider profile has been created. Welcome aboard!");
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to create service provider profile");
    }
    // CHANGE: No need for a `finally` block to set submitting state.
  };

  return (
    <ProtectedRoute>
      {/* CHANGE: Pass all necessary state and functions as props to the extracted component. */}
      <BecomeProviderContent
        form={form}
        onSubmit={onSubmit}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        coverImagePreview={coverImagePreview}
        setCoverImagePreview={setCoverImagePreview}
        portfolioImages={portfolioImages}
        setPortfolioImages={setPortfolioImages}
        portfolioPreviews={portfolioPreviews}
        setPortfolioPreviews={setPortfolioPreviews}
      />
    </ProtectedRoute>
  );
}
