import {
  LucideIcon,
  User,
  Building2,
  ClipboardCheck,
  GraduationCap,
  HeartPulse,
  BookOpen
} from "lucide-react";

export interface PriceItem {
  title: string;
  description: string;
  price: string;
  icon: LucideIcon;
}

export const pricesContent = {
  title: "Tarifs des consultations",
  subtitle: "Les tarifs sont adaptés à votre situation personnelle et professionnelle.",
  prices: [
    {
      title: "Séance individuelle",
      price: "60€",
      description: "Séance de 50 minutes consacrée à un travail individuel sur vos problématiques professionnelles.",
      icon: User,
    },
    {
      title: "Séance en entreprise",
      price: "Sur devis",
      description: "Séance de 1h30 destinée à des situations professionnelles en entreprise (gestion du stress, bien-être au travail).",
      icon: Building2,
    },
    {
      title: "Bilan de compétences",
      price: "500€",
      description: "Accompagnement complet sur 5 séances pour faire le point sur vos compétences, vos aspirations et votre projet professionnel.",
      icon: ClipboardCheck,
    },
    {
      title: "VAE (Validation des Acquis de l'Expérience)",
      price: "800€",
      description: "Accompagnement sur 8 séances pour vous aider à préparer votre dossier de VAE et réussir votre certification.",
      icon: GraduationCap,
    },
    {
      title: "Diagnostic RPS",
      price: "Sur devis",
      description: "Analyse des risques psychosociaux au sein de votre entreprise, avec recommandations personnalisées pour améliorer le bien-être au travail.",
      icon: HeartPulse,
    },
    {
      title: "Formation sur mesure",
      price: "Sur devis",
      description: "Ateliers et formations adaptés à vos besoins spécifiques en matière de gestion du stress et de bien-être au travail.",
      icon: BookOpen,
    },
  ],
} satisfies { title: string; subtitle: string; prices: PriceItem[] };
