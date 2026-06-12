import { useState } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import CourseCard from "@/components/CourseCard";

const categories = [
  { key: "", label: "Tous" },
  { key: "cultures_vivrieres", label: "Cultures vivrières" },
  { key: "elevage", label: "Élevage" },
  { key: "gestion", label: "Gestion" },
  { key: "cacao", label: "Cacao" },
  { key: "cafe", label: "Café" },
  { key: "volailles", label: "Volailles" },
  { key: "porcs", label: "Porcs" },
  { key: "bovins", label: "Bovins" },
  { key: "marches", label: "Marchés" },
];

const levels = [
  { key: "", label: "Tous niveaux" },
  { key: "debutant", label: "Débutant" },
  { key: "intermediaire", label: "Intermédiaire" },
  { key: "avance", label: "Avancé" },
];

const sorts = [
  { key: "popular", label: "Plus populaires" },
  { key: "recent", label: "Plus récents" },
  { key: "rating", label: "Mieux notés" },
  { key: "price-asc", label: "Prix croissant" },
];

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSort, setSelectedSort] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: courses, isLoading } = trpc.course.list.useQuery({
    category: selectedCategory || undefined,
    level: selectedLevel || undefined,
    search: searchQuery || undefined,
    limit: 50,
  });

  const filteredCourses = courses
    ?.filter((c) => {
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "popular":
          return (b.studentsCount || 0) - (a.studentsCount || 0);
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "rating":
          return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-sand-50 pt-14 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-cream-50 border-b border-earth-100 sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl font-bold text-charcoal mb-1">Tous les cours</h1>
          <p className="text-sm text-warm-gray">
            {filteredCourses?.length || 0} formations pour moderniser votre agriculture
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-earth-100 sticky top-[105px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search */}
          <div className="py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-sand-50 border border-earth-200 rounded-xl text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:border-earth-400 focus:ring-1 focus:ring-earth-200 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.key
                    ? "bg-earth-700 text-white"
                    : "bg-sand-50 text-warm-gray border border-earth-200 hover:border-earth-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filter Toggle + Sort */}
          <div className="flex items-center justify-between pb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-gray hover:text-charcoal transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filtres avancés
            </button>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="text-xs bg-transparent text-warm-gray focus:outline-none cursor-pointer"
            >
              {sorts.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="pb-3 space-y-3 border-t border-earth-100 pt-3">
              <div>
                <span className="text-xs font-medium text-charcoal mb-2 block">Niveau</span>
                <div className="flex gap-2 flex-wrap">
                  {levels.map((level) => (
                    <button
                      key={level.key}
                      onClick={() => setSelectedLevel(level.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedLevel === level.key
                          ? "bg-earth-700 text-white"
                          : "bg-sand-50 text-warm-gray border border-earth-200"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-cream-50 rounded-xl overflow-hidden animate-pulse">
                <div className="h-40 bg-earth-100" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-earth-100 rounded w-3/4" />
                  <div className="h-3 bg-earth-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-earth-400" />
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              Aucun cours trouvé
            </h3>
            <p className="text-sm text-warm-gray mb-4">
              Essayez d&apos;autres filtres ou revenez plus tard.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedLevel("");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 bg-earth-700 text-white font-medium px-5 py-2.5 rounded-full text-sm hover:bg-earth-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCourses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
