// Custom hook for MFA input - Interface Segregation
import { useState, useCallback, useRef, useEffect } from "react";

const MFA_CODE_LENGTH = 6;

export const useMFAInput = () => {
  const [code, setCode] = useState<string[]>(Array(MFA_CODE_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input
      if (value && index < MFA_CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text")
        .slice(0, MFA_CODE_LENGTH);
      const digits = pastedData.split("").filter((char) => /^\d$/.test(char));

      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (i < MFA_CODE_LENGTH) {
          newCode[i] = digit;
        }
      });
      setCode(newCode);

      // Focus last filled input
      const lastIndex = Math.min(digits.length, MFA_CODE_LENGTH - 1);
      inputRefs.current[lastIndex]?.focus();
    },
    [code]
  );

  const getFullCode = useCallback(() => {
    return code.join("");
  }, [code]);

  const isComplete = useCallback(() => {
    return code.every((digit) => digit !== "");
  }, [code]);

  const resetCode = useCallback(() => {
    setCode(Array(MFA_CODE_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }, []);

  return {
    code,
    inputRefs,
    handleInput,
    handleKeyDown,
    handlePaste,
    getFullCode,
    isComplete,
    resetCode,
  };
};
