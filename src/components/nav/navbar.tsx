'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  const menuItems = (
    <>
      <Link
        href="/"
        className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Home
      </Link>
      <div className="relative group">
        <button
          type="button"
          className="px-3 py-2 rounded inline-flex items-center hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={() => setIsOpen((open) => !open)}
        >
          Books
          <svg
            className="ml-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {/* Dropdown menu */}
        <div
          className={`absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded shadow-md transition-opacity duration-200 ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          } group-hover:opacity-100 group-hover:visible`}
        >
          <Link
            href="/books"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            All Books
          </Link>
          <Link
            href="/books/favorites"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            Favorites
          </Link>
        </div>
      </div>
      <Link
        href="/profile"
        className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Profile
      </Link>
      {session ? (
        <button
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Log out
        </button>
      ) : (
        <Link
          href="/login"
          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Login
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-white dark:bg-gray-900 border-b shadow-sm w-full top-0 left-0 ">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          📚 BookWorm
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex space-x-4 items-center">{menuItems}</nav>
      </div>
    </header>
  );
}
