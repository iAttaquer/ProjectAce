"use client";

interface BadgeProps {
  status: string;
}

export default function Badge(BadgeProps: BadgeProps) {
  let badge;
  switch (BadgeProps.status) {
    case 'Wykonane':
      badge = (
        <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
          Wykonane
        </span>
      );
      break;
    case 'Niewykonane':
      badge = (
        <span className="w-fit bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
          Niewykonane
        </span>
      );
      break;
    case 'Aktywny':
      badge = (
        <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
          Aktywny
        </span>
      );
      break;
    case 'Zakończony':
      badge = (
        <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
          Zakończony
        </span>
      )
    default:
      badge = (
        <span className="w-fit bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500">
          {BadgeProps.status}
        </span>
      );
  }
  return badge;
}