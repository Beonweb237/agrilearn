import { Clock, PlayCircle, Star } from "lucide-react";
import { Link } from "react-router";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    category: string;
    isPremium: boolean;
    price: number | null;
    duration: number;
    lessonsCount: number;
    rating: string | null;
    studentsCount: number | null;
    instructorName: string | null;
    level: string;
    progress?: number;
    isEnrolled?: boolean;
  };
  compact?: boolean;
}

const categoryLabels: Record<string, string> = {
  cultures_vivrieres: "Cultures",
  elevage: "Élevage",
  gestion: "Gestion",
  cacao: "Cacao",
  cafe: "Café",
  volailles: "Volailles",
  porcs: "Porcs",
  bovins: "Bovins",
  marches: "Marchés",
  techniques: "Techniques",
  engrais: "Engrais",
  finance: "Finance",
};

const levelLabels: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export default function CourseCard({ course, compact = false }: CourseCardProps) {
  return (
    <Link
      to={`/course/${course.slug}`}
      className="group block bg-cream-50 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${compact ? "h-32" : "h-40"}`}>
        <img
          src={course.image || "/course-cacao.jpg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Premium Badge */}
        {course.isPremium && (
          <div className="absolute top-2 right-2 bg-clay-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Premium
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-earth-700/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {categoryLabels[course.category] || course.category}
        </div>
        {/* Progress overlay */}
        {course.progress !== undefined && course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-earth-100">
            <div
              className="h-full bg-earth-500 transition-all duration-500"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-3 ${compact ? "space-y-1.5" : "space-y-2"}`}>
        <h3
          className={`font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-earth-700 transition-colors ${
            compact ? "text-sm" : "text-[15px]"
          }`}
        >
          {course.title}
        </h3>

        <p className="text-xs text-warm-gray">
          {course.instructorName || "AgriLearn Expert"}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-warm-gray">
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-earth-400" />
            {course.duration} min
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle size={13} className="text-earth-400" />
            {course.lessonsCount} leçons
          </span>
          {course.rating && (
            <span className="flex items-center gap-1">
              <Star size={13} className="text-gold-500 fill-gold-500" />
              {course.rating}
            </span>
          )}
        </div>

        {/* Price & Level */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs bg-earth-50 text-earth-600 px-2 py-0.5 rounded-full font-medium">
            {levelLabels[course.level]}
          </span>
          <span
            className={`text-sm font-bold ${
              (course.price || 0) === 0
                ? "text-earth-600"
                : "text-clay-500"
            }`}
          >
            {(course.price || 0) === 0
              ? "Gratuit"
              : `${(course.price || 0).toLocaleString()} FCFA`}
          </span>
        </div>
      </div>
    </Link>
  );
}
