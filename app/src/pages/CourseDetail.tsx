import { useParams, useNavigate } from "react-router";
import { Play, Clock, Star, ChevronDown, ChevronUp, Lock, Award, Users, ArrowLeft, Smartphone, Globe } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";

const categoryLabels: Record<string, string> = {
  cultures_vivrieres: "Cultures vivrières",
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

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useStore();
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { data: course, isLoading } = trpc.course.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const enrollMutation = trpc.enrollment.enroll.useMutation({
    onSuccess: () => {
      showToast("Inscription réussie !", "success");
      setIsEnrolling(false);
    },
    onError: () => {
      showToast("Erreur lors de l'inscription", "error");
      setIsEnrolling(false);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-50 pt-14 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-earth-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-sand-50 pt-14 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-charcoal mb-2">Cours non trouvé</h2>
          <button
            onClick={() => navigate("/catalog")}
            className="text-earth-600 text-sm font-medium"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    setIsEnrolling(true);
    // In a real app, use actual userId from auth
    enrollMutation.mutate({
      userId: 1,
      courseId: course.id,
      amountPaid: course.price || 0,
    });
  };

  // Group lessons by module
  const modules = course.lessons?.reduce((acc: any, lesson: any) => {
    const moduleNum = lesson.moduleNumber;
    if (!acc[moduleNum]) {
      acc[moduleNum] = {
        title: lesson.moduleTitle,
        lessons: [],
      };
    }
    acc[moduleNum].lessons.push(lesson);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-sand-50 pt-14 pb-28 md:pb-6">
      {/* Hero Image */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src={course.image || "/course-cacao.jpg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Play button */}
        <button
          onClick={() => {
            const firstLesson = course.lessons?.[0];
            if (firstLesson) {
              navigate(`/lesson/${firstLesson.id}`);
            }
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Play size={28} className="text-clay-500 ml-1" fill="currentColor" />
          </div>
        </button>

        {/* Bottom info */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-3 text-white/90 text-xs">
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {course.duration} min
            </span>
            <span className="flex items-center gap-1">
              <Star size={13} className="text-gold-500 fill-gold-500" />
              {course.rating} ({course.studentsCount} étudiants)
            </span>
          </div>
          {course.isPremium && (
            <span className="bg-clay-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              PREMIUM
            </span>
          )}
        </div>
      </div>

      {/* Course Info */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
        {/* Category & Level */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-earth-100 text-earth-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {categoryLabels[course.category] || course.category}
          </span>
          <span className="bg-sand-200 text-warm-gray text-xs font-medium px-2.5 py-1 rounded-full">
            {levelLabels[course.level]}
          </span>
          {course.region && (
            <span className="flex items-center gap-1 bg-sky-50 text-sky-600 text-xs font-medium px-2.5 py-1 rounded-full">
              <Globe size={11} />
              {course.region}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-charcoal mb-3 leading-snug">
          {course.title}
        </h1>

        {/* Instructor */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-earth-200 rounded-full flex items-center justify-center">
            <Users size={18} className="text-earth-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal">
              {course.instructorName || "Expert AgriLearn"}
            </p>
            <p className="text-xs text-warm-gray">
              {course.instructorTitle || "Instructeur agricole"}
            </p>
          </div>
          <span className="ml-auto bg-earth-50 text-earth-600 text-[10px] font-bold px-2 py-1 rounded-full border border-earth-200">
            IRAD
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-warm-gray leading-relaxed mb-6">
          {course.description}
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2 bg-cream-50 rounded-lg p-3">
            <Smartphone size={16} className="text-earth-500" />
            <span className="text-xs text-charcoal font-medium">Compatible bas débit</span>
          </div>
          <div className="flex items-center gap-2 bg-cream-50 rounded-lg p-3">
            <Award size={16} className="text-earth-500" />
            <span className="text-xs text-charcoal font-medium">
              {course.requiresCertification ? "Certification payante" : "Certification gratuite"}
            </span>
          </div>
        </div>

        {/* Syllabus */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-charcoal mb-3">
            Contenu du cours ({course.lessonsCount} leçons)
          </h2>

          {modules &&
            Object.entries(modules).map(([moduleNum, moduleData]: [string, any]) => (
              <div
                key={moduleNum}
                className="bg-cream-50 rounded-xl border border-earth-100 mb-2 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedModule(
                      expandedModule === Number(moduleNum) ? null : Number(moduleNum)
                    )
                  }
                  className="w-full flex items-center justify-between p-3.5 text-left hover:bg-earth-50/50 transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-earth-500">
                      Module {moduleNum}
                    </span>
                    <h3 className="text-sm font-semibold text-charcoal mt-0.5">
                      {moduleData.title}
                    </h3>
                    <span className="text-xs text-warm-gray">
                      {moduleData.lessons.length} leçons
                    </span>
                  </div>
                  {expandedModule === Number(moduleNum) ? (
                    <ChevronUp size={18} className="text-warm-gray flex-shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-warm-gray flex-shrink-0" />
                  )}
                </button>

                {expandedModule === Number(moduleNum) && (
                  <div className="border-t border-earth-100">
                    {moduleData.lessons.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-earth-50/50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-earth-100 rounded-full flex items-center justify-center">
                          {lesson.isPreview ? (
                            <Play size={14} className="text-earth-600 ml-0.5" />
                          ) : (
                            <Lock size={14} className="text-warm-gray" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-charcoal truncate">
                            {lesson.lessonNumber}. {lesson.title}
                          </p>
                          <span className="text-xs text-warm-gray">
                            {lesson.videoDuration} min
                          </span>
                        </div>
                        {lesson.hasQuiz && (
                          <span className="flex-shrink-0 text-[10px] bg-clay-100 text-clay-600 px-1.5 py-0.5 rounded font-medium">
                            Quiz
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-earth-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 md:max-w-md md:mx-auto md:bottom-4 md:rounded-2xl md:border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-lg font-bold text-charcoal">
              {(course.price || 0) === 0 ? (
                <span className="text-earth-600">Gratuit</span>
              ) : (
                <span className="text-clay-500">{(course.price || 0).toLocaleString()} FCFA</span>
              )}
            </div>
            <div className="text-xs text-warm-gray">
              {course.requiresCertification ? "Certification incluse" : "Accès illimité"}
            </div>
          </div>
          <button
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="bg-clay-500 hover:bg-clay-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-[0_2px_4px_rgba(196,92,38,0.25)] active:scale-[0.96]"
          >
            {isEnrolling ? "..." : (course.price || 0) === 0 ? "S'inscrire" : "Payer via Mobile Money"}
          </button>
        </div>
      </div>
    </div>
  );
}
