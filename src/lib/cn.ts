/**
 * Class Name Merger Utility
 * Combines classnames with Tailwind CSS class merging support
 */

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default cn;
