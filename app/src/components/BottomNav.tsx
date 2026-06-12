import { Home, BookOpen, Award, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router";

const navItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: BookOpen, label: "Cours", path: "/catalog" },
  { icon: Award, label: "Certifs", path: "/certifications" },
  { icon: MessageCircle, label: "Forum", path: "/community" },
  { icon: User, label: "Profil", path: "/profile" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-earth-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-earth-700"
                  : "text-gray-400 hover:text-earth-500"
              }`}
            >
              <item.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={isActive ? "text-earth-700" : ""}
              />
              <span
                className={`text-[10px] leading-tight ${
                  isActive ? "font-semibold" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
