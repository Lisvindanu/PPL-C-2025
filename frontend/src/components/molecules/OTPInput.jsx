import { useRef, useEffect } from 'react';

export default function OTPInput({ value, onChange, length = 6, disabled = false }) {
  const inputRefs = useRef([]);
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, newValue) => {
    // Only allow digits
    if (newValue && !/^\d$/.test(newValue)) return;

    const newDigits = [...digits];
    newDigits[index] = newValue;
    const newOTP = newDigits.join('');
    onChange(newOTP);

    // Auto-focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);
    
    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center my-6">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-14 text-center text-2xl font-bold
            border-2 rounded-lg
            transition-all duration-200
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${digit ? 'border-blue-500' : 'border-gray-300'}
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
            hover:border-blue-400
          `}
        />
      ))}
    </div>
  );
}
