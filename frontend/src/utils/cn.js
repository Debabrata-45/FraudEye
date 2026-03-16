/**
 * Utility to merge Tailwind class names cleanly.
 * Usage: cn('base-class', condition && 'conditional-class', 'another-class')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}