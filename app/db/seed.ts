import { getDb } from "../api/queries/connection";
import { eq } from "drizzle-orm";
import {
  courses,
  lessons,
  quizzes,
  quizQuestions,
  quizOptions,
  badges,
  forumCategories,
  events,
} from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // ============================================
  // COURSES (10 Pilot Courses)
  // ============================================
  const courseData = [
    {
      title: "Culture du Cacao : De la Plantation à la Récolte",
      slug: "culture-cacao-plantation-recolte",
      description: "Maîtrisez l'art de la culture du cacao au Cameroun. Ce cours complet couvre la sélection des variétés, la préparation du sol, la plantation, l'entretien et la récolte des cabosses. Basé sur les recommandations de l'IRAD et les pratiques des meilleurs producteurs camerounais.",
      shortDescription: "Apprenez à cultiver le cacao avec les techniques modernes adaptées au terroir camerounais.",
      image: "/course-cacao.jpg",
      category: "cacao" as const,
      level: "debutant" as const,
      region: "Centre, Sud, Est",
      isPremium: false,
      price: 0,
      duration: 180,
      lessonsCount: 12,
      rating: "4.8",
      studentsCount: 2340,
      instructorName: "Dr. Jean-Pierre Manga",
      instructorTitle: "Chercheur agronome - IRAD",
      isFeatured: true,
    },
    {
      title: "Culture du Café Arabica : Techniques Avancées",
      slug: "culture-cafe-arabica-avance",
      description: "Perfectionnez vos techniques de culture du café arabica dans les hautes terres du Cameroun. Découvrez les méthodes de traitement post-récolte, la fermentation et le séchage pour obtenir un café de specialty grade.",
      shortDescription: "Techniques avancées pour un café arabica de qualité premium.",
      image: "/course-cafe.jpg",
      category: "cafe" as const,
      level: "intermediaire" as const,
      region: "Ouest, Nord-Ouest",
      isPremium: true,
      price: 2500,
      duration: 150,
      lessonsCount: 10,
      rating: "4.7",
      studentsCount: 1876,
      instructorName: "Marie-Claire Nkeng",
      instructorTitle: "Experte café - Cooperative MIFACO",
      isFeatured: true,
      requiresCertification: true,
      certificationPrice: 2500,
    },
    {
      title: "Manioc : Maximiser les Rendements",
      slug: "manioc-rendements-maximaux",
      description: "Le manioc est l'aliment de base de millions de Camerounais. Apprenez les techniques pour multiplier vos rendements : choix des variétés résistantes, techniques de bouturage, gestion des maladies et méthodes de récolte.",
      shortDescription: "Doublez vos rendements de manioc avec des techniques éprouvées.",
      image: "/course-manioc.jpg",
      category: "cultures_vivrieres" as const,
      level: "debutant" as const,
      region: "Toutes régions",
      isPremium: false,
      price: 0,
      duration: 120,
      lessonsCount: 8,
      rating: "4.6",
      studentsCount: 3421,
      instructorName: "Prof. Samuel Tchi",
      instructorTitle: "Agronome - MINADER",
      isFeatured: true,
    },
    {
      title: "Maïs : Culture Intensive et Rentable",
      slug: "mais-culture-intensive",
      description: "Le maïs est une culture stratégique pour la sécurité alimentaire du Cameroun. Ce cours vous apprend la culture intensive, la rotation des cultures, l'utilisation optimale des engrais et la lutte contre la chenille légionnaire d'automne.",
      shortDescription: "Cultivez le maïs de manière intensive et rentable.",
      image: "/course-mais.jpg",
      category: "cultures_vivrieres" as const,
      level: "intermediaire" as const,
      region: "Adamaoua, Nord",
      isPremium: false,
      price: 0,
      duration: 160,
      lessonsCount: 10,
      rating: "4.5",
      studentsCount: 2890,
      instructorName: "Dr. Ibrahim Hamadou",
      instructorTitle: "Chercheur céréalier - IRAD",
      isFeatured: true,
    },
    {
      title: "Élevage Moderne de Volailles",
      slug: "elevage-volailles-moderne",
      description: "Lancez ou modernisez votre élevage de volailles. Du choix des souches à l'alimentation, en passant par la biosecurité et la gestion sanitaire, ce cours couvre tous les aspects de l'aviculture moderne au Cameroun.",
      shortDescription: "Lancez un élevage de volailles rentable et moderne.",
      image: "/course-volailles.jpg",
      category: "volailles" as const,
      level: "debutant" as const,
      region: "Toutes régions",
      isPremium: false,
      price: 0,
      duration: 200,
      lessonsCount: 14,
      rating: "4.9",
      studentsCount: 4567,
      instructorName: "Agnes Biya",
      instructorTitle: "Experte avicole - FAO Cameroun",
      isFeatured: true,
    },
    {
      title: "Élevage de Porcs : Techniques Professionnelles",
      slug: "elevage-porcs-professionnel",
      description: "Devenez un professionnel de l'élevage porcin. Apprenez la construction des porcheries, l'alimentation rationnée, la reproduction, la santé animale et la commercialisation de vos porcs sur les marchés camerounais.",
      shortDescription: "De la porcherie à la vente : maîtrisez l'élevage porcin.",
      image: "/course-porcs.jpg",
      category: "porcs" as const,
      level: "intermediaire" as const,
      region: "Ouest, Littoral",
      isPremium: true,
      price: 1500,
      duration: 180,
      lessonsCount: 12,
      rating: "4.7",
      studentsCount: 1987,
      instructorName: "Robert Etoga",
      instructorTitle: "Éleveur expert - 20 ans d'expérience",
      isFeatured: true,
      requiresCertification: true,
      certificationPrice: 1500,
    },
    {
      title: "Élevage Bovin : Gestion d'un Troupeau Sain",
      slug: "elevage-bovin-gestion",
      description: "Gérez votre troupeau bovin comme un professionnel. Pastoralisme, alimentation, reproduction, vaccination, et gestion des pâturages dans le contexte camerounais. Un cours essentiel pour les éleveurs du Nord et de l'Adamaoua.",
      shortDescription: "Gérez un troupeau bovin sain et productif.",
      image: "/course-bovins.jpg",
      category: "bovins" as const,
      level: "intermediaire" as const,
      region: "Adamaoua, Nord, Est",
      isPremium: true,
      price: 2000,
      duration: 220,
      lessonsCount: 15,
      rating: "4.6",
      studentsCount: 1456,
      instructorName: "Dr. Amadou Bello",
      instructorTitle: "Vétérinaire - Project PARC",
      isFeatured: false,
      requiresCertification: true,
      certificationPrice: 2000,
    },
    {
      title: "Accès aux Marchés et Commercialisation",
      slug: "acces-marches-commercialisation",
      description: "Transformez votre production agricole en revenus. Apprenez à négocier les prix, à accéder aux marchés urbains, à utiliser les plateformes numériques de vente et à créer des partenariats avec les exportateurs.",
      shortDescription: "Vendez vos produits au meilleur prix sur les marchés locaux et internationaux.",
      image: "/course-marches.jpg",
      category: "marches" as const,
      level: "debutant" as const,
      region: "Toutes régions",
      isPremium: false,
      price: 0,
      duration: 100,
      lessonsCount: 6,
      rating: "4.8",
      studentsCount: 3122,
      instructorName: "Sarah Njoya",
      instructorTitle: "Experte en chaînes de valeur - GIZ",
      isFeatured: true,
    },
    {
      title: "Post-Récolte et Transformation du Cacao",
      slug: "post-recolte-transformation-cacao",
      description: "La qualité du cacao se joue après la récolte. Maîtrisez les techniques de fermentation, de séchage, de stockage et de transformation du cacao en beurre et en poudre. Augmentez la valeur de votre production.",
      shortDescription: "Transformez vos fèves de cacao en produits à haute valeur ajoutée.",
      image: "/course-postrecolte.jpg",
      category: "cacao" as const,
      level: "avance" as const,
      region: "Centre, Sud",
      isPremium: true,
      price: 3000,
      duration: 140,
      lessonsCount: 8,
      rating: "4.9",
      studentsCount: 987,
      instructorName: "Dr. Kofi Mensah",
      instructorTitle: "Expert cacao - CICC",
      isFeatured: false,
      requiresCertification: true,
      certificationPrice: 3000,
    },
    {
      title: "Gestion Financière de l'Exploitation Agricole",
      slug: "gestion-financiere-exploitation",
      description: "Gérez votre exploitation comme une entreprise. Comptabilité simplifiée, calcul de rentabilité, gestion de trésorerie, accès au crédit agricole et planification budgétaire. Un cours indispensable pour tout agriculteur entrepreneur.",
      shortDescription: "Gérez vos finances agricoles comme un entrepreneur.",
      image: "/hero-farmer.jpg",
      category: "gestion" as const,
      level: "debutant" as const,
      region: "Toutes régions",
      isPremium: false,
      price: 0,
      duration: 130,
      lessonsCount: 8,
      rating: "4.5",
      studentsCount: 2789,
      instructorName: "Patrice Essomba",
      instructorTitle: "Conseiller financier - Afriland First Bank",
      isFeatured: true,
    },
  ];

  console.log("Inserting courses...");
  for (const course of courseData) {
    await db.insert(courses).values(course);
  }

  // Get inserted courses
  const insertedCourses = await db.select().from(courses);

  // ============================================
  // LESSONS for each course
  // ============================================
  console.log("Inserting lessons...");
  for (const course of insertedCourses) {
    const lessonTemplates = getLessonsForCourse(course);
    for (const lesson of lessonTemplates) {
      await db.insert(lessons).values({
        ...lesson,
        courseId: course.id,
      });
    }
  }

  // Get inserted lessons
  const insertedLessons = await db.select().from(lessons);

  // ============================================
  // QUIZZES for lessons with hasQuiz
  // ============================================
  console.log("Inserting quizzes...");
  for (const lesson of insertedLessons) {
    if (lesson.hasQuiz) {
      const [quizResult] = await db
        .insert(quizzes)
        .values({
          lessonId: lesson.id,
          courseId: lesson.courseId,
          title: `Quiz - ${lesson.title}`,
          description: `Validez vos connaissances sur ${lesson.title}`,
          passingScore: 70,
          questionsCount: 3,
        })
        .$returningId();

      await db
        .update(lessons)
        .set({ quizId: quizResult.id })
        .where(eq(lessons.id, lesson.id));

      // Insert questions and options
      const quizData = getQuizData(lesson.title);
      for (let i = 0; i < quizData.length; i++) {
        const q = quizData[i];
        const [questionResult] = await db
          .insert(quizQuestions)
          .values({
            quizId: quizResult.id,
            question: q.question,
            explanation: q.explanation,
            sortOrder: i + 1,
          })
          .$returningId();

        for (let j = 0; j < q.options.length; j++) {
          await db.insert(quizOptions).values({
            questionId: questionResult.id,
            optionText: q.options[j].text,
            isCorrect: q.options[j].isCorrect,
            sortOrder: j + 1,
          });
        }
      }
    }
  }

  // ============================================
  // BADGES
  // ============================================
  console.log("Inserting badges...");
  const badgeData = [
    {
      name: "Premier Pas",
      description: "Terminez votre première leçon",
      icon: "Sprout",
      color: "#4A7C2E",
      category: "achievement" as const,
    },
    {
      name: "Producteur de Cacao",
      description: "Terminez le cours de culture du cacao",
      icon: "TreePalm",
      color: "#5C3D2E",
      courseId: insertedCourses[0]?.id,
      category: "completion" as const,
    },
    {
      name: "Maître du Café",
      description: "Terminez le cours de culture du café",
      icon: "Coffee",
      color: "#8B4513",
      courseId: insertedCourses[1]?.id,
      category: "completion" as const,
    },
    {
      name: "Éleveur Expert",
      description: "Terminez 3 cours d'élevage",
      icon: "Award",
      color: "#D4A017",
      category: "achievement" as const,
    },
    {
      name: "Apprenti Comptable",
      description: "Terminez le cours de gestion financière",
      icon: "Calculator",
      color: "#2D5016",
      courseId: insertedCourses[9]?.id,
      category: "completion" as const,
    },
    {
      name: "Super Étudiant",
      description: "Obtenez 100% à un quiz",
      icon: "Trophy",
      color: "#D4A017",
      category: "achievement" as const,
    },
    {
      name: "Membre Actif",
      description: "Participez 5 fois au forum communautaire",
      icon: "MessageCircle",
      color: "#C45C26",
      category: "community" as const,
    },
    {
      name: "Certifié Premium",
      description: "Obtenez votre première certification payante",
      icon: "Medal",
      color: "#D4A017",
      category: "premium" as const,
    },
  ];

  for (const badge of badgeData) {
    await db.insert(badges).values(badge);
  }

  // ============================================
  // FORUM CATEGORIES
  // ============================================
  console.log("Inserting forum categories...");
  const forumCategoryData = [
    { name: "Cacao", slug: "cacao", description: "Discussions sur la culture du cacao", icon: "TreePalm", color: "#5C3D2E", topicCount: 234, replyCount: 892 },
    { name: "Café", slug: "cafe", description: "Échanges sur le café arabica et robusta", icon: "Coffee", color: "#8B4513", topicCount: 189, replyCount: 654 },
    { name: "Maïs", slug: "mais", description: "Culture du maïs et variétés améliorées", icon: "Wheat", color: "#D4A017", topicCount: 156, replyCount: 432 },
    { name: "Manioc", slug: "manioc", description: "Tout sur le manioc au Cameroun", icon: "Sprout", color: "#4A7C2E", topicCount: 134, replyCount: 378 },
    { name: "Volailles", slug: "volailles", description: "Élevage de poulets et poules pondeuses", icon: "Bird", color: "#C45C26", topicCount: 312, replyCount: 1240 },
    { name: "Porcs", slug: "porcs", description: "Élevage porcin et commercialisation", icon: "PiggyBank", color: "#FF6B35", topicCount: 98, replyCount: 287 },
    { name: "Gestion & Finance", slug: "gestion-finance", description: "Gestion financière et accès au crédit", icon: "Calculator", color: "#2D5016", topicCount: 87, replyCount: 234 },
    { name: "Région Centre", slug: "region-centre", description: "Actualités et échanges - Région Centre", icon: "MapPin", color: "#4A7C2E", topicCount: 67, replyCount: 198 },
    { name: "Région Ouest", slug: "region-ouest", description: "Actualités et échanges - Région Ouest", icon: "MapPin", color: "#D4A017", topicCount: 54, replyCount: 156 },
    { name: "Région Littoral", slug: "region-littoral", description: "Actualités et échanges - Région Littoral", icon: "MapPin", color: "#87CEEB", topicCount: 45, replyCount: 134 },
  ];

  for (const cat of forumCategoryData) {
    await db.insert(forumCategories).values(cat);
  }

  // ============================================
  // EVENTS
  // ============================================
  console.log("Inserting events...");
  const eventData = [
    {
      title: "Journée de Formation Pratique - Culture du Cacao",
      description: "Une journée immersive dans une plantation de cacao à Yaoundé. Apprenez les techniques de greffage, de fermentation et de séchage avec les experts de l'IRAD.",
      location: "Station de Recherche de Nkolbisson, Yaoundé",
      region: "Centre",
      eventDate: new Date("2026-06-15T08:00:00"),
      endDate: new Date("2026-06-15T17:00:00"),
      duration: 1,
      maxParticipants: 50,
      registeredCount: 34,
      isFree: true,
      price: 0,
      instructorName: "Dr. Jean-Pierre Manga",
      status: "upcoming" as const,
    },
    {
      title: "Atelier Élevage de Volailles - De la Théorie à la Pratique",
      description: "Atelier pratique sur l'élevage moderne de volailles. Construction de poulaillers, formulation d'aliments, vaccination et biosecurité.",
      location: "Ferme Modèle de Bafoussam",
      region: "Ouest",
      eventDate: new Date("2026-06-22T09:00:00"),
      endDate: new Date("2026-06-23T16:00:00"),
      duration: 2,
      maxParticipants: 30,
      registeredCount: 28,
      isFree: false,
      price: 5000,
      instructorName: "Agnes Biya",
      status: "upcoming" as const,
    },
    {
      title: "Séminaire sur l'Accès aux Marchés Agricoles",
      description: "Rencontre avec les acteurs de la filière : exportateurs, transformateurs et distributeurs. Sessions de networking et de négociation.",
      location: "Hôtel Mont Fébé, Yaoundé",
      region: "Centre",
      eventDate: new Date("2026-07-05T08:30:00"),
      endDate: new Date("2026-07-05T17:30:00"),
      duration: 1,
      maxParticipants: 100,
      registeredCount: 67,
      isFree: true,
      price: 0,
      instructorName: "Sarah Njoya",
      status: "upcoming" as const,
    },
    {
      title: "Formation sur la Gestion Financière Agricole",
      description: "Apprenez à tenir vos comptes, à calculer votre rentabilité et à accéder aux crédits agricoles. Session interactive avec des études de cas réels.",
      location: "Centre de Formation Agricole, Douala",
      region: "Littoral",
      eventDate: new Date("2026-07-12T09:00:00"),
      endDate: new Date("2026-07-12T16:00:00"),
      duration: 1,
      maxParticipants: 40,
      registeredCount: 23,
      isFree: false,
      price: 3000,
      instructorName: "Patrice Essomba",
      status: "upcoming" as const,
    },
    {
      title: "Journée du Cacao - Rencontre des Producteurs",
      description: "Grande rencontre annuelle des producteurs de cacao du Centre et du Sud. Partage d'expériences, démonstrations techniques et remise de certifications.",
      location: "Ebolowa, Région du Sud",
      region: "Sud",
      eventDate: new Date("2026-08-01T08:00:00"),
      endDate: new Date("2026-08-01T18:00:00"),
      duration: 1,
      maxParticipants: 200,
      registeredCount: 145,
      isFree: true,
      price: 0,
      instructorName: "Dr. Kofi Mensah",
      status: "upcoming" as const,
    },
  ];

  for (const event of eventData) {
    await db.insert(events).values(event);
  }

  console.log("Seeding complete!");
}

// Helper function to generate lessons for each course
function getLessonsForCourse(course: any) {
  const courseLessons: any[] = [];
  let sortOrder = 1;

  // Module 1: Introduction
  courseLessons.push({
    moduleNumber: 1,
    moduleTitle: "Introduction",
    lessonNumber: 1,
    title: `Introduction à ${course.title.split(":")[0]}`,
    description: `Présentation du cours et objectifs d'apprentissage.`,
    videoDuration: 8,
    isDownloadable: true,
    hasQuiz: false,
    sortOrder: sortOrder++,
    isPreview: true,
  });

  courseLessons.push({
    moduleNumber: 1,
    moduleTitle: "Introduction",
    lessonNumber: 2,
    title: "Contexte et importance au Cameroun",
    description: `Comprendre l'importance économique et sociale de cette activité au Cameroun.`,
    videoDuration: 10,
    isDownloadable: true,
    hasQuiz: false,
    sortOrder: sortOrder++,
    isPreview: true,
  });

  // Module 2: Fondamentaux
  courseLessons.push({
    moduleNumber: 2,
    moduleTitle: "Fondamentaux",
    lessonNumber: 1,
    title: "Choix du terrain et préparation",
    description: `Critères de sélection du terrain et techniques de préparation.`,
    videoDuration: 15,
    isDownloadable: true,
    hasQuiz: true,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  courseLessons.push({
    moduleNumber: 2,
    moduleTitle: "Fondamentaux",
    lessonNumber: 2,
    title: "Variétés recommandées et semences",
    description: `Présentation des meilleures variétés adaptées au climat camerounais.`,
    videoDuration: 12,
    isDownloadable: true,
    hasQuiz: false,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  // Module 3: Pratiques Culturales / Techniques
  courseLessons.push({
    moduleNumber: 3,
    moduleTitle: "Pratiques de Culture",
    lessonNumber: 1,
    title: "Plantation et espacement",
    description: `Techniques de plantation et distances de plantation optimales.`,
    videoDuration: 15,
    isDownloadable: true,
    hasQuiz: true,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  courseLessons.push({
    moduleNumber: 3,
    moduleTitle: "Pratiques de Culture",
    lessonNumber: 2,
    title: "Entretien et fertilisation",
    description: `Techniques d'entretien, types d'engrais et modes d'application.`,
    videoDuration: 18,
    isDownloadable: true,
    hasQuiz: false,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  courseLessons.push({
    moduleNumber: 3,
    moduleTitle: "Pratiques de Culture",
    lessonNumber: 3,
    title: "Gestion de l'eau et irrigation",
    description: `Techniques d'irrigation adaptées au contexte camerounais.`,
    videoDuration: 10,
    isDownloadable: true,
    hasQuiz: false,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  // Module 4: Protection Sanitaire
  courseLessons.push({
    moduleNumber: 4,
    moduleTitle: "Protection Sanitaire",
    lessonNumber: 1,
    title: "Maladies principales et leur contrôle",
    description: `Identification et traitement des principales maladies.`,
    videoDuration: 15,
    isDownloadable: true,
    hasQuiz: true,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  courseLessons.push({
    moduleNumber: 4,
    moduleTitle: "Protection Sanitaire",
    lessonNumber: 2,
    title: "Ravageurs et lutte intégrée",
    description: `Gestion des ravageurs par des méthodes biologiques et chimiques.`,
    videoDuration: 12,
    isDownloadable: true,
    hasQuiz: false,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  // Module 5: Récolte et Post-Récolte
  courseLessons.push({
    moduleNumber: 5,
    moduleTitle: "Récolte et Commercialisation",
    lessonNumber: 1,
    title: "Signes de maturité et techniques de récolte",
    description: `Identifier le bon moment et les bonnes techniques de récolte.`,
    videoDuration: 12,
    isDownloadable: true,
    hasQuiz: true,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  courseLessons.push({
    moduleNumber: 5,
    moduleTitle: "Récolte et Commercialisation",
    lessonNumber: 2,
    title: "Post-récolte et transformation",
    description: `Techniques de conservation, transformation et ajout de valeur.`,
    videoDuration: 15,
    isDownloadable: true,
    hasQuiz: false,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  courseLessons.push({
    moduleNumber: 5,
    moduleTitle: "Récolte et Commercialisation",
    lessonNumber: 3,
    title: "Accès aux marchés et prix",
    description: `Stratégies de commercialisation et négociation des prix.`,
    videoDuration: 10,
    isDownloadable: true,
    hasQuiz: true,
    sortOrder: sortOrder++,
    isPreview: false,
  });

  return courseLessons;
}

// Helper function to generate quiz data
function getQuizData(lessonTitle: string) {
  const quizzes: any[] = [];

  quizzes.push({
    question: `Quelle est la meilleure période pour planter selon le cours "${lessonTitle}" ?`,
    explanation: "La saison des pluies offre les meilleures conditions pour l'établissement des jeunes plants.",
    options: [
      { text: "En saison sèche", isCorrect: false },
      { text: "En saison des pluies", isCorrect: true },
      { text: "Toute l'année", isCorrect: false },
      { text: "En hiver", isCorrect: false },
    ],
  });

  quizzes.push({
    question: "Quel type d'engrais est recommandé pour une culture durable ?",
    explanation: "Les engrais organiques améliorent la structure du sol et sont plus durables.",
    options: [
      { text: "Engrais chimiques uniquement", isCorrect: false },
      { text: "Engrais organiques et compost", isCorrect: true },
      { text: "Pas d'engrais nécessaire", isCorrect: false },
      { text: "Engrais industriels importés", isCorrect: false },
    ],
  });

  quizzes.push({
    question: "Quelle est la distance de plantation recommandée entre les plants ?",
    explanation: "L'espacement optimal permet une bonne circulation d'air et facilite l'entretien.",
    options: [
      { text: "1 mètre", isCorrect: false },
      { text: "3-5 mètres selon la variété", isCorrect: true },
      { text: "10 mètres", isCorrect: false },
      { text: "0.5 mètre", isCorrect: false },
    ],
  });

  return quizzes;
}

seed().catch(console.error);
