import { Search, Bell, Menu, X, Sprout } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cocoa-700/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Sprout className="w-6 h-6 text-earth-300" />
            <span className="text-white font-bold text-lg tracking-tight">
              Agri<span className="text-earth-300">Learn</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-earth-300 focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search button mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Notification */}
            <button className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sunset-500 rounded-full" />
            </button>

            {/* Login button desktop */}
            <Link
              to="/login"
              className="hidden md:inline-flex items-center px-4 py-1.5 bg-clay-500 hover:bg-clay-600 text-white text-sm font-medium rounded-full transition-colors shadow-[0_2px_4px_rgba(196,92,38,0.25)]"
            >
              Se connecter
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-earth-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-cocoa-700 border-t border-white/10 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {[
              { label: "Accueil", path: "/" },
              { label: "Cours", path: "/catalog" },
              { label: "Mon apprentissage", path: "/my-learning" },
              { label: "Certifications", path: "/certifications" },
              { label: "Communauté", path: "/community" },
              { label: "Formations locales", path: "/events" },
              { label: "Se connecter", path: "/login" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-earth-600 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
