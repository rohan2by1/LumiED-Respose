const otpTemplates = {
  signup: (otp) => ({
    subject: "LumiEd | Complete Your Signup",
    body: `
      <div style="font-family: sans-serif;">
        <h2>Welcome to LumiED 🎓</h2>
        <p>Use the code below to complete your signup:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This code is valid for <strong>5 minutes</strong>.</p>
      </div>
    `,
  }),

  login: (otp) => ({
    subject: "LumiED | Login Verification",
    body: `
      <div style="font-family: sans-serif;">
        <h2>Login Attempt Detected</h2>
        <p>Use the following OTP to verify your identity:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in <strong>5 minutes</strong>.</p>
      </div>
    `,
  }),

  resetPassword: (otp) => ({
    subject: "LumiED | Password Reset OTP",
    body: `
      <div style="font-family: sans-serif;">
        <h2>Password Reset Requested</h2>
        <p>Enter this code in the app to reset your password:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  }),

  default: (otp) => ({
    subject: "LumiED | OTP Verification",
    body: `
      <div style="font-family: sans-serif;">
        <h2>OTP Verification</h2>
        <p>Use the following OTP for verification:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
      </div>
    `,
  }),
};

const getTemplateData = (type, otp) => {
  const normalizedType = type?.toLowerCase();
  const template = otpTemplates?.[normalizedType] || otpTemplates.default;
  return template(otp);
};

export default getTemplateData;
