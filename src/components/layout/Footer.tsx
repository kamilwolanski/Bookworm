export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t py-6 mt-auto ">
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} BookWorm. All rights reserved.</p>
        <nav className="mt-3 flex justify-center space-x-6 text-sm">
          <a
            href="/privacy"
            className="hover:underline"
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:underline"
            aria-label="Terms of Service"
          >
            Terms of Service
          </a>
          <a href="/contact" className="hover:underline" aria-label="Contact">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
