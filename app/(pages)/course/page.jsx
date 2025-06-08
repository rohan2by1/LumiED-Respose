//app\(pages)\course\page.jsx
"use client";
import CourseTile from "@/app/_components/CourseTile";
import Loader from "@/app/_components/Loader";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";

const Page = () => {
  const [courseData, setCourseData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("popularity");

  useEffect(() => {
    getCourseData();
  }, []);

  const getCourseData = async () => {
    try {
      const res = await fetch(`/api/course`);
      const data = await res.json();
      setCourseData(data?.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourseData([]);
    }
  };

  const filteredCourses = useMemo(() => {
    if (!courseData) return [];
    let filtered = courseData.filter((course) =>
      course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Simple sorting logic
    switch (sortOption) {
      case "title":
        filtered.sort((a, b) => a.course_title.localeCompare(b.course_title));
        break;
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, courseData, sortOption]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header with title and search */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Explore Courses
            </h1>
          </div>

          {/* Search and Sort - Always visible */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1 sm:max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg py-2.5 pl-10 sm:pl-12 pr-10 text-sm sm:text-base text-gray-800 placeholder-gray-400 font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                aria-label="Search courses"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              )}
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-lg py-2.5 px-3 sm:px-4 border border-gray-300 bg-white text-sm sm:text-base text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {courseData && (
          <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-2 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
                <span className="font-semibold">{courseData.length}</span> courses
                {searchTerm && (
                  <span className="ml-1">
                    for "<span className="text-indigo-600">{searchTerm}</span>"
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Courses Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {courseData ? (
          filteredCourses.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map((course, idx) => (
                <div
                  key={`course_${idx}`}
                  className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 ease-in-out border border-gray-200 overflow-hidden"
                >
                  <CourseTile course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-center text-gray-500 text-base sm:text-lg font-medium">
                No courses found matching{" "}
                <span className="italic text-indigo-600">"{searchTerm}"</span>
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Clear search
              </button>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center min-h-[40vh] sm:min-h-[50vh]">
            <Loader />
          </div>
        )}
      </main>
    </section>
  );
};

export default Page;