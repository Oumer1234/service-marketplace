/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);

    // Auto-cycle through steps
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Search",
      description: "Browse categories or search for the specific service you need",
      icon: Search,
      color: "from-sky-500 to-indigo-600",
      bgColor: "bg-sky-50 dark:bg-sky-950/30",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      number: 2,
      title: "Connect",
      description: "Message providers directly to discuss your project needs",
      icon: MessageSquare,
      color: "from-indigo-500 to-teal-900",
      bgColor: "bg-teal-50 dark:bg-teal-950/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      number: 3,
      title: "Hire",
      description: "Book services with confidence knowing you've found the right pro",
      icon: CheckCircle,
      color: "from-sky-500 to-teal-600",
      bgColor: "bg-sky-50 dark:bg-sky-950/30",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
  ];

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.gray.100),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,theme(colors.gray.800/30),transparent_70%)]"></div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-poppins">
            How It{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Works
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find and hire service providers in just a few simple steps
          </p>
        </motion.div>

        <div className="relative h-[500px] md:h-[320px] mb-8 p-8 " ref={containerRef}>
          <AnimatePresence initial={false}>
            {steps.map((step, index) => {
              // Calculate position based on active step
              let position = index - activeStep;
              if (position < -1) position += steps.length;
              if (position > 1) position -= steps.length;

              return (
                <motion.div
                  key={step.number}
                  className="absolute top-0 w-full md:w-[350px] h-full "
                  initial={{
                    opacity: 0,
                    x: position > 0 ? 300 : -300,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: position === 0 ? 1 : 0.7,
                    x: position === 0 ? 0 : position * 400,
                    scale: position === 0 ? 1 : 0.8,
                    zIndex: position === 0 ? 10 : 5,
                    left: position === 0 ? "50%" : position < 0 ? "25%" : "52%",
                    translateX: position === 0 ? "-50%" : "0%",
                  }}
                  exit={{
                    opacity: 0,
                    x: position < 0 ? -300 : 300,
                    scale: 0.8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div
                    className={`
                    h-full  p-8  rounded-2xl transition-all duration-300
                    ${
                      position === 0
                        ? "bg-white dark:bg-gray-800 shadow-2xl"
                        : "bg-white/80 dark:bg-gray-800/50 shadow-md"
                    }
                    ${step.bgColor}
                    flex flex-col items-center text-center
                  `}
                  >
                    <div className="relative mb-6">
                      <div
                        className={`
                        flex h-20 w-20 items-center justify-center rounded-full
                        bg-gradient-to-br ${step.color} text-white
                      `}
                      >
                        <step.icon className="h-10 w-10" />
                      </div>

                      {/* <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-md border-2 border-indigo-600 dark:border-indigo-400">
                        {step.number}
                      </div> */}
                    </div>

                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{step.description}</p>

                    {position === 0 && (
                      <motion.div
                        className="mt-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="inline-flex items-center justify-center px-4 py-2 mb-4 rounded-full  text-white font-medium">
                          Step {step.number} of {steps.length}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-2 border-gray-300 dark:border-gray-700"
            onClick={prevStep}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous step</span>
          </Button>

          <div className="flex gap-2">
            {steps.map((step, index) => (
              <button
                key={step.number}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  activeStep === index
                    ? "bg-sky-600 dark:bg-sky-400 w-8"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => setActiveStep(index)}
                aria-label={`Go to step ${step.number}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-2 border-gray-300 dark:border-gray-700"
            onClick={nextStep}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next step</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
