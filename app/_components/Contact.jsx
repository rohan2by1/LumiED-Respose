//app\_components\Contact.jsx
"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../_ui/Button";
import { USER_REVIEW } from "../_utils/constants";
import UserReviewTile from "./UserReviewTile";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmitQuery = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(event.target);
      const name = formData.get("name");
      const email = formData.get("email");
      const query = formData.get("query");

      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, query }),
      });

      if (response.ok) {
        toast.success("Query submitted successfully!");
        event.target.reset();
      } else {
        toast.error("Failed to submit query. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact-us"
      className="reviews-section py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-100 via-white to-purple-100"
    >
      <div className="reviews-header text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">
          Contact Us
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700">
          We value your feedback and questions!
        </p>
      </div>

      <div className="user-review-container max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmitQuery}
          className="bg-white/60 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4 sm:mb-6">
            Ask your query
          </h3>
          <div className="form-group mb-4">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              required
              className="w-full border border-blue-200 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <div className="form-group mb-4">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full border border-blue-200 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <div className="form-group mb-6">
            <textarea
              rows="5"
              id="review"
              name="query"
              placeholder="Enter your query..."
              required
              className="w-full border border-blue-200 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none transition-all"
            />
          </div>
          <Button
            variant="tertiary"
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg sm:rounded-xl hover:scale-105 transition-transform text-sm sm:text-base"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {/* User Reviews - Keep Original */}
        <div className="user-review-cards grid gap-4 sm:gap-6">
          {USER_REVIEW.map((review) => (
            <UserReviewTile key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;