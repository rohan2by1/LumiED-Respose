//app\(pages)\auth\forgot-password\page.jsx
'use client';

import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'

export default function Page() {
  const formRef = useRef(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const step = "email";
  
  const router = useRouter()

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.target);
    const enteredEmail = formData.get('email');

    try {
      setLoading(true);
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        body: JSON.stringify({ email: enteredEmail, type: 'resetPassword' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to send OTP');

      setEmail(enteredEmail);
      formRef.current?.reset();
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    return;
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.target);
    const otp = formData.get('otp');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.success){
        toast.success('Password reset successfully! Please login.');
        return router.push('/auth')
      }
      throw new Error(data.message || 'Reset failed');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      formRef.current?.reset();
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        ref={formRef}
        onSubmit={step === 'email' ? handleRequestOtp : handleResetPassword}
        className="bg-white p-6 rounded-lg shadow-brand w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h1>

        {step === 'email' ? (
          <>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                id="email"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="otp" className="block mb-1 text-sm font-medium">
                Enter OTP
              </label>
              <input
                required
                type="text"
                name="otp"
                id="otp"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">
                New Password
              </label>
              <input
                required
                type="password"
                name="password"
                id="password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block mb-1 text-sm font-medium">
                Confirm Password
              </label>
              <input
                required
                type="password"
                name="confirm-password"
                id="confirm-password"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
