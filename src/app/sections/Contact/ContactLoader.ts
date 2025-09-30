import { prisma } from "@/lib/prisma";

export type ContactData = {
  title: string;
  intro?: string;
  email: string;     // affiché (pas le SMTP !)
  phone?: string;
  address?: string;
  rgpdLabel: string;
  booking?: string;
  openingHours?: string;
  successMessage: string;
  errorMessage: string;
};

export async function getContact(): Promise<ContactData> {
  const setting = await prisma.setting.findUnique({ where: { id: "global" } });
  const json = (setting?.contact as any) ?? {};

  return {
    title: json.title ?? "Contact",
    intro: json.intro ?? undefined,
    email: json.email ?? undefined,
    phone: json.phone ?? undefined,
    address: json.address ?? undefined,
    rgpdLabel:
      json.rgpdLabel ??
      "J’accepte le traitement de mes données conformément à la politique de confidentialité.",
    booking: json.booking ?? undefined,
    openingHours: json.openingHours ?? undefined,
    successMessage: json.successMessage ?? "Votre message a bien été envoyé.",
    errorMessage: json.errorMessage ?? "Une erreur est survenue. Merci de réessayer.",
  };
}
