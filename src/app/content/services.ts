import { LucideIcon, User, HeartCrack, ClipboardList, Briefcase, Users, GraduationCap } from "lucide-react";

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  details: string;
  image: string;
}

export const servicesContent = {
  services: [
    {
      title: "Accompagnement individuel",
      description: "Soutien personnalisé pour mieux gérer le stress, les conflits, ou les périodes de transition professionnelle.",
      icon: User,
      details: "L’accompagnement individuel vise à offrir un espace confidentiel pour exprimer vos difficultés et trouver des solutions adaptées. Chaque séance est personnalisée selon votre parcours professionnel et votre état émotionnel.",
      image: "/images/services/individual-support.jpeg"
    },
    {
      title: "Souffrance au travail",
      description: "Aide face au burn-out, harcèlement moral, ou sentiment d’isolement au sein de l’environnement professionnel.",
      icon: HeartCrack,
      details: "Vous traversez une situation de mal-être professionnel ? Cet accompagnement permet d’identifier les sources de souffrance, de reconstruire votre confiance et de retrouver un équilibre durable.",
      image: "/images/services/workplace-suffering.jpg"
    },
    {
      title: "Bilans de compétences",
      description: "Exploration des compétences, valeurs et aspirations pour construire un projet professionnel aligné.",
      icon: ClipboardList,
      details: "Un bilan complet pour analyser vos forces, vos envies, et construire un nouveau projet professionnel aligné avec vos aspirations profondes. Une méthode structurée sur plusieurs séances.",
      image: "/images/services/skills-assessment.jpg"
    },
    {
      title: "Coaching professionnel",
      description: "Accompagnement pour le développement de compétences, la gestion du temps, ou la prise de décision.",
      icon: Briefcase,
      details: "Vous souhaitez évoluer dans votre poste, mieux gérer votre quotidien professionnel ou atteindre un objectif précis ? Le coaching vous aide à progresser concrètement et durablement.",
      image: "/images/services/professional-coaching.jpg"
    },
    {
      title: "Ateliers collectifs",
      description: "Sessions interactives sur des thèmes variés : gestion du stress, communication, équilibre vie pro/perso.",
      icon: Users,
      details: "Des ateliers participatifs sur des sujets clés comme la gestion du stress, la communication assertive ou l’équilibre vie pro/perso. Idéal pour les équipes souhaitant renforcer leur cohésion.",
      image: "/images/services/collective-workshops.jpg"
    },
    {
      title: "Formations",
      description: "Formations sur mesure pour les entreprises, axées sur le bien-être au travail et la prévention des risques psychosociaux.",
      icon: GraduationCap,
      details: "Des formations construites sur mesure selon vos enjeux : prévenir les risques psychosociaux, former les managers ou sensibiliser les équipes. Une approche concrète et opérationnelle.",
      image: "/images/services/trainings.jpg"
    },
  ] satisfies Service[],
};
