import { useState } from "react";
import { MessageCircle, Users, Eye, MessageSquare, Plus, TreePalm, Coffee, Wheat, Sprout, Bird, PiggyBank, Calculator, MapPin } from "lucide-react";
import { trpc } from "@/providers/trpc";

const categoryIcons: Record<string, any> = {
  "TreePalm": TreePalm,
  "Coffee": Coffee,
  "Wheat": Wheat,
  "Sprout": Sprout,
  "Bird": Bird,
  "PiggyBank": PiggyBank,
  "Calculator": Calculator,
  "MapPin": MapPin,
};

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");

  const { data: categories } = trpc.forum.getCategories.useQuery();
  const { data: topics } = trpc.forum.getTopics.useQuery(
    selectedCategory ? { categoryId: selectedCategory } : undefined
  );

  const createTopic = trpc.forum.createTopic.useMutation({
    onSuccess: () => {
      setShowNewTopic(false);
      setNewTopicTitle("");
      setNewTopicContent("");
    },
  });

  return (
    <div className="min-h-screen bg-sand-50 pt-14 pb-20 md:pb-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-bold text-charcoal mb-1">Communauté</h1>
        <p className="text-sm text-warm-gray mb-5">
          Échangez avec d&apos;autres agriculteurs camerounais
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
              selectedCategory === null
                ? "bg-earth-700 text-white border-earth-700"
                : "bg-cream-50 border-earth-100 text-charcoal hover:border-earth-200"
            }`}
          >
            <MessageCircle size={18} />
            <div>
              <p className="text-xs font-semibold">Tous</p>
              <p className="text-[10px] opacity-70">Toutes discussions</p>
            </div>
          </button>
          {categories?.map((cat) => {
            const IconComponent = categoryIcons[cat.icon || ""] || MessageCircle;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                  selectedCategory === cat.id
                    ? "bg-earth-700 text-white border-earth-700"
                    : "bg-cream-50 border-earth-100 text-charcoal hover:border-earth-200"
                }`}
              >
                <IconComponent size={18} style={{ color: selectedCategory === cat.id ? "white" : cat.color || undefined }} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{cat.name}</p>
                  <p className="text-[10px] opacity-70">{cat.topicCount} discussions</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Topics List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-charcoal">
            Discussions récentes
          </h2>
          <button
            onClick={() => setShowNewTopic(!showNewTopic)}
            className="inline-flex items-center gap-1.5 bg-clay-500 hover:bg-clay-600 text-white text-xs font-medium px-3 py-2 rounded-full transition-colors"
          >
            <Plus size={14} />
            Nouveau sujet
          </button>
        </div>

        {/* New Topic Form */}
        {showNewTopic && (
          <div className="bg-cream-50 rounded-xl border border-earth-100 p-4 mb-4">
            <h3 className="text-sm font-semibold text-charcoal mb-3">Nouvelle discussion</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Titre de votre question"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-earth-200 rounded-lg text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:border-earth-400"
              />
              <textarea
                placeholder="Décrivez votre question en détail..."
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 bg-white border border-earth-200 rounded-lg text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:border-earth-400 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewTopic(false)}
                  className="px-4 py-2 text-xs font-medium text-warm-gray hover:text-charcoal transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (selectedCategory && newTopicTitle && newTopicContent) {
                      createTopic.mutate({
                        categoryId: selectedCategory,
                        userId: 1,
                        title: newTopicTitle,
                        content: newTopicContent,
                      });
                    }
                  }}
                  disabled={!selectedCategory || !newTopicTitle || !newTopicContent}
                  className="bg-earth-700 hover:bg-earth-800 disabled:opacity-40 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topics */}
        <div className="space-y-3">
          {topics?.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle size={32} className="text-earth-300 mx-auto mb-2" />
              <p className="text-sm text-warm-gray">
                Aucune discussion dans cette catégorie. Soyez le premier à poster !
              </p>
            </div>
          ) : (
            topics?.map((topic) => (
              <div
                key={topic.id}
                className="bg-cream-50 rounded-xl p-4 border border-earth-100 hover:border-earth-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-earth-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-earth-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-charcoal mb-1 line-clamp-1">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-warm-gray line-clamp-2 mb-2">
                      {topic.content}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-warm-gray">
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {topic.viewCount} vues
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={11} />
                        {topic.replyCount} réponses
                      </span>
                      <span>
                        {new Date(topic.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
