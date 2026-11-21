import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../../../redux/features/authSlice';
import Loader from '../../../components/common/loader/Loader';
import { useNavigate } from 'react-router-dom';

const OtpValidationForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, phoneNumber, verificationError, verificationLoading, verifyOtpStatus } = useSelector((state) => state.auth);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input field
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text').split('');
    if (pasteData.length === otp.length) {
      setOtp(pasteData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    dispatch(verifyOtp({ number: phoneNumber, otp: otpCode }));
  };

  useEffect(() => {
    if (verifyOtpStatus === 'Phone number verified successfully') navigate('/');
  }, [navigate, verifyOtpStatus]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
      {loading && <Loader />}
      <p className="my-3 font-semibold ml-7 text-center">Enter the OTP sent to your registered Mobile number.</p>
      <div className="flex space-x-2">
        {otp.map((data, index) => (
          <input
            className="w-10 h-10 text-center text-xl border border-[var(--color-border)] rounded focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`OTP digit ${index + 1}`}
            name="otp"
            maxLength="1"
            key={index}
            value={data}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={el => inputRefs.current[index] = el}
          />
        ))}
      </div>
      <p className="text-center text-sm text-[var(--color-muted)]">OTP Entered: {otp.join('')}</p>
      {verificationError && <p className="text-center text-[var(--color-error)]">{verificationError}</p>}
      <button
        type="submit"
        className={`bg-[var(--color-primary)] w-[200px] font-dosis hover:bg-[var(--color-primary-strong)] text-[var(--color-on-primary)] font-bold py-2 px-4 rounded ${verificationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={verificationLoading}
      >
        {verificationLoading ? 'Verifying...' : 'Submit'}
      </button>
    </form>
  );
};

export default OtpValidationForm;
