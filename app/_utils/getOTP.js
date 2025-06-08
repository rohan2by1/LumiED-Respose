const getOTP = (digit = 6) => {
    const minvalue = Math.pow(10, digit - 1);
    const maxvalue = 9 * minvalue;
    const otp = Math.floor(minvalue + Math.random() * maxvalue).toString();
    return otp;
};

export default getOTP;