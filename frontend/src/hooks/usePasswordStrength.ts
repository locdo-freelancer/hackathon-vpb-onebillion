// Custom hook for password strength - Interface Segregation
import { useState, useCallback } from "react";
import { PasswordValidation, PasswordStrength } from "@/types/auth.types";
import { PasswordService } from "@/lib/services/password.service";

export const usePasswordStrength = () => {
  const [validation, setValidation] = useState<PasswordValidation>({
    strength: PasswordStrength.WEAK,
    score: 0,
    feedback: "",
  });

  const [showStrength, setShowStrength] = useState(false);

  const validatePassword = useCallback((password: string) => {
    if (password.length > 0) {
      const result = PasswordService.validatePassword(password);
      setValidation(result);
      setShowStrength(true);
    } else {
      setShowStrength(false);
    }
  }, []);

  return {
    validation,
    showStrength,
    validatePassword,
  };
};
