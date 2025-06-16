import { Home, Settings, BarChart2, LifeBuoy, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import NavLink from './NavLink';

const menu = [
  { name: 'Dashboard', icon: <Home size={20} />, href: '/dashboard' },
  { name: 'Books', icon: <Book size={20} />, href: '/books' },
  { name: 'Settings', icon: <Settings size={20} />, href: '/settings' },
  { name: 'Analytics', icon: <BarChart2 size={20} />, href: '/analytics' },
  { name: 'Support', icon: <LifeBuoy size={20} />, href: '/support', badge: 7 },
];

export default function Sidebar() {
  return (
    <aside className="bg-[#262632] text-white w-64 h-screen p-6 flex flex-col justify-between">
      <div>
        <Link href="/" className="text-xl font-bold block mb-6">
          📚 BookWorm
        </Link>
        <nav className="space-y-4">
          {menu.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <NavLink
                href={item.href}
                className="flex items-center space-x-2 text-sm cursor-pointer hover:text-purple-400"
                activeClassName="text-purple-400 font-semibold"
              >
                <>
                  {item.icon}
                  <span>{item.name}</span>
                </>
              </NavLink>
              {item.badge && (
                <span className="bg-purple-500 text-xs rounded-full px-2">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-sm">
        <p className="mb-2">Want to grow your Instagram?</p>
        <Button variant="secondary" className="w-full text-white">
          START
        </Button>
      </div>
    </aside>
  );
}
