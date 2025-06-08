//app\_components\VerifyOtpModal.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function VerifyOtpModal({
  isOpen,
  onClose,
  onVerify,
  onResendOtp,
  title = 'Verify OTP',
}) {
  const length = 6;
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(length).fill(''));
      setError('');
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleChange = (value, idx) => {
    if (/^[0-9]{0,1}$/.test(value)) {
      const updated = [...otp];
      updated[idx] = value;
      setOtp(updated);

      if (value && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const updated = [...otp];
      updated[idx - 1] = '';
      setOtp(updated);
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < length) {
      setError('Please enter the complete OTP');
      return;
    }

    setLoading(true);
    try {
      await onVerify(fullOtp);
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await onResendOtp?.();
      setOtp(new Array(length).fill(''));
      setResendCooldown(60);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  const closeModal = () => {
    setOtp(new Array(length).fill(''));
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleVerify} className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
        <button
          type='button'
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          <img src="/icons/close.png" className="h-4 w-4" alt="X" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>

        <div className="flex justify-between gap-2 mb-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-10 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* <div className="text-sm mb-4 text-center">
          Didn't get the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-blue-600 hover:underline disabled:opacity-50"
          >
            Resend {resendCooldown > 0 && `(${resendCooldown}s)`}
          </button>
        </div> */}

        <div className="flex justify-end gap-2">
          <button
            type='button'
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>
    </div>
  );
}
