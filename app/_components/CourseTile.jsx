//app\_components\CourseTile.jsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "../_provider/cartProvider";
import { useSession } from "../_provider/sessionProvider";
import Button from "../_ui/Button";
import { formatPrice } from "../_utils/common";
import CustomLink from "./CustomLink";

const CourseTile = ({ course }) => {
  const router = useRouter();
  const { isAuth } = useSession();
  const { addCourseToCart, isInCart, loading } = useCart();

  const courseAlreadyInCart = isInCart(course.course_id);

  const handleAddToCart = () => {
    if (!isAuth) {
      router.push("/auth");
      toast.info("Login to use cart");
      return;
    }
    addCourseToCart(course.course_id);
  };

  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 w-full flex flex-col rounded-lg overflow-hidden h-full min-h-[280px] sm:min-h-[300px] md:min-h-[320px]">
      {/* Course Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        <img
          src={course.course_thumbnail}
          alt={course.course_name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {course?.is_enrolled && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-semibold shadow-md">
            Enrolled
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Course Info */}
        <div className="flex-grow">
          <h3 
            className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm sm:text-base leading-tight"
            title={course.course_name}
          >
            {course.course_name}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-3">
            {course.course_title}
          </p>
        </div>

        {/* Actions Section */}
        {!course?.is_enrolled ? (
          <>
            {/* Price and Enroll */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-base sm:text-lg font-bold text-blue-600">
                {formatPrice(course.price)}
              </p>
              <CustomLink href={`/course/${course.unique_url}`}>
                <span className="text-xs sm:text-sm border border-gray-700 rounded-md px-2 sm:px-3 py-1 hover:bg-gray-100 transition-colors cursor-pointer">
                  Enrol Now →
                </span>
              </CustomLink>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={loading || courseAlreadyInCart}
              variant="primary"
              className="w-full text-xs sm:text-sm py-2 sm:py-2.5 border-[1px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {courseAlreadyInCart ? (
                <span className="flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Added to Cart
                </span>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Enrolled Actions */}
            <div className="space-y-2">
              <CustomLink href={`/course/${course.unique_url}/learn`} className="block">
                <Button
                  variant="primary"
                  className="w-full text-xs sm:text-sm py-2 sm:py-2.5 border-[1px] font-medium"
                >
                  Continue Learning →
                </Button>
              </CustomLink>
              <CustomLink href={`/course/${course.unique_url}`} className="block">
                <Button
                  variant="secondary"
                  className="w-full text-xs sm:text-sm py-2 sm:py-2.5 border-[1px] font-medium"
                >
                  View Details
                </Button>
              </CustomLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseTile;