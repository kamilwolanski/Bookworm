'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile menu panel */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Home
            </Link>
            <details>
              <summary className="cursor-pointer px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center">
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
              </summary>
              <div className="pl-4 mt-2 flex flex-col space-y-2">
                <Link
                  href="/books"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  All Books
                </Link>
                <Link
                  href="/books/favorites"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Favorites
                </Link>
              </div>
            </details>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Profile
            </Link>
          </nav>
        </div>

        {/* Overlay when mobile menu is open */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 md:hidden z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
}
