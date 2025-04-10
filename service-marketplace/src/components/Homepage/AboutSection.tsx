// import React from "react";

// const AboutSection = () => {
//   return (
//     <div className="flex items-center justify-center">
//       <div className=""></div>
//       <div className="">
//         <h1 className="text-6xl font-bold tracking-wider">Where Trust Meets Talent</h1>
//         <p className="text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
//           We believe that finding the right professional should be as simple as a click. Built with
//           encrypted systems and secure messaging, our platform ensures that every interaction—from
//           first contact to job completion—is built on transparency, reliability, and mutual respect.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AboutSection;

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section className="w-full overflow-hidden my-12">
      <div className=" max-w-8xl mx-auto  rounded-lg ">
        <div className="flex flex-col md:flex-row ">
          <div className="relative w-full md:w-1/2 h-[400px] md:h-auto">
            {/* <div className="absolute inset-0 z-0">
              <div className="absolute top-16 left-12 z-10">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-300"></div>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Person image */}
            <div className=" h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1614127938540-a1139bee1841"
                alt="Laundry service professional"
                width={800}
                height={800}
                className="object-contain h-full rounded-r-lg"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Where Trust Meets Talent</h2>

            <p className=" mb-6">
              We believe that finding the right professional should be as simple as a click. Built
              with encrypted systems and secure messaging, our platform ensures that every
              interaction—from first contact to job completion—is built on transparency,
              reliability, and mutual respect.
            </p>

            <div>
              <Button className="px-12 py-8  font-medium rounded-lg text-xl" variant="outline">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
