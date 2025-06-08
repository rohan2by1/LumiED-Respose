//app\(pages)\auth\page.jsx
'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CustomLink from "@/app/_components/CustomLink";
import { useSession } from "@/app/_provider/sessionProvider";
import { toast } from "react-toastify";
import VerifyOtpModal from "@/app/_components/VerifyOtpModal";
import Button from "@/app/_ui/Button";

const Page = () => {
  const searchParams = useSearchParams();
  const newuser = searchParams.get("newuser");
  const isSignup = newuser === "true";

  const router = useRouter();
  const { setSession } = useSession();
  const formRef = useRef(null);

  const [verifyOTP, setVerifyOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formRef.current) formRef.current.reset();
  }, [isSignup]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        body: formData,
      });
      const body = await res.json();

      if (body.success) {
        const { user_id, role } = body?.data;
        setSession({ isAuth: true, user_id, role, isAdmin: role === 'admin' });
        router.push("/");
      } else {
        toast.error(body?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (otp) => {
    const formData = new FormData(formRef.current);

    if (formData.get("password") !== formData.get("confirm-password")) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          otp,
          name: formData.get("name"),
          phone: formData.get("phone"),
        }),
      });
      const body = await res.json();

      if (body.success) {
        const { user_id, role } = body?.data;
        setSession({ isAuth: true, user_id, role, isAdmin: role === 'admin' });
        router.push("/");
      } else {
        toast.error(body?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error, please try again.");
    }
  };

  const handleResendOtp = async () => {
    return
    if (loading) return;
    try {
      setLoading(true);
      const formData = new FormData(formRef.current);
      const email = formData.get("email");

      const res = await fetch(`/api/auth/otp/resend`, {
        method: "POST",
        body: JSON.stringify({ email, type: "signup" })
      });

      const body = await res.json();
      if (body.success) {
        setVerifyOTP(true);
      } else {
        throw new Error(body?.message || "Failed to send otp");
      }
    } catch (err) {
      toast.error(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    if (formData.get("password") !== formData.get("confirm-password")) {
      toast.error("Passwords do not match!");
      return;
    }
    if (loading) return;
    try {
      setLoading(true);
      const formData = new FormData(e.target);
      const email = formData.get("email");

      const res = await fetch(`/api/auth/otp`, {
        method: "POST",
        body: JSON.stringify({ email, type: "signup" })
      });

      const body = await res.json();
      if (body.success) {
        setVerifyOTP(true);
      } else {
        throw new Error(body?.message || "Failed to send otp");
      }
    } catch (err) {
      toast.error(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        ref={formRef}
        onSubmit={isSignup ? handleSendOtp : handleLogin}
        className="w-full min-h-[450px] max-w-md p-8 rounded shadow-brand flex flex-col justify-between"
      >
        <CustomLink href="/" className="text-2xl font-bold text-center text-brand.dark mb-8">
          LumiEd
        </CustomLink>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
          />
        </div>
        {isSignup && (
          <>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                pattern="[0-9]{10}" // optional, you can change it to accept any format
                className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1 ">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
          />
        </div>
        {isSignup ?
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              required
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </div> :
          <div className="mb-4 text-right">
            <CustomLink href="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </CustomLink>
          </div>
        }
        <div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-black bg-brand.dark text-white font-semibold rounded-md hover:bg-white hover:text-black transition duration-200 disabled:opacity-60"
          >
            {loading ? (isSignup ? "Signing Up..." : "Logging In...") : isSignup ? "Sign Up" : "Log In"}
          </Button>
          <p className="text-sm text-center mt-4">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account yet?"}{" "}
            <CustomLink
              href={`/auth${isSignup ? "" : "?newuser=true"}`}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </CustomLink>
          </p>
        </div>
      </form>

      {/* OTP Modal only used in Signup */}
      <VerifyOtpModal
        isOpen={verifyOTP}
        onClose={() => {
          setVerifyOTP(false);
        }}
        onVerify={handleSignup}
        onResendOtp={handleResendOtp}
        title="Verify Your Email"
      />

    </div>
  );
};

export default Page;
