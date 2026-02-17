"use client";

import Link from "next/link";

interface ChoiceButtonProps {
  slug: string;
  targetId: string;
  label: string;
}

export default function ChoiceButton({
  slug,
  targetId,
  label,
}: ChoiceButtonProps) {
  return (
    <Link
      href={`/adventure/${slug}?page=${targetId}`}
      className="block w-full rounded-lg border border-gray-300 bg-white px-6 py-4 text-left text-lg font-medium text-gray-900 shadow-sm transition-colors hover:border-blue-500 hover:bg-blue-50"
    >
      {label}
    </Link>
  );
}
