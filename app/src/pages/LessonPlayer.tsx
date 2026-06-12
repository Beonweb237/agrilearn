import { useParams, useNavigate } from "react-router";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Award,
  FileText,
  Circle,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/hooks/useStore";

export default function LessonPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number[]>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const lessonId = parseInt(id || "0");

  const { data: lesson, isLoading } = trpc.lesson.getById.useQuery(
    { id: lessonId },
    { enabled: lessonId > 0 }
  );

  // Get course info for slug-based navigation
  const { data: courseInfo } = trpc.course.getById.useQuery(
    { id: lesson?.courseId || 0 },
    { enabled: !!lesson?.courseId }
  );

  // Get course lessons for navigation
  const { data: courseLessons } = trpc.lesson.getByCourse.useQuery(
    { courseId: lesson?.courseId || 0 },
    { enabled: !!lesson?.courseId }
  );

  const submitQuiz = trpc.quiz.submit.useMutation({
    onSuccess: (data) => {
      setQuizResult(data);
      if (data.passed) {
        showToast(`Félicitations ! Score: ${data.score}%`, "success");
      } else {
        showToast(`Score: ${data.score}%. Réessayez !`, "error");
      }
    },
  });

  const updateProgress = trpc.lesson.updateProgress.useMutation({
    onSuccess: () => {
      showToast("Progrès sauvegardé !", "success");
    },
  });

  useEffect(() => {
    setShowQuiz(false);
    setQuizResult(null);
    setQuizAnswers({});
    setProgress(0);
    setIsPlaying(false);
  }, [lessonId]);

  if (isLoading || !lesson) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentIndex = courseLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? courseLessons?.[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < (courseLessons?.length || 0) - 1
      ? courseLessons?.[currentIndex + 1]
      : null;

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleQuizAnswer = (questionId: number, optionId: number) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }));
  };

  const handleSubmitQuiz = () => {
    if (!lesson.quiz) return;
    const answers = Object.entries(quizAnswers).map(([questionId, selectedOptionIds]) => ({
      questionId: parseInt(questionId),
      selectedOptionIds,
    }));
    submitQuiz.mutate({ quizId: lesson.quiz.id, answers });
  };

  const handleDownload = () => {
    showToast("Leçon téléchargée pour consultation hors-ligne", "success");
  };

  return (
    <div className="min-h-screen bg-sand-50 pt-0 pb-6">
      {/* Video Player */}
      <div
        className={`relative bg-black ${
          isFullscreen ? "fixed inset-0 z-[70]" : "w-full aspect-video max-h-[60vh]"
        }`}
      >
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={"/course-cacao.jpg"}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          playsInline
        >
          <source src="" type="video/mp4" />
        </video>

        {/* Play Overlay (when paused) */}
        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={handleTogglePlay}
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Play size={28} className="text-clay-500 ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={() => navigate(courseInfo?.slug ? `/course/${courseInfo.slug}` : `/catalog`)}
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <span className="text-xs text-white/70 bg-black/30 px-2 py-1 rounded-full">
            Leçon {currentIndex + 1}/{courseLessons?.length || 0}
          </span>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-3 px-3">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-3"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-clay-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="text-white hover:text-clay-300 transition-colors"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
              </button>
              <span className="text-white/80 text-xs font-mono">
                {Math.floor((progress / 100) * (lesson.videoDuration || 10))}:{"00"} /{" "}
                {lesson.videoDuration || 10}:00
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quality selector */}
              <select className="bg-black/40 text-white/80 text-[10px] px-2 py-1 rounded border-none focus:outline-none">
                <option>Auto (144p)</option>
                <option>240p</option>
                <option>360p</option>
              </select>
              <button
                onClick={handleDownload}
                className="text-white/70 hover:text-white transition-colors p-1.5"
                title="Télécharger"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white/70 hover:text-white transition-colors p-1.5"
              >
                <Maximize size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
        <h1 className="text-lg font-bold text-charcoal mb-2">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-sm text-warm-gray leading-relaxed mb-4">{lesson.description}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6 bg-cream-50 rounded-xl p-3 border border-earth-100">
          <button
            onClick={() => prevLesson && navigate(`/lesson/${prevLesson.id}`)}
            disabled={!prevLesson}
            className="flex items-center gap-1.5 text-sm font-medium text-earth-600 disabled:text-gray-300 transition-colors"
          >
            <ChevronLeft size={16} />
            Précédent
          </button>
          <span className="text-xs text-warm-gray font-medium">
            {currentIndex + 1} / {courseLessons?.length || 0}
          </span>
          <button
            onClick={() => nextLesson && navigate(`/lesson/${nextLesson.id}`)}
            disabled={!nextLesson}
            className="flex items-center gap-1.5 text-sm font-medium text-earth-600 disabled:text-gray-300 transition-colors"
          >
            Suivant
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Resources */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-charcoal mb-2">Ressources</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 bg-cream-50 rounded-lg p-3 border border-earth-100 hover:border-earth-200 transition-colors text-left">
              <FileText size={18} className="text-earth-500" />
              <div className="flex-1">
                <p className="text-sm text-charcoal font-medium">Guide pratique PDF</p>
                <p className="text-xs text-warm-gray">2.4 MB</p>
              </div>
              <Download size={16} className="text-warm-gray" />
            </button>
          </div>
        </div>

        {/* Quiz Section */}
        {lesson.hasQuiz && lesson.quiz && (
          <div className="mb-6">
            {!showQuiz && !quizResult && (
              <button
                onClick={() => setShowQuiz(true)}
                className="w-full flex items-center justify-center gap-2 bg-earth-700 hover:bg-earth-800 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Award size={18} />
                Commencer le quiz de validation
              </button>
            )}

            {showQuiz && !quizResult && (
              <div className="bg-cream-50 rounded-xl border border-earth-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-charcoal">{lesson.quiz.title}</h3>
                  <span className="text-xs bg-earth-100 text-earth-600 px-2 py-1 rounded-full font-medium">
                    {lesson.quiz.questions.length} questions - {lesson.quiz.passingScore}% pour valider
                  </span>
                </div>

                <div className="space-y-5">
                  {lesson.quiz.questions.map((q: any, qIndex: number) => (
                    <div key={q.id} className="border-t border-earth-100 pt-4 first:border-0 first:pt-0">
                      <p className="text-sm font-medium text-charcoal mb-3">
                        {qIndex + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt: any) => {
                          const isSelected = quizAnswers[q.id]?.includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleQuizAnswer(q.id, opt.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? "border-earth-400 bg-earth-50"
                                  : "border-earth-100 hover:border-earth-200 bg-white"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  isSelected
                                    ? "border-earth-500 bg-earth-500"
                                    : "border-earth-300"
                                }`}
                              >
                                {isSelected && (
                                  <Circle size={10} className="text-white" fill="white" />
                                )}
                              </div>
                              <span className="text-sm text-charcoal">{opt.optionText}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < lesson.quiz.questions.length}
                  className="w-full mt-5 bg-clay-500 hover:bg-clay-600 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Valider mes réponses
                </button>
              </div>
            )}

            {quizResult && (
              <div className="bg-cream-50 rounded-xl border border-earth-100 p-5 text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    quizResult.passed ? "bg-earth-100" : "bg-clay-100"
                  }`}
                >
                  {quizResult.passed ? (
                    <Award size={32} className="text-earth-600" />
                  ) : (
                    <RotateCcw size={32} className="text-clay-500" />
                  )}
                </div>
                <h3
                  className={`text-lg font-bold mb-1 ${
                    quizResult.passed ? "text-earth-700" : "text-clay-600"
                  }`}
                >
                  {quizResult.passed ? "Félicitations !" : "Réessayez"}
                </h3>
                <p className="text-sm text-warm-gray mb-3">
                  Score: {quizResult.score}% ({quizResult.correctAnswers}/
                  {quizResult.totalQuestions} correct)
                </p>
                {quizResult.passed ? (
                  <div className="space-y-2">
                    <p className="text-sm text-earth-600 font-medium">
                      Module validé ! Vous pouvez passer à la leçon suivante.
                    </p>
                    {nextLesson && (
                      <button
                        onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                        className="inline-flex items-center gap-2 bg-earth-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm"
                      >
                        Leçon suivante
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setQuizResult(null);
                      setQuizAnswers({});
                    }}
                    className="inline-flex items-center gap-2 bg-clay-500 text-white font-semibold px-5 py-2.5 rounded-full text-sm"
                  >
                    <RotateCcw size={16} />
                    Réessayer
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mark complete */}
        <button
          onClick={() => {
            updateProgress.mutate({
              userId: 1,
              lessonId: lesson.id,
              courseId: lesson.courseId,
              isCompleted: true,
              watchProgress: 100,
            });
          }}
          className="w-full flex items-center justify-center gap-2 bg-earth-100 hover:bg-earth-200 text-earth-700 font-semibold py-3 rounded-xl transition-colors"
        >
          <CheckCircle size={18} />
          Marquer comme terminé
        </button>
      </div>
    </div>
  );
}
