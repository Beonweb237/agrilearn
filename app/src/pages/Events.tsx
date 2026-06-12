import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useStore } from "@/hooks/useStore";
import { useState } from "react";

export default function Events() {
  const { showToast } = useStore();
  const [selectedRegion, setSelectedRegion] = useState("");

  const { data: events, isLoading } = trpc.event.list.useQuery(
    selectedRegion ? { region: selectedRegion } : undefined
  );

  const registerMutation = trpc.event.register.useMutation({
    onSuccess: (data) => {
      if (data.alreadyRegistered) {
        showToast("Vous êtes déjà inscrit", "info");
      } else {
        showToast("Inscription réussie !", "success");
      }
    },
    onError: () => {
      showToast("Erreur lors de l'inscription", "error");
    },
  });

  const regions = ["Centre", "Littoral", "Ouest", "Sud", "Adamaoua", "Nord"];

  return (
    <div className="min-h-screen bg-sand-50 pt-14 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-bold text-charcoal mb-1">Formations locales</h1>
        <p className="text-sm text-warm-gray mb-5">
          Rencontrez nos experts près de chez vous
        </p>

        {/* Region Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1 mb-4">
          <button
            onClick={() => setSelectedRegion("")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedRegion === ""
                ? "bg-earth-700 text-white"
                : "bg-cream-50 text-warm-gray border border-earth-200"
            }`}
          >
            Toutes régions
          </button>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedRegion === region
                  ? "bg-earth-700 text-white"
                  : "bg-cream-50 text-warm-gray border border-earth-200"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Events List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-cream-50 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-earth-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-earth-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={32} className="text-earth-300 mx-auto mb-2" />
            <p className="text-sm text-warm-gray">
              Aucun événement à venir dans cette région.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events?.map((event) => {
              const eventDate = new Date(event.eventDate);
              const isFull = (event.registeredCount || 0) >= (event.maxParticipants || 0);

              return (
                <div
                  key={event.id}
                  className="bg-cream-50 rounded-xl border border-earth-100 overflow-hidden"
                >
                  <div className="flex">
                    {/* Date Badge */}
                    <div className="flex-shrink-0 w-16 bg-earth-700 flex flex-col items-center justify-center text-white py-3">
                      <span className="text-xs font-medium uppercase">
                        {eventDate.toLocaleDateString("fr-FR", { month: "short" })}
                      </span>
                      <span className="text-2xl font-bold">
                        {eventDate.getDate()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-charcoal mb-1">
                            {event.title}
                          </h3>
                          <div className="space-y-1">
                            <p className="flex items-center gap-1.5 text-xs text-warm-gray">
                              <MapPin size={12} className="text-earth-400" />
                              {event.location}
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-warm-gray">
                              <Clock size={12} className="text-earth-400" />
                              {eventDate.toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-warm-gray">
                              <Users size={12} className="text-earth-400" />
                              {event.registeredCount}/{event.maxParticipants} participants
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {event.isFree ? (
                            <span className="bg-earth-100 text-earth-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              GRATUIT
                            </span>
                          ) : (
                            <span className="bg-clay-100 text-clay-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {event.price?.toLocaleString()} FCFA
                            </span>
                          )}
                          <button
                            onClick={() =>
                              registerMutation.mutate({
                                eventId: event.id,
                                userId: 1,
                              })
                            }
                            disabled={isFull || registerMutation.isPending}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                              isFull
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-earth-700 text-white hover:bg-earth-800"
                            }`}
                          >
                            {isFull ? "Complet" : "S'inscrire"}
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-earth-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-earth-400 rounded-full"
                            style={{
                              width: `${Math.min(
                                ((event.registeredCount || 0) / (event.maxParticipants || 1)) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-warm-gray">
                          {Math.min(
                            Math.round(
                              ((event.registeredCount || 0) / (event.maxParticipants || 1)) * 100
                            ),
                            100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
