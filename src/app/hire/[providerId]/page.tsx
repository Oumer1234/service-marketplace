"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ServiceProvider } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, User, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { TimePickerInput } from "@/components/ui/time-picker";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

async function fetchProvider(providerId: string) {
  const res = await fetch(`/api/service-providers/${providerId}`);
  if (!res.ok) throw new Error("Failed to fetch provider");
  return res.json();
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 px-2 text-left focus:outline-none hover:bg-gray-50 transition"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-medium text-base text-gray-900">{question}</span>
        {open ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {open && <div className="px-2 pb-4 text-gray-600 text-sm animate-fade-in">{answer}</div>}
    </div>
  );
}

export default function HirePage({ params }: { params: { providerId: string } }) {
  const { providerId } = params;
  const [provider, setProvider] = React.useState<ServiceProvider | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = useState({
    date: "",
    time: "",
    service: "",
    details: "",
    budget: "",
    location: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [locationInput, setLocationInput] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 300;
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
    multiple: true,
    maxFiles: 3,
  });

  React.useEffect(() => {
    fetchProvider(providerId)
      .then((data) => setProvider(data))
      .catch(() => setProvider(null))
      .finally(() => setLoading(false));
  }, [providerId]);

  // Prefill user info if logged in (mock for now)
  React.useEffect(() => {
    // TODO: Replace with real session/user fetch
    setUserInfo({ name: "John Doe", email: "john@example.com", phone: "" });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (val: string) => {
    setLocationInput(val);
    setForm((f) => ({ ...f, location: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast({
        title: "Date is required",
        description: "Please select a date.",
        variant: "destructive",
      });
      return;
    }
    if (!form.time) {
      toast({
        title: "Time is required",
        description: "Please select a time.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const dateTime = new Date(selectedDate.toDateString() + "T" + form.time);
      const formData = new FormData();
      formData.append("providerId", providerId);
      formData.append("date", dateTime.toISOString());
      formData.append("time", form.time);
      formData.append("details", form.details);
      if (form.budget) formData.append("budget", form.budget);
      formData.append("location", form.location);
      formData.append("locationDetails", locationDetails);
      formData.append("service", form.service);
      formData.append("seekerInfo", JSON.stringify(userInfo));
      additionalServices.forEach((s) => formData.append("additionalServices", s));
      files.forEach((file) => formData.append("attachments", file));
      const res = await fetch("/api/booking", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Booking requested!", description: `Request sent to ${provider?.name}` });
        setTimeout(() => router.push("/"), 1800);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to book",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (!provider)
    return (
      <div className="flex justify-center items-center text-center mt-20 h-screen text-red-500">
        Provider not found.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-20 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      {/* Top Section: Provider Overview */}
      <div className="flex items-center gap-5 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={provider.profileImage} alt={provider.name} />
          <AvatarFallback className="text-xl">{provider.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-bold text-2xl text-gray-900 flex items-center gap-2">
            {provider.name}
            <Badge className="ml-2 bg-green-100 text-green-700">
              Usually responds within 24hrs
            </Badge>
          </div>
          <div className="text-gray-500 text-base">{provider.serviceType}</div>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-medium text-gray-700">{provider.rating}</span>
            <span className="text-gray-400 text-sm">({provider.reviewCount} reviews)</span>
          </div>
        </div>
        <Button variant="outline" className="h-10">
          Message Before Hiring
        </Button>
      </div>
      <Separator className="mb-8" />
      {/* Booking Form Section */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2 font-semibold text-gray-800">Select a Service</label>
          <Select
            value={form.service}
            onValueChange={(value) => setForm((f) => ({ ...f, service: value }))}
            required
          >
            <SelectTrigger className="w-full focus:ring-2 focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent>
              {provider.services.map((service, index) => (
                <SelectItem key={index} value={service.name} className="hover:bg-gray-100">
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-800">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={
                    "w-full justify-start text-left font-normal " +
                    (!selectedDate ? "text-muted-foreground" : "")
                  }
                >
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <TimePickerInput
                      label="Time"
                      value={form.time}
                      onChange={(val) => setForm((f) => ({ ...f, time: val }))}
                      className="w-full"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Choose a preferred time for your booking</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <label className="block mb-2 font-semibold text-gray-800">Location</label>
                  <Input
                    type="text"
                    className="w-full"
                    placeholder="Enter address or location"
                    value={locationInput}
                    onChange={(e) => {
                      setLocationInput(e.target.value);
                      setForm((f) => ({ ...f, location: e.target.value }));
                    }}
                    required
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>Enter your location or address</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <label className=" mb-2 font-semibold text-gray-800 flex items-center gap-2">
            Describe what you need
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-gray-400 cursor-pointer">?</span>
                </TooltipTrigger>
                <TooltipContent>Be as detailed as possible for better service</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Textarea
            name="details"
            value={form.details}
            onChange={(e) => {
              setForm({ ...form, details: e.target.value });
              setCharCount(e.target.value.length);
            }}
            required
            rows={3}
            maxLength={maxChars}
            className="w-full"
            placeholder="Describe what you need..."
          />
          <div className="text-right text-xs text-gray-400">
            {charCount}/{maxChars} characters
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-800">Budget (optional)</label>
            <Input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              min="0"
              className="w-full"
              placeholder="e.g. 200"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-800">Additional Services</label>
            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={additionalServices.includes("Packaging help")}
                  onChange={(e) =>
                    setAdditionalServices((prev) =>
                      e.target.checked
                        ? [...prev, "Packaging help"]
                        : prev.filter((s) => s !== "Packaging help")
                    )
                  }
                />
                Packaging help
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={additionalServices.includes("Urgent booking")}
                  onChange={(e) =>
                    setAdditionalServices((prev) =>
                      e.target.checked
                        ? [...prev, "Urgent booking"]
                        : prev.filter((s) => s !== "Urgent booking")
                    )
                  }
                />
                Urgent booking
              </label>
            </div>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-800">Attachments (optional)</label>
          {(() => {
            const rootProps = getRootProps();
            const mergedClassName =
              "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition " +
              (rootProps.className || "");
            return (
              <div {...rootProps} className={mergedClassName}>
                <input {...getInputProps()} />
                {files.length === 0 ? (
                  <span className="text-gray-400">
                    Drag & drop files here, or click to select files
                  </span>
                ) : (
                  <ul className="text-left text-sm">
                    {files.map((file) => (
                      <li key={file.name}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })()}
        </div>
        {/* Prefilled user info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Your Name</label>
            <Input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Email</label>
            <Input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800">Phone (optional)</label>
            <Input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            />
          </div>
        </div>
        {/* Bottom Section: Submission & Confirmation */}
        <Button type="submit" className="w-full mt-2 hover:opacity-90" disabled={submitting}>
          {submitting ? "Booking..." : `Request to ${provider.name}`}
        </Button>
        <div className="text-center text-xs text-gray-500 mt-2">
          Secure request. Your contact info stays private.
        </div>
      </form>
      <Separator className="my-10" />
      {/* Why Choose Section */}
      <div className="mb-10">
        <h2 className="font-bold text-xl mb-6 text-gray-900">Why Choose {provider.name}?</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/90 p-3 rounded-lg flex items-center justify-center">
              <Star className="text-white w-7 h-7" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Proven Expertise</div>
              <div className="text-gray-500 text-base">
                Exceptional quality and attention to detail.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/90 p-3 rounded-lg flex items-center justify-center">
              <User className="text-white w-7 h-7" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Personalized Service</div>
              <div className="text-gray-500 text-base">
                Tailored approach to meet your specific needs.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/90 p-3 rounded-lg flex items-center justify-center">
              <Clock className="text-white w-7 h-7" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Timely Delivery</div>
              <div className="text-gray-500 text-base">
                Delivered stunning results ahead of schedule.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-10" />
      {/* FAQ Section */}
      <div>
        <h2 className="font-bold text-xl mb-6 text-gray-900">Frequently Asked Questions</h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50">
          <FAQItem
            question="What's included in the package?"
            answer="You'll receive a comprehensive service tailored to your needs. Details depend on the selected service."
          />
          <FAQItem
            question="How long does the service take?"
            answer="Service duration varies by type. Most are completed within the agreed timeframe."
          />
          <FAQItem
            question="What's your cancellation policy?"
            answer="You can cancel up to 24 hours before the scheduled time for a full refund."
          />
        </div>
      </div>
      {/* Seeker Description */}
      {provider.description && (
        <div className="mb-10">
          <h2 className="font-bold text-lg mb-2 text-gray-900">About the Provider</h2>
          <p className="text-gray-700 text-base bg-gray-50 rounded-lg p-4 border border-gray-100">
            {provider.description}
          </p>
        </div>
      )}
      {/* Reviews Section */}
      {provider.reviewCount > 0 && provider.reviews && (
        <div className="mb-10">
          <h2 className="font-bold text-lg mb-4 text-gray-900">Reviews</h2>
          <div className="space-y-4">
            {provider.reviews.slice(0, 3).map((review, idx) => (
              <Card key={idx} className="border border-gray-200">
                <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.userImage} alt={review.userName} />
                    <AvatarFallback>{review.userName?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-semibold">{review.userName}</CardTitle>
                    <CardDescription className="text-xs text-gray-500">
                      {format(new Date(review.createdAt), "PPP")}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
                    <span className="text-gray-400 text-xs">({review.rating})</span>
                  </div>
                  <div className="text-gray-700 text-sm">{review.comment}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
