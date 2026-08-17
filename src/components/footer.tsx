import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Africaplan. Built by loveth using Next.js & TanStack Query.</p>
    </footer>
  );
}
