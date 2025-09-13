import type { PasswordStrength } from '@/types/profile';

export function validatePasswordStrength(password: string): PasswordStrength {
  let strength = 0;
  const minLength = 8;

  // Length check
  if (password.length >= minLength) {
    strength++;
  }
  
  // Character type checks
  if (/[a-z]/.test(password)) {
    strength++;
  }
  if (/[A-Z]/.test(password)) {
    strength++;
  }
  if (/[0-9]/.test(password)) {
    strength++;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    strength++;
  }

  // Additional length bonus
  if (password.length >= 12) {
    strength++;
  }

  // Determine strength level
  if (strength <= 1) return 'Very Weak';
  if (strength === 2) return 'Weak';
  if (strength === 3) return 'Moderate';
  if (strength === 4) return 'Strong';
  if (strength >= 5) return 'Very Strong';

  return 'Very Weak';
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'Very Weak':
      return 'text-red-500';
    case 'Weak':
      return 'text-orange-500';
    case 'Moderate':
      return 'text-yellow-500';
    case 'Strong':
      return 'text-green-500';
    case 'Very Strong':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
}

export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  return strength;
}

export function getPasswordStrengthWidth(strength: PasswordStrength): string {
  switch (strength) {
    case 'Very Weak':
      return 'w-1/5';
    case 'Weak':
      return 'w-2/5';
    case 'Moderate':
      return 'w-3/5';
    case 'Strong':
      return 'w-4/5';
    case 'Very Strong':
      return 'w-full';
    default:
      return 'w-0';
  }
}

export function getPasswordRequirements(): Array<{
  text: string;
  test: (password: string) => boolean;
}> {
  return [
    {
      text: 'At least 8 characters',
      test: (password) => password.length >= 8,
    },
    {
      text: 'Contains lowercase letter',
      test: (password) => /[a-z]/.test(password),
    },
    {
      text: 'Contains uppercase letter',
      test: (password) => /[A-Z]/.test(password),
    },
    {
      text: 'Contains number',
      test: (password) => /[0-9]/.test(password),
    },
    {
      text: 'Contains special character',
      test: (password) => /[^a-zA-Z0-9]/.test(password),
    },
  ];
}