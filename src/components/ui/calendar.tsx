"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

function Calendar({ className, ...props }: React.ComponentProps<typeof DayPicker>) {
  return <DayPicker className={cn("p-3 bg-white rounded-lg shadow-md", className)} {...props} />;
}

export { Calendar };
