//app\_containers\CourseDetails.jsx
"use client";
import { usePurchase } from "@/app/_hooks/usePurchase";
import { useCart } from "@/app/_provider/cartProvider";
import { useSession } from "@/app/_provider/sessionProvider";
import Button from "@/app/_ui/Button";
import { ChevronDownIcon, ShieldCheckIcon, PlayCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomLink from "../_components/CustomLink";

export default function CourseDetails({ course, unique_url }) {
  const { isAuth } = useSession();
  const { addCourseToCart, isInCart } = useCart();
  const router = useRouter();
  const { initiatePurchase } = usePurchase();

  const [rulesOpen, setRulesOpen] = useState(false);
  const [curriculumOpen, setCurriculumOpen] = useState({});

  const courseAlreadyInCart = isInCart(course.course_id);

  const handleAddToCart = () => {
    addCourseToCart(course.course_id);
  };

  const handlePurchaseCourse = () => {
    initiatePurchase({
      courseID: course.course_id,
      redirectTo: `/course/${course.unique_url}/learn`,
    });
  };

  const handleWithAuthFunction = (authFunction) => {
    if (!isAuth) {
      router.push("/auth");
      toast.info("Please login to continue");
      return;
    }
    authFunction();
  };

  const toggleSection = (idx) => {
    setCurriculumOpen(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Mobile-first layout */}
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-10">
          
          {/* Sidebar - Bottom on mobile, side on desktop */}
          <aside className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-7 w-full lg:w-80 xl:w-96">
            {/* Preview Video or Thumbnail */}
            <div className="mb-6">
              {course.preview_video_url ? (
                <div className="rounded-lg overflow-hidden shadow-md aspect-video">
                  <video
                    src={course.preview_video_url}
                    controls
                    className="w-full h-full object-cover"
                    poster={course.course_thumbnail}
                    preload="metadata"
                  >
                    Sorry, your browser doesn't support embedded videos.
                  </video>
                </div>
              ) : (
                <div className="rounded-lg overflow-hidden shadow-md aspect-video">
                  <img
                    src={course.course_thumbnail}
                    alt="Course Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Price
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                ₹{course.price}
              </p>
              <p className="mt-2 text-gray-500 text-xs sm:text-sm">
                30-Day Money-Back Guarantee
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!course?.is_enrolled ? (
                <>
                  <Button
                    onClick={() => handleWithAuthFunction(handlePurchaseCourse)}
                    variant="primary"
                    className="w-full py-3 text-sm sm:text-base font-semibold hover:shadow-lg transition-all"
                  >
                    Buy Now
                  </Button>
                  <Button
                    disabled={courseAlreadyInCart}
                    onClick={() => handleWithAuthFunction(handleAddToCart)}
                    variant="secondary"
                    className={`w-full py-3 text-sm sm:text-base font-semibold transition-all ${
                      courseAlreadyInCart ? "cursor-not-allowed opacity-60" : "hover:bg-gray-700"
                    }`}
                  >
                    {courseAlreadyInCart ? "Added to Cart ✓" : "Add to Cart"}
                  </Button>
                </>
              ) : (
                <CustomLink href={`/course/${course.unique_url}/learn`} className="w-full">
                  <Button variant="primary" className="w-full py-3 text-sm sm:text-base font-semibold">
                    Start Learning →
                  </Button>
                </CustomLink>
              )}
            </div>

            {/* Course Info - Mobile visible */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <ClockIcon className="w-5 h-5" />
                <span>{course.course_duration || "Self-paced"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <PlayCircleIcon className="w-5 h-5" />
                <span>{course.content?.length || 0} sections</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="order-1 lg:order-2 flex-1 min-w-0">
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
                {course.course_name}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-4">
                {course.course_title}
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                {course.course_description}
              </p>
            </div>

            {/* What You'll Learn */}
            <section className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <span>🎯</span> What you'll learn
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                {course?.what_you_will_learn?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Curriculum */}
            <section className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <span>📚</span> Course Curriculum
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {course?.content?.map((section, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-gray-300 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full p-4 sm:p-5 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-left">
                        {section.title}
                      </h3>
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-300 ${
                          curriculumOpen[idx] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {curriculumOpen[idx] && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <ul className="p-4 space-y-2">
                          {section.lectures.map((lecture, i) => (
                            <li key={i} className="flex justify-between items-center text-sm sm:text-base text-gray-600">
                              <span className="flex items-center gap-2">
                                <PlayCircleIcon className="w-4 h-4" />
                                {lecture.name}
                              </span>
                              <span className="text-xs sm:text-sm">{lecture.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Rules & Regulations */}
            <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
              <button
                onClick={() => setRulesOpen(!rulesOpen)}
                aria-expanded={rulesOpen}
                aria-controls="rules-content"
                className="flex items-center justify-between w-full text-gray-900 font-semibold text-lg sm:text-xl focus:outline-none hover:text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <span>📋</span> Rules & Regulations
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    rulesOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {rulesOpen && (
                <ul
                  id="rules-content"
                  className="mt-4 sm:mt-6 space-y-3 sm:space-y-4"
                >
                  <li className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm sm:text-base text-gray-700">
                      Complete all lessons and assignments to be eligible for certification.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-gray-700">
                      Sharing course materials or recorded content is strictly prohibited.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-gray-700">
                      Refund requests must be made within 30 days of purchase, subject to our policy.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-gray-700">
                      Respect fellow learners and instructors during discussions and forums.
                    </p>
                  </li>
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Price Bar - Only on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg p-4 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{course.price}</p>
            <p className="text-xs text-gray-500">30-day guarantee</p>
          </div>
          {!course?.is_enrolled ? (
            <div className="flex gap-2">
              <Button
                onClick={() => handleWithAuthFunction(handlePurchaseCourse)}
                variant="primary"
                className="px-6 py-2 text-sm font-semibold"
              >
                Buy Now
              </Button>
              <Button
                disabled={courseAlreadyInCart}
                onClick={() => handleWithAuthFunction(handleAddToCart)}
                variant="secondary"
                className={`px-4 py-2 text-sm font-semibold ${
                  courseAlreadyInCart ? "opacity-60" : ""
                }`}
              >
                {courseAlreadyInCart ? "✓" : "Cart"}
              </Button>
            </div>
          ) : (
            <CustomLink href={`/course/${course.unique_url}/learn`}>
              <Button variant="primary" className="px-6 py-2 text-sm font-semibold">
                Continue →
              </Button>
            </CustomLink>
          )}
        </div>
      </div>
    </div>
  );
}