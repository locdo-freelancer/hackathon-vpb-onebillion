/**
 * Auth Components - Organized Export Structure
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Each component has one clear purpose
 * - Open/Closed: Configuration-driven, extensible without modification
 * - Interface Segregation: Clean, minimal prop interfaces
 * - Dependency Inversion: Depends on config abstractions
 *
 * Architecture:
 * Tier 1: Atomic Components (FormButton, FormCheckbox, InputLabel, etc.)
 * Tier 2: Input Components (EmailInput, PasswordInput)
 * Tier 3: Feature Components (OAuthButtons, MFAModal, EmailVerification)
 * Tier 4: Form Components (LoginForm, SignupForm)
 * Tier 5: Layout Components (AuthLayout, AuthHeader)
 */

// ===== Tier 1: Atomic Components =====
export { FormButton } from "./FormButton";
export { FormCheckbox } from "./FormCheckbox";
export { FormError } from "./FormError";
export { InputLabel } from "./InputLabel";
export { PasswordStrengthBar } from "./PasswordStrengthBar";

// ===== Tier 2: Input Components =====
export { EmailInput } from "./EmailInput";
export { PasswordInput } from "./PasswordInput";

// ===== Tier 3: Feature Components =====
export { MFAModal } from "./MFAModal";
export { EmailVerification } from "./EmailVerification";

// ===== Tier 4: Form Components =====
export { LoginForm } from "./LoginForm";
export { SignupForm } from "./SignupForm";

// ===== Tier 5: Layout Components =====
export { AuthLayout } from "./AuthLayout";
export { AuthHeader } from "./AuthHeader";
