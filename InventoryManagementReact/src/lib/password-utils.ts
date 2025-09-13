import type { PasswordStrength } from '@/types/passwordReset';

// Password strength validation
export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  return {
    score: Math.min(score, 4), // Cap at 4
    feedback,
    isValid: score >= 4 && password.length >= 8,
  };
}

// Get password strength color
export function getPasswordStrengthColor(score: number): string {
  if (score < 2) return 'text-red-500';
  if (score < 3) return 'text-orange-500';
  if (score < 4) return 'text-yellow-500';
  return 'text-green-500';
}

// Get password strength label
export function getPasswordStrengthLabel(score: number): string {
  if (score < 2) return 'Very Weak';
  if (score < 3) return 'Weak';
  if (score < 4) return 'Medium';
  return 'Strong';
}
