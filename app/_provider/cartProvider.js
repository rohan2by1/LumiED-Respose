"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "./sessionProvider";
import { usePurchase } from "@/app/_hooks/usePurchase";
import request from "@/app/_utils/request";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartInfo, setCartInfo] = useState({ cart_id: null, courses_data: [] });
  const [loading, setLoading] = useState(true);
  
  const { isAuth } = useSession();
  const { initiatePurchase } = usePurchase();

  useEffect(() => {
    if (isAuth){ 
      getCartData();
    }
    else{
      setCartInfo({ cart_id: null, courses_data: [] });
      setLoading(false);
    }
  }, [isAuth]);

  const isInCart = (courseID) => {
    return cartInfo.courses_data.some((item) => item.course_id === courseID);
  };

  const getCartData = async () => {
    setLoading(true);
    const res = await await request("/api/cart");
    if (res.success) {
      setCartInfo(res.data);
    } else {
      toast.error(res.message || "Something went wrong");
    }
    setLoading(false);
  };

  const addCourseToCart = async (courseID) => {
    if (isInCart(courseID)) {
      toast.warn("Course is already added.");
      return;
    }

    setLoading(true);
    const res = await await request("/api/cart", {
      method: "POST",
      body: { course_id: courseID },
    });
    if (res.success) {
      setCartInfo(res.data);
      toast.success(res.message || "Course added from cart");
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const removeCourseFromCart = async (courseID) => {
    if (!isInCart(courseID)) {
      toast.warn("Course not exists in cart.");
      return;
    }

    setLoading(true);
    const res = await request("/api/cart", {
      method: "PUT",
      body: { course_id: courseID },
    });
    if (res.success) {
      const updatedCartData = cartInfo.courses_data.filter(
        (course) => course.course_id !== courseID
      );
      setCartInfo((prev) => ({
        cart_id: prev.cart_id,
        courses_data: updatedCartData,
      }));
      toast.success(res.message || "Course removed from cart");
    } else {
      toast.error(res.message || "Something went wrong");
    }
    setLoading(false);
  };

  const checkoutCart = () => {
    // implement your logic here
    if(!cartInfo?.cart_id)
      toast.error("Please try again")
    initiatePurchase({ cartID: cartInfo.cart_id });
  };

  return (
    <CartContext.Provider
      value={{
        cartData: cartInfo?.courses_data || [],
        cartID: cartInfo?.cart_id || "",
        loading,
        addCourseToCart,
        removeCourseFromCart,
        checkoutCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
};
