import { LucideIcon, User, HeartCrack, ClipboardList, Briefcase, Users, GraduationCap } from "lucide-react";

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const servicesContent = {
  services: [
    {
      title: "Accompagnement individuel",
      description: "Soutien personnalisé pour mieux gérer le stress, les conflits, ou les périodes de transition professionnelle.",
      icon: User,
    },
    {
      title: "Souffrance au travail",
      description: "Aide face au burn-out, harcèlement moral, ou sentiment d’isolement au sein de l’environnement professionnel.",
      icon: HeartCrack,
    },
    {
      title: "Bilans de compétences",
      description: "Exploration des compétences, valeurs et aspirations pour construire un projet professionnel aligné.",
      icon: ClipboardList,
    },
    {
      title: "Coaching professionnel",
      description: "Accompagnement pour le développement de compétences, la gestion du temps, ou la prise de décision.",
      icon: Briefcase,
    },
    {
      title: "Ateliers collectifs",
      description: "Sessions interactives sur des thèmes variés : gestion du stress, communication, équilibre vie pro/perso.",
      icon: Users,
    },
    {
      title: "Formations",
      description: "Formations sur mesure pour les entreprises, axées sur le bien-être au travail et la prévention des risques psychosociaux.",
      icon: GraduationCap,
    },
  ] satisfies Service[],
};
