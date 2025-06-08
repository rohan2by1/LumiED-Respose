//app\_containers\Cart.jsx
"use client";

import CustomLink from "@/app/_components/CustomLink";
import { useCart } from "@/app/_provider/cartProvider";
import Button from "@/app/_ui/Button";
import { formatPrice } from "@/app/_utils/common";
import { toast } from "react-toastify";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Loader from "@/app/_components/Loader";

export default function CartPage() {
    const { cartData, removeCourseFromCart, isInCart, checkoutCart } = useCart();
    const totalPrice = cartData.reduce((acc, cur) => acc + cur.price, 0);

    // Page-level loading state (not tied to cart loading)
    const [pageReady, setPageReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageReady(true);
        }, 500); // Small delay for visual stability

        return () => clearTimeout(timer);
    }, []);

    const handleCheckout = () => {
        checkoutCart();
    };

    const handleRemoveFromCart = (courseID) => {
        if (!isInCart(courseID)) {
            toast.error("Course is not in cart");
            return;
        }
        removeCourseFromCart(courseID);
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 bg-background text-foreground">
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">

                {!pageReady ? (
                    <div className="flex min-h-[50vh] sm:min-h-[60vh] items-center justify-center">
                        <Loader />
                    </div>
                ) : cartData.length === 0 ? (
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                            Your Cart
                        </h1>
                        <div className="text-center text-gray-500 space-y-4">
                            <div className="py-8 sm:py-12">
                                <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-base sm:text-lg mb-4">Your cart is empty</p>
                                <p className="text-sm text-gray-400 mb-6">Looks like you haven't added any courses yet</p>
                            </div>
                            <CustomLink
                                href="/course"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg transition-all duration-200 font-medium text-sm sm:text-base"
                            >
                                Browse Courses
                            </CustomLink>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
                            Your Cart ({cartData.length} {cartData.length === 1 ? 'item' : 'items'})
                        </h1>
                        
                        <div className="space-y-4 sm:space-y-6">
                            {/* Cart Items */}
                            {cartData.map((course, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Course Image and Info */}
                                        <div className="flex gap-3 sm:gap-4 flex-1">
                                            <img
                                                src={course.course_thumbnail}
                                                alt={course.course_name}
                                                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-24 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h2 className="font-semibold text-base sm:text-lg line-clamp-2 mb-1">
                                                    <CustomLink 
                                                        href={`/course/${course.unique_url}`}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        {course.course_name}
                                                    </CustomLink>
                                                </h2>
                                                <p className="text-xs sm:text-sm text-gray-500">
                                                    Duration: {course.course_duration}
                                                </p>
                                                
                                                {/* Mobile Price - shown below info on mobile */}
                                                <p className="sm:hidden text-lg font-bold text-blue-600 mt-2">
                                                    {formatPrice(course.price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price and Actions */}
                                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                                            {/* Desktop Price */}
                                            <p className="hidden sm:block text-lg font-bold text-blue-600">
                                                {formatPrice(course.price)}
                                            </p>
                                            
                                            <button
                                                onClick={() => handleRemoveFromCart(course.course_id)}
                                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                title="Remove from cart"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Order Summary */}
                            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg space-y-4">
                                <h3 className="font-semibold text-lg sm:text-xl">Order Summary</h3>
                                
                                <div className="space-y-2 text-sm sm:text-base">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal ({cartData.length} items)</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                </div>
                                
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg font-semibold">Total:</p>
                                        <p className="text-xl sm:text-2xl font-bold text-blue-600">
                                            {formatPrice(totalPrice)}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full py-3 sm:py-3.5 text-sm sm:text-base font-medium"
                                    variant="primary"
                                >
                                    Proceed to Checkout
                                </Button>
                                
                                <CustomLink 
                                    href="/course"
                                    className="block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Continue Shopping
                                </CustomLink>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}