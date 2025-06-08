//app\_components\HeroSection.jsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import CustomLink from "./CustomLink";
import Button from "../_ui/Button";

const AnimatedText = () => {
  const words = [
    "Learn Web Development",
    "Master Machine Learning",
    "Explore Docker",
    "Access 20+ Courses",
    "Earn Certificates",
  ];

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="mt-2 h-8 sm:h-10 relative text-indigo-600 font-semibold text-lg sm:text-xl md:text-2xl">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute left-0 right-0"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const images = [
  "/images/welcome.png",
  "/images/image1.webp",
  "/images/image2.webp",
  "/images/image3.jpg",
  "/images/img4.jpg",
  "/images/img5.webp",
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 bg-gradient-to-r from-purple-50 via-white to-indigo-50 min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] flex items-center">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          
          {/* Text Section */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Welcome to 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> LumiED</span>
            </h1>

            <AnimatedText />

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mt-4 max-w-xl mx-auto lg:mx-0">
              This e-learning platform transforms online education with interactive courses tailored for
              engineering students and beyond. Featuring personalized learning paths, progress tracking,
              certifications, and tools like live classrooms and forums, it fosters collaboration.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <CustomLink href="/course">
                <Button 
                  variant="primary" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Explore Courses
                </Button>
              </CustomLink>
              <CustomLink href="/auth">
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                >
                  Get Started Free
                </Button>
              </CustomLink>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">20+</h3>
                <p className="text-xs sm:text-sm text-gray-600">Courses</p>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">1000+</h3>
                <p className="text-xs sm:text-sm text-gray-600">Students</p>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600">100%</h3>
                <p className="text-xs sm:text-sm text-gray-600">Online</p>
              </div>
            </div>
          </motion.div>

          {/* Image Slideshow Section */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative w-full h-full max-w-lg lg:max-w-none">
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[currentImage]}
                  src={images[currentImage]}
                  alt="LumiEd showcase"
                  className="rounded-lg sm:rounded-xl shadow-xl object-cover w-full h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
              
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentImage 
                        ? "bg-white w-8" 
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;