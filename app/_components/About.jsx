//app\_components\About.jsx
'use client';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-purple-50"
      id="about-us"
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          
          {/* Image Section */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative w-full max-w-md lg:max-w-none">
              <img
                src="/images/about.jpg"
                alt="About Us"
                className="rounded-xl sm:rounded-2xl object-cover w-full h-auto shadow-lg sm:shadow-xl hover:scale-105 transition-transform duration-300"
              />
              {/* Decorative element */}
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl sm:rounded-2xl opacity-50"></div>
            </div>
          </motion.div>

          {/* Text Section */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 text-blue-900 drop-shadow-md">
              About Us
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-indigo-700 font-semibold mb-3 sm:mb-4 lg:mb-6">
              Our Mission: Empowering Lifelong Learners Globally
            </p>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              We aim to revolutionize education by providing a platform that bridges theory and practice. 
              Our focus is on creating accessible, engaging, and inclusive learning experiences that foster 
              growth, innovation, and collaboration for learners and educators worldwide.
            </p>

            {/* Additional content for better mobile experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-blue-800 text-sm sm:text-base mb-2">
                  Accessible Learning
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Education available anytime, anywhere
                </p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-blue-800 text-sm sm:text-base mb-2">
                  Expert Instructors
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Learn from industry professionals
                </p>
              </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-blue-800 text-sm sm:text-base mb-2">
                  Interactive Content
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Engage with hands-on exercises and real-world projects
                </p>
              </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-blue-800 text-sm sm:text-base mb-2">
                  Certification & Career Support
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Get certified and receive job guidance from mentors
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;