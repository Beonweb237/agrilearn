import { useState } from "react";
import { Link } from "react-router";
import { BookOpen, CheckCircle, Download, Clock, PlayCircle, Trophy } from "lucide-react";
import { trpc } from "@/providers/trpc";

const tabs = [
  { key: "active", label: "En cours", icon: BookOpen },
  { key: "completed", label: "Terminés", icon: CheckCircle },
  { key: "downloads", label: "Téléchargés", icon: Download },
];

export default function MyLearning() {
  const [activeTab, setActiveTab] = useState("active");

  const { data: enrollments, isLoading } = trpc.enrollment.getUserEnrollments.useQuery({
    userId: 1,
  });

  const filteredEnrollments = enrollments?.filter((e) => {
    if (activeTab === "active") return e.status === "active";
    if (activeTab === "completed") return e.status === "completed";
    if (activeTab === "downloads") return true; // Show all for now
    return true;
  });

  return (
    <div className="min-h-screen bg-sand-50 pt-14 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-bold text-charcoal mb-1">Mon apprentissage</h1>
        <p className="text-sm text-warm-gray mb-5">
          Suivez votre progression et reprenez vos cours
        </p>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream-50 rounded-xl p-1 mb-6 border border-earth-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-earth-700 text-white shadow-sm"
                  : "text-warm-gray hover:text-charcoal"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-cream-50 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-earth-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-earth-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredEnrollments?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen size={24} className="text-earth-400" />
            </div>
            <h3 className="text-base font-semibold text-charcoal mb-1">
              Aucun cours {activeTab === "active" ? "en cours" : activeTab === "completed" ? "terminé" : "téléchargé"}
            </h3>
            <p className="text-sm text-warm-gray mb-4">
              {activeTab === "active"
                ? "Inscrivez-vous à un cours pour commencer votre apprentissage."
                : "Terminez vos cours pour les voir apparaître ici."}
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-earth-700 text-white font-medium px-5 py-2.5 rounded-full text-sm"
            >
              Explorer les cours
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEnrollments?.map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/course/${enrollment.course?.slug}`}
                className="flex items-center gap-4 bg-cream-50 rounded-xl p-4 border border-earth-100 hover:border-earth-200 transition-colors"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-earth-100">
                  <img
                    src={enrollment.course?.image || "/course-cacao.jpg"}
                    alt={enrollment.course?.title || ""}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-charcoal truncate mb-1">
                    {enrollment.course?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-warm-gray">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {enrollment.course?.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle size={11} />
                      {enrollment.course?.lessonsCount} leçons
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-earth-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-earth-500 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-earth-600">
                      {enrollment.progress}%
                    </span>
                  </div>
                </div>

                {/* Status */}
                {enrollment.status === "completed" && (
                  <Trophy size={18} className="text-gold-500 flex-shrink-0" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
