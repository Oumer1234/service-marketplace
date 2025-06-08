"use client";

import { motion } from "framer-motion";
import { Search, Star } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Left from "@/assets/women.png";
import Right from "@/assets/right.png";
export default function Hero() {
  return (
    <div className="min-h-screen bg-[#21336e] pt-24 relative overflow-clip ">
      <div className="absolute bottom-0 right-[10%] w-full h-full">
        <Image src={Left} alt="left Image" className=" h-full object-cover" />
      </div>
      <div className="absolute bottom-0 left-[80%] w-full h-full ">
        <Image src={Right} alt="left Image" className=" h-full" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center text-white pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <div className="flex items-center justify-center space-x-2 mb-8">
              <span>Excellent</span>
              {/* <div className="bg-white flex items-center justify-center gap-2 py-2 px-3"> */}
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-blue-400 fill-current" />
              ))}
              {/* </div> */}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 max-w-4xl"
          >
            Find and Hire Top-Rated Experts for Any Task.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-300 mb-12 max-w-3xl"
          >
            Connect with skilled professionals for moving, landscaping, roofing, and more. Get
            personalized quotes and hire with confidence.{" "}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex w-full max-w-md gap-2 mb-16"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Find the perfect service you need"
                className="w-full pl-10 bg-sky-600 border-[#0a3528] text-white placeholder:text-gray-200 py-6 px-12 rounded-full"
              />
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700 cursor-pointer text-white font-semibold py-6 px-6 rounded-full relative z-10">
              Search
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <p className="text-sm text-gray-300 mb-4">
              Trusted by top companies to clean their offices
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-75">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
                width={100}
                height={30}
                className="brightness-0 invert"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Coinbase_logo.svg"
                alt="Coinbase"
                width={100}
                height={30}
                className="brightness-0 invert"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                alt="Google"
                width={100}
                height={30}
                className="brightness-0 invert"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg"
                alt="Microsoft"
                width={100}
                height={30}
                className="brightness-0 invert"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
