// src/lib/types/contact.ts
export type ContactPublic = {
  title: string;
  intro: string;
  email: string;         // destinataire
  phone: string;
  address: string;
  openingHours: string;
  booking: string;

  // ⚠️ verrouillés côté admin (non éditables)
  rgpdLabel: string;
  successMessage: string;
  errorMessage: string;
};

export type ContactAdminEditable = Omit<
  ContactPublic,
  "rgpdLabel" | "successMessage" | "errorMessage"
>;