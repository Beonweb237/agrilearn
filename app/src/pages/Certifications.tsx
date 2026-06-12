import { Award, Lock, Share2, Download, Sprout, TreePalm, Coffee, Trophy, Calculator, MessageCircle, Medal } from "lucide-react";
import { trpc } from "@/providers/trpc";

const iconMap: Record<string, any> = {
  Sprout,
  TreePalm,
  Coffee,
  Award,
  Calculator,
  Trophy,
  MessageCircle,
  Medal,
};

export default function Certifications() {
  const { data: badges, isLoading } = trpc.badge.list.useQuery();
  const { data: userBadges } = trpc.badge.getUserBadges.useQuery({ userId: 1 });

  const earnedBadgeIds = new Set(userBadges?.map((ub) => ub.badgeId) || []);

  return (
    <div className="min-h-screen bg-sand-50 pt-14 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award size={28} className="text-gold-500" />
          </div>
          <h1 className="text-xl font-bold text-charcoal mb-1">Mes certifications</h1>
          <p className="text-sm text-warm-gray">
            {userBadges?.length || 0} badge{userBadges?.length !== 1 ? "s" : ""} obtenu
            {userBadges?.length !== 1 ? "s" : ""} sur {badges?.length || 0}
          </p>
        </div>

        {/* Progress */}
        <div className="bg-cream-50 rounded-xl p-4 border border-earth-100 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-charcoal">Progression globale</span>
            <span className="text-sm font-bold text-earth-600">
              {badges?.length
                ? Math.round(((userBadges?.length || 0) / badges.length) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="h-2.5 bg-earth-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-earth-500 to-gold-500 rounded-full transition-all"
              style={{
                width: `${badges?.length ? ((userBadges?.length || 0) / badges.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 bg-earth-100 rounded-full mb-2" />
                <div className="h-3 bg-earth-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {badges?.map((badge) => {
              const isEarned = earnedBadgeIds.has(badge.id);
              const IconComponent = iconMap[badge.icon] || Award;

              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center text-center p-3 rounded-xl transition-all ${
                    isEarned
                      ? "bg-cream-50 border border-earth-100"
                      : "bg-gray-50 border border-gray-100 opacity-60"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                      isEarned ? "bg-earth-100" : "bg-gray-100"
                    }`}
                  >
                    {isEarned ? (
                      <IconComponent size={24} style={{ color: badge.color }} />
                    ) : (
                      <Lock size={20} className="text-gray-400" />
                    )}
                  </div>
                  <p className={`text-xs font-medium mb-0.5 ${isEarned ? "text-charcoal" : "text-gray-400"}`}>
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-warm-gray leading-tight line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Certificates Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-charcoal mb-4">Certificats obtenus</h2>
          {userBadges?.filter((ub) => ub.badge?.category === "completion" || ub.badge?.category === "premium").length === 0 ? (
            <div className="text-center py-8 bg-cream-50 rounded-xl border border-earth-100">
              <Medal size={32} className="text-earth-300 mx-auto mb-2" />
              <p className="text-sm text-warm-gray">
                Terminez un cours pour obtenir votre premier certificat.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userBadges
                ?.filter((ub) => ub.badge?.category === "completion" || ub.badge?.category === "premium")
                .map((ub) => (
                  <div
                    key={ub.id}
                    className="flex items-center gap-4 bg-cream-50 rounded-xl p-4 border border-earth-100"
                  >
                    <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award size={24} className="text-gold-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-charcoal">
                        {ub.badge?.name}
                      </h3>
                      <p className="text-xs text-warm-gray">
                        Obtenu le {new Date(ub.earnedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-earth-100 rounded-full transition-colors" title="Partager">
                        <Share2 size={16} className="text-earth-600" />
                      </button>
                      <button className="p-2 hover:bg-earth-100 rounded-full transition-colors" title="Télécharger PDF">
                        <Download size={16} className="text-earth-600" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
