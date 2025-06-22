"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { TimePickerInput } from "@/components/ui/time-picker";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b last:border-b-0 dark:border-gray-700">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 px-2 text-left focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="font-medium text-base text-gray-900 dark:text-gray-100">{question}</span>
        {open ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-2 pb-4 text-gray-600 dark:text-gray-400 text-sm animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HirePageClient({
  provider,
  providerId,
}: {
  provider: ServiceProvider | null;
  providerId: string;
}) {
  const { data: session } = useSession();
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
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [locationInput, setLocationInput] = useState("");
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
    setUserInfo({ name: "John Doe", email: "john@example.com", phone: "" });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Date is required", { description: "Please select a date." });
      return;
    }
    if (!form.time) {
      toast.error("Time is required", { description: "Please select a time." });
      return;
    }

    setSubmitting(true);
    try {
      const [hours, minutes] = form.time.split(":").map(Number);
      const dateTime = new Date(selectedDate);
      dateTime.setHours(hours, minutes, 0, 0);

      const formData = new FormData();
      formData.append("providerId", providerId);
      formData.append("date", dateTime.toISOString());
      formData.append("time", form.time);
      formData.append("details", form.details);
      if (form.budget) formData.append("budget", form.budget);
      formData.append("location", form.location);
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
        toast.success("Booking requested!", {
          description: `Request sent to ${provider?.name}`,
        });
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        toast.error("Error", {
          description: data.error || "Failed to book",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error", { description: "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!provider) {
    return (
      <div className="flex justify-center items-center text-center mt-20 h-screen text-red-500">
        Provider not found. This can happen if the provider does not exist or if there was an error
        fetching their data.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 mt-20 mb-10">
      <div className="md:col-span-2">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-start gap-5 mb-4">
            <div className="flex items-center gap-5 w-full">
              <Avatar className="h-16 w-16">
                <AvatarImage src={provider.profileImage} alt={provider.name} />
                <AvatarFallback className="text-xl">{provider.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-bold text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  {provider.name}
                  <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                    Usually responds within an hour
                  </Badge>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-base">
                  {provider.serviceType}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {provider.rating}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">
                    ({provider.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="h-10 w-full md:w-auto">
              Message Before Hiring
            </Button>
          </div>
          <Separator className="mb-8" />
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                Select a Service
              </label>
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
                <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                  Date
                </label>
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
                <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <TimePickerInput
                    value={form.time}
                    onChange={(val) => setForm((f) => ({ ...f, time: val }))}
                    className="w-full pl-10"
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="details"
                className="block mb-2 font-semibold text-gray-800 dark:text-gray-200"
              >
                Project Details
              </label>
              <Textarea
                id="details"
                name="details"
                value={form.details}
                onChange={(e) => {
                  setForm({ ...form, details: e.target.value });
                  setCharCount(e.target.value.length);
                }}
                placeholder="Describe your project requirements, goals, and any specific details."
                maxLength={maxChars}
                className="min-h-[120px]"
              />
              <p className="text-right text-sm text-gray-500 mt-1">
                {charCount}/{maxChars}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="budget"
                  className="block mb-2 font-semibold text-gray-800 dark:text-gray-200"
                >
                  Budget ($)
                </label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                  Location
                </label>
                <Input
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setForm((f) => ({ ...f, location: e.target.value }));
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                Additional Services
              </label>
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="urgent"
                    onChange={(e) => {
                      const { checked, name } = e.target;
                      setAdditionalServices((prev) =>
                        checked ? [...prev, name] : prev.filter((s) => s !== name)
                      );
                    }}
                  />
                  Urgent booking
                </label>
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-200">
                Attachments (Up to 3 files)
              </label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              >
                <input {...getInputProps()} />
                {files.length > 0 ? (
                  <ul className="text-sm list-disc pl-5">
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                Your Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    readOnly
                    className="mt-1 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full mt-2 hover:opacity-90" disabled={submitting}>
              {submitting ? "Booking..." : `Request to ${provider.name}`}
            </Button>
          </form>
        </div>
      </div>
      <div className="col-span-2 space-y-8">
        <Card className="max-w-3xl mx-auto bg-gray-50 border-gray-200 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Why Choose Us?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Proven Expertise</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Exceptional quality and attention to detail.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  Personalized Service
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Tailored approach to meet your specific needs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Save Time</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Get matched with top talent quickly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                  Verified Professionals
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  We vet every service provider for quality and reliability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-3xl mx-auto mb-8 bg-gray-50 border-gray-200 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FAQItem
              question="What happens after I request a booking?"
              answer="The service provider will review your request and get back to you within 24 hours to confirm the details."
            />
            <FAQItem
              question="Can I cancel a booking?"
              answer="Yes, you can cancel up to 48 hours before the scheduled time for a full refund. Cancellations within 48 hours may be subject to a fee."
            />
            <FAQItem
              question="How do payments work?"
              answer="Payments are securely processed through our platform. You won't be charged until the booking is confirmed by the provider."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
