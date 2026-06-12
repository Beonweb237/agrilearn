import { Link } from "react-router";
import {
  User,
  Bell,
  Globe,
  CreditCard,
  HardDrive,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  BookOpen,
  Sprout,
  Edit3,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: User, label: "Informations personnelles", path: "#" },
  { icon: Bell, label: "Notifications", path: "#" },
  { icon: Globe, label: "Langue", subtitle: "Français", path: "#" },
  { icon: CreditCard, label: "Paiements Mobile Money", path: "#" },
  { icon: HardDrive, label: "Stockage", subtitle: "1.2 Go utilisés", path: "#" },
  { icon: HelpCircle, label: "FAQ & Support", path: "#" },
];

export default function Profile() {
  const auth = useAuth();
  const user = auth.user;

  return (
    <div className="min-h-screen bg-sand-50 pt-14 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-earth-700 to-earth-800 rounded-2xl p-6 text-center mb-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/30">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || ""}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Sprout size={32} className="text-earth-200" />
              )}
            </div>
            <h2 className="text-lg font-bold text-white mb-0.5">
              {user?.name || "Agriculteur Camerounais"}
            </h2>
            <p className="text-sm text-earth-200 mb-1">
              {user?.email || "membre@agrilearn.cm"}
            </p>
            <p className="text-xs text-earth-300 mb-3">
              Membre depuis {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </p>
            <button className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm">
              <Edit3 size={12} />
              Modifier
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link
            to="/my-learning"
            className="bg-cream-50 rounded-xl p-4 text-center border border-earth-100 hover:border-earth-200 transition-colors"
          >
            <BookOpen size={20} className="text-earth-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-charcoal">3</p>
            <p className="text-[10px] text-warm-gray">Cours en cours</p>
          </Link>
          <Link
            to="/certifications"
            className="bg-cream-50 rounded-xl p-4 text-center border border-earth-100 hover:border-earth-200 transition-colors"
          >
            <Award size={20} className="text-gold-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-charcoal">0</p>
            <p className="text-[10px] text-warm-gray">Certificats</p>
          </Link>
          <div className="bg-cream-50 rounded-xl p-4 text-center border border-earth-100">
            <Sprout size={20} className="text-earth-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-charcoal">Débutant</p>
            <p className="text-[10px] text-warm-gray">Niveau</p>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-cream-50 rounded-xl border border-earth-100 overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-earth-50/50 transition-colors ${
                index < menuItems.length - 1 ? "border-b border-earth-100" : ""
              }`}
            >
              <item.icon size={18} className="text-earth-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-charcoal font-medium">{item.label}</p>
                {item.subtitle && (
                  <p className="text-xs text-warm-gray">{item.subtitle}</p>
                )}
              </div>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => auth.logout()}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-medium py-3 rounded-xl transition-colors border border-red-100"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
