/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import {
  Loader2,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  FileText,
  User,
  Briefcase,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  ArrowLeft,
  MessageCircle,
  Star,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format } from "date-fns";
import { IBooking } from "@/models/booking";
import { ServiceProviderDocument } from "@/models/ServiceProvider";
import { User as UserType } from "@/types";
import { toast } from "sonner";

type PopulatedBooking = IBooking & {
  providerId: ServiceProviderDocument & { user: UserType };
  seekerId: UserType;
};

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [booking, setBooking] = useState<PopulatedBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const bookingId = params.bookingId;

  // Helper function to check if file is an image
  const isImageFile = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Helper function to get image attachments
  const getImageAttachments = () => {
    return booking?.attachments?.filter(isImageFile) || [];
  };

  // Helper function to get non-image attachments
  const getNonImageAttachments = () => {
    return booking?.attachments?.filter((url) => !isImageFile(url)) || [];
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setDialogOpen(true);
  };

  useEffect(() => {
    if (bookingId) {
      async function fetchBooking() {
        try {
          const res = await fetch(`/api/booking/${bookingId}`);
          if (!res.ok) {
            throw new Error("Failed to fetch booking details");
          }
          const data = await res.json();
          setBooking(data);
        } catch (error) {
          console.error(error);
          toast.error("Could not load booking details.");
        } finally {
          setLoading(false);
        }
      }
      fetchBooking();
    }
  }, [bookingId]);

  const handleUpdateStatus = async (status: "accepted" | "rejected") => {
    setIsUpdating(true);
    toast.loading("Updating booking status...");

    try {
      const res = await fetch(`/api/booking/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update booking status");
      }

      const updatedBooking = await res.json();
      setBooking(updatedBooking);
      toast.success(`Booking has been ${status}.`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Could not update booking status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          variant: "secondary" as const,
          icon: Clock,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          textColor: "text-yellow-800",
        };
      case "accepted":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          color: "bg-green-100 text-green-800 border-green-200",
          textColor: "text-green-800",
        };
      case "rejected":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          color: "bg-red-100 text-red-800 border-red-200",
          textColor: "text-red-800",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: Clock,
          color: "bg-gray-100 text-gray-800 border-gray-200",
          textColor: "text-gray-800",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The booking you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isProvider = session?.user?.id === booking.providerId.user._id.toString();
  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  const { providerId: provider, seekerId: seeker } = booking;

  return (
    <div className="mt-12 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-8 max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-white/80 dark:hover:bg-gray-800/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Service request for{" "}
                <span className="font-semibold text-primary">{provider.name}</span> from{" "}
                <span className="font-semibold text-primary">{seeker.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={`px-4 py-2 text-sm font-medium border-2 ${statusConfig.color}`}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details Card */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <FileText className="h-5 w-5 text-primary" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {booking.details}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Booking Information */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Calendar className="h-5 w-5 text-primary" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Date</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {format(new Date(booking.date), "EEEE, MMMM do, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Time</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {booking.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {booking.budget && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Budget
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            ${booking.budget}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          Location
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {booking.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            {booking.attachments && booking.attachments.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Attachments ({booking.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Image Attachments */}
                  {getImageAttachments().length > 0 && (
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium text-gray-700">Images</h4>

                      {/* Main Carousel */}
                      <Carousel className="w-full">
                        <CarouselContent>
                          {getImageAttachments().map((image, index) => (
                            <CarouselItem
                              key={index}
                              className="basis-full md:basis-1/2 lg:basis-1/3"
                            >
                              <div
                                className="relative h-56 cursor-pointer overflow-hidden rounded-lg border border-gray-200"
                                onClick={() => openLightbox(index)}
                              >
                                <img
                                  src={image}
                                  alt={`Attachment image ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>

                      {/* Thumbnails */}
                      <div className="flex overflow-x-auto gap-2 pb-2">
                        {getImageAttachments().map((image, index) => (
                          <div
                            key={index}
                            className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-md shrink-0 transition-all border-2 ${
                              currentImageIndex === index ? "border-primary" : "border-gray-200"
                            }`}
                            onClick={() => openLightbox(index)}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Non-Image Attachments */}
                  {getNonImageAttachments().length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-700">Files</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {getNonImageAttachments().map((file, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start h-auto p-4 hover:bg-primary/5 hover:border-primary/30"
                            asChild
                          >
                            <a href={file} target="_blank" rel="noopener noreferrer">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Download className="h-4 w-4 text-primary" />
                                </div>
                                <div className="text-left">
                                  <p className="font-medium text-gray-900">File {index + 1}</p>
                                  <p className="text-sm text-gray-500">Click to download</p>
                                </div>
                              </div>
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lightbox for Images */}
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95">
                      <div className="relative h-[80vh] w-full">
                        {getImageAttachments().length > 0 && (
                          <img
                            src={getImageAttachments()[currentImageIndex]}
                            alt={`Attachment full view ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain"
                          />
                        )}
                        <button
                          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background"
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === 0 ? getImageAttachments().length - 1 : prev - 1
                            )
                          }
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background"
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === getImageAttachments().length - 1 ? 0 : prev + 1
                            )
                          }
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="flex justify-center items-center gap-2 bg-background p-2">
                        <span className="text-sm text-muted-foreground">
                          {currentImageIndex + 1} / {getImageAttachments().length}
                        </span>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <User className="h-5 w-5 text-primary" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Avatar className="h-20 w-20 mx-auto mb-3">
                    <AvatarImage src={seeker.profileImage} alt={seeker.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {seeker.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {seeker.name}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{seeker.email}</span>
                  </div>

                  {booking.seekerInfo?.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {booking.seekerInfo.phone}
                      </span>
                    </div>
                  )}
                </div>

                <Button className="w-full mt-4" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Service Provider */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Service Provider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Avatar className="h-20 w-20 mx-auto mb-3">
                    <AvatarImage src={provider.user.profileImage} alt={provider.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {provider.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {provider.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{provider.serviceType}</p>
                </div>

                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">(4.0)</span>
                </div>

                <Button className="w-full" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Provider
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons for Provider */}
            {isProvider && booking.status === "pending" && (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
                    Respond to Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleUpdateStatus("accepted")}
                      disabled={isUpdating}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Accept Booking
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateStatus("rejected")}
                      disabled={isUpdating}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Decline Booking
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                    You have 24 hours to respond to this booking request
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
