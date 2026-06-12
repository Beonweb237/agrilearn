import { Link } from "react-router";
import { Sprout, Users, BookOpen, Trophy, TrendingUp, ArrowRight, Download, WifiOff, PlayCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import CourseCard from "@/components/CourseCard";
import { useStore } from "@/hooks/useStore";
import { useEffect } from "react";

const categories = [
  { key: "cultures_vivrieres", label: "Cultures vivrières", icon: "🌱" },
  { key: "elevage", label: "Élevage", icon: "🐄" },
  { key: "gestion", label: "Gestion", icon: "💰" },
  { key: "cacao", label: "Cacao", icon: "🌿" },
  { key: "cafe", label: "Café", icon: "☕" },
  { key: "volailles", label: "Volailles", icon: "🐔" },
  { key: "porcs", label: "Porcs", icon: "🐷" },
  { key: "bovins", label: "Bovins", icon: "🐂" },
  { key: "marches", label: "Marchés", icon: "📈" },
];

const learningSteps = [
  {
    icon: BookOpen,
    title: "Choisissez un cours",
    description: "Accédez à +120 formations gratuites sur l'agriculture camerounaise",
  },
  {
    icon: PlayCircle,
    title: "Apprenez à votre rythme",
    description: "Vidéos courtes, téléchargeables hors-ligne, adaptées au bas débit",
  },
  {
    icon: Trophy,
    title: "Validez vos connaissances",
    description: "Quiz interactifs et examens par module avec retour immédiat",
  },
  {
    icon: TrendingUp,
    title: "Obtenez votre certificat",
    description: "Certification reconnue par l'IRAD et les partenaires agricoles",
  },
];

export default function Home() {
  const { data: featuredCourses, isLoading } = trpc.course.getFeatured.useQuery();
  const { showToast } = useStore();

  // Check offline status
  useEffect(() => {
    const handleOnline = () => showToast("Vous êtes de retour en ligne !", "success");
    const handleOffline = () => showToast("Mode hors-ligne activé", "info");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [showToast]);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-earth-800 via-earth-700 to-clay-600 pt-20 pb-12 overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
              <Sprout size={14} className="text-earth-300" />
              <span className="text-earth-200 text-xs font-medium">
                Plateforme EdTech Agricole du Cameroun
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              Apprenez. Cultivez.{" "}
              <span className="text-earth-300">Prospérez.</span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg mb-6 leading-relaxed max-w-lg">
              Des formations pratiques par des experts agricoles camerounais.
              Accessible sur tous les téléphones, même en 2G.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-clay-500 hover:bg-clay-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-[0_2px_4px_rgba(196,92,38,0.25)] hover:shadow-[0_4px_12px_rgba(196,92,38,0.35)] active:scale-[0.96]"
              >
                <BookOpen size={18} />
                Commencer gratuitement
              </Link>
              <Link
                to="/my-learning"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-full text-sm transition-all backdrop-blur-sm border border-white/20"
              >
                <Download size={18} />
                Mes cours
              </Link>
            </div>

            {/* Offline badge */}
            <div className="mt-4 inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 rounded-full px-3 py-1.5">
              <WifiOff size={12} className="text-gold-400" />
              <span className="text-gold-300 text-xs font-medium">
                Fonctionne hors-ligne - Téléchargez vos cours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-sand-50 border-b border-earth-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-charcoal">Explorer par catégorie</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            <Link
              to="/catalog"
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-earth-700 text-white text-xs font-medium px-3 py-2 rounded-full transition-colors"
            >
              Tous
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to={`/catalog?category=${cat.key}`}
                className="flex-shrink-0 inline-flex items-center gap-1.5 bg-cream-50 border border-earth-200 text-earth-700 text-xs font-medium px-3 py-2 rounded-full hover:bg-earth-50 transition-colors"
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-8 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-charcoal">Cours recommandés</h2>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1 text-sm font-medium text-earth-600 hover:text-earth-700 transition-colors"
            >
              Voir tout
              <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-cream-50 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-40 bg-earth-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-earth-100 rounded w-3/4" />
                    <div className="h-3 bg-earth-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredCourses?.slice(0, 8).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-8 bg-earth-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">10 500+</div>
              <div className="text-earth-300 text-sm">Agriculteurs formés</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">120+</div>
              <div className="text-earth-300 text-sm">Cours disponibles</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">85%</div>
              <div className="text-earth-300 text-sm">Taux de réussite</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">12</div>
              <div className="text-earth-300 text-sm">Régions couvertes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-10 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-charcoal mb-6 text-center">
            Votre parcours d&apos;apprentissage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningSteps.map((step, index) => (
              <div
                key={index}
                className="relative bg-cream-50 rounded-xl p-5 border border-earth-100 hover:border-earth-200 transition-colors"
              >
                <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center mb-3">
                  <step.icon size={20} className="text-earth-600" />
                </div>
                <div className="text-xs font-semibold text-earth-500 mb-1">
                  Étape {index + 1}
                </div>
                <h3 className="font-semibold text-charcoal text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-warm-gray leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Teaser */}
      <section className="py-10 bg-clay-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-clay-500/10 to-earth-500/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-charcoal mb-2">
                Rejoignez la communauté
              </h2>
              <p className="text-sm text-warm-gray mb-4 leading-relaxed">
                Échangez avec 10 000+ agriculteurs camerounais. Partagez vos expériences,
                posez vos questions et apprenez des autres.
              </p>
              <Link
                to="/community"
                className="inline-flex items-center gap-2 border-2 border-clay-500 text-clay-500 hover:bg-clay-500 hover:text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all"
              >
                <Users size={16} />
                Accéder au forum
              </Link>
            </div>
            <div className="flex-shrink-0 w-20 h-20 bg-clay-100 rounded-full flex items-center justify-center">
              <Users size={36} className="text-clay-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Promo */}
      <section className="py-10 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-charcoal mb-3">
                Apprenez même sans connexion
              </h2>
              <div className="space-y-3 mb-5">
                {[
                  "Téléchargez vos cours pour une consultation hors-ligne",
                  "Lecteur vidéo optimisé bas débit (2G/3G)",
                  "Quiz interactifs avec retour immédiat",
                  "Synchronisation automatique dès la connexion",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={16} className="text-earth-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-warm-gray">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-charcoal text-white text-xs font-medium px-3 py-2 rounded-lg">
                  <Download size={14} />
                  Android APK
                </span>
                <span className="inline-flex items-center gap-1.5 bg-earth-700 text-white text-xs font-medium px-3 py-2 rounded-lg">
                  <WifiOff size={14} />
                  PWA iOS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cocoa-700 text-white/80 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sprout size={20} className="text-earth-300" />
                <span className="font-bold text-white">AgriLearn</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                La plateforme d&apos;apprentissage agricole pour les agriculteurs camerounais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Apprendre</h4>
              <div className="space-y-2">
                {["Cultures vivrières", "Élevage", "Cacao", "Café", "Gestion"].map((item) => (
                  <Link
                    key={item}
                    to="/catalog"
                    className="block text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Communauté</h4>
              <div className="space-y-2">
                {["Forum", "Événements", "Blog", "Partenaires"].map((item) => (
                  <Link
                    key={item}
                    to={item === "Forum" ? "/community" : item === "Événements" ? "/events" : "/"}
                    className="block text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Partenaires</h4>
              <div className="space-y-2">
                <span className="block text-xs text-white/60">IRAD Cameroun</span>
                <span className="block text-xs text-white/60">MINADER</span>
                <span className="block text-xs text-white/60">FAO Cameroun</span>
                <span className="block text-xs text-white/60">GIZ</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-4 text-center text-xs text-white/40">
            © 2026 AgriLearn Cameroun. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
