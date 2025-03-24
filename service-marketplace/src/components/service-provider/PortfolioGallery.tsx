'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PortfolioGalleryProps {
  images: string[];
  title: string;
}

const PortfolioGallery = ({ images, title }: PortfolioGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>

      {/* Main Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
              <div
                className="relative h-56 cursor-pointer overflow-hidden rounded-md"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image}
                  alt={`Portfolio image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform hover:scale-105"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative h-16 w-16 cursor-pointer overflow-hidden rounded-md shrink-0 transition-all ${
              currentImageIndex === index ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95">
          <div className="relative h-[80vh] w-full">
            {images.length > 0 && (
              <Image
                src={images[currentImageIndex]}
                alt={`Portfolio full view ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
              />
            )}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground hover:bg-background"
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center items-center gap-2 bg-background p-2">
            <span className="text-sm text-muted-foreground">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioGallery;
