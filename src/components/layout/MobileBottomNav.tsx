import { Home, LayoutGrid, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navs = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Categories', path: '/categories', icon: LayoutGrid },
  { name: 'Wishlist', path: '/wishlist', icon: Heart },
];

export function MobileBottomNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background shadow-t flex justify-around items-center border-t border-[#00f7ff]/30 px-1 py-1 md:hidden">
      {navs.map(({ name, path, icon: Icon }) => {
        const active = location.pathname === path || (path === '/' && location.pathname === '/');
        return (
          <Link
            key={name}
            to={path}
            className={`flex flex-col items-center justify-center px-2 py-1 gap-0.5 rounded transition-colors ${active ? 'text-[#00f7ff]' : 'text-muted-foreground hover:text-[#00f7ff]'} text-[11px]`}
            aria-label={name}
          >
            <Icon className={`w-6 h-6 mb-0.5 ${active ? 'drop-shadow-[0_0_4px_#00f7ff60]' : ''}`} />
            <span className="text-[10px] font-medium tracking-wide">{name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
