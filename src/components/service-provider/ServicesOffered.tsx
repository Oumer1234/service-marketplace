"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, ChevronRight } from "lucide-react";
import { Service } from "@/types";

interface ServicesOfferedProps {
  services: Service[];
  title?: string;
}

const ServicesOffered = ({ services, title = "Services Offered" }: ServicesOfferedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} className="hidden md:flex">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} className="hidden md:flex">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {services.map((service, index) => (
          <Card key={index} className="min-w-[300px] max-w-[350px] flex-shrink-0 snap-start">
            <CardContent className="p-4">
              <h4 className="font-semibold text-lg">{service.name}</h4>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                {service.description}
              </p>
              <div className="mt-4 flex justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-semibold">${service.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{service.duration}</span>
                </div>
              </div>
              <Button className="mt-4 w-full">Book Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesOffered;
