// Password Service - Single Responsibility: Handle password validation logic
import { PasswordStrength, PasswordValidation } from "@/types/auth.types";

export class PasswordService {
  /**
   * Validates password strength based on multiple criteria
   */
  static validatePassword(password: string): PasswordValidation {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strength = this.getPasswordStrength(score);
    const feedback = this.getPasswordFeedback(strength);

    return { strength, score, feedback };
  }

  private static getPasswordStrength(score: number): PasswordStrength {
    switch (score) {
      case 4:
        return PasswordStrength.STRONG;
      case 3:
        return PasswordStrength.GOOD;
      case 2:
        return PasswordStrength.FAIR;
      default:
        return PasswordStrength.WEAK;
    }
  }

  private static getPasswordFeedback(strength: PasswordStrength): string {
    const feedbackMap: Record<PasswordStrength, string> = {
      [PasswordStrength.WEAK]: "Password is too weak",
      [PasswordStrength.FAIR]:
        "Password is fair, consider adding more characters",
      [PasswordStrength.GOOD]: "Password is good",
      [PasswordStrength.STRONG]: "Password is strong",
    };

    return feedbackMap[strength];
  }

  /**
   * Gets the color for the password strength
   */
  static getStrengthColor(strength: PasswordStrength): string {
    const colorMap: Record<PasswordStrength, string> = {
      [PasswordStrength.WEAK]: "#ef4444",
      [PasswordStrength.FAIR]: "#f59e0b",
      [PasswordStrength.GOOD]: "#10b981",
      [PasswordStrength.STRONG]: "#00d9ff",
    };

    return colorMap[strength];
  }
}
