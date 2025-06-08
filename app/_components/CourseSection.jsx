//app\_components\CourseSection.jsx
"use client"
import { useRef } from 'react';
import Button from '../_ui/Button';
import CourseTile from './CourseTile';
import CustomLink from './CustomLink';

const CourseSection = ({ course_data }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-100 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-900 mb-3 sm:mb-4 md:mb-6">
            Latest Courses
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most recent and popular courses tailored for modern learning.
          </p>
        </div>

        {/* Courses Grid - Single Row Scrollable */}
        {course_data?.length ? (
          <div className="relative mb-8 sm:mb-10 md:mb-12">
            {/* Scroll Container */}
            <div 
              ref={scrollRef}
              className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] sm:auto-cols-[minmax(320px,1fr)] lg:auto-cols-[minmax(350px,1fr)] gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x snap-mandatory"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {course_data.map((course, index) => (
                <div
                  key={index}
                  className="snap-start transition-all duration-300 transform hover:-translate-y-2 hover:shadow-l"
                >
                  <CourseTile course={course} />
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Hidden on mobile, shown on desktop */}
            {course_data.length > 3 && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 bg-white/90 backdrop-blur-sm p-2 lg:p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all items-center justify-center z-10"
                  aria-label="Previous course"
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 bg-white/90 backdrop-blur-sm p-2 lg:p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all items-center justify-center z-10"
                  aria-label="Next course"
                >
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Scroll Indicators - Mobile Only */}
            <div className="flex md:hidden justify-center mt-4 gap-1">
              {course_data.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              No courses available at the moment.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Check back soon for new learning opportunities!
            </p>
          </div>
        )}

        {/* View All Button */}
        {course_data?.length > 0 && (
          <div className="flex justify-center">
            <CustomLink href="/course">
              <Button
                variant="tertiary"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 text-sm sm:text-base font-medium sm:font-semibold"
              >
                View All Courses
              </Button>
            </CustomLink>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseSection;
