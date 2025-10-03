// src/app/api/contact/route.ts
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, website } = body;
    const timestamp = body.timestamp ?? body.timeStamp; // accepte les deux

    // Récupère les textes/paramètres depuis Setting.contact
    const setting = await prisma.setting.findUnique({ where: { id: "global" } });
    const cfg = (setting?.contact as any) ?? {};
    const successMessage =
      typeof cfg.successMessage === "string" ? cfg.successMessage : "Votre message a bien été envoyé.";
    const errorMessage =
      typeof cfg.errorMessage === "string" ? cfg.errorMessage : "Une erreur est survenue. Merci de réessayer.";
    const recipient =
      typeof cfg.email === "string" && cfg.email.trim() ? cfg.email.trim() : "contact@tonsite.fr";

    // Honeypot
    if (website) {
      return NextResponse.json({ message: "Spam détecté." }, { status: 400 });
    }

    // Anti-bot basique (envoi trop rapide)
    if (!timestamp || Date.now() - Number(timestamp) < 5000) {
      return NextResponse.json({ message: "Envoi trop rapide. Action suspecte." }, { status: 400 });
    }

    // Validation minimale
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 });
    }

    // Transport Ethereal (dev)
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: recipient,
      subject,
      text: message,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("📨 Prévisualisation :", previewUrl);

    return NextResponse.json({ message: successMessage, previewUrl });
  } catch (error) {
    console.error("❌ Erreur envoi email :", error);

    // Relit l’erreur personnalisée DB si possible
    try {
      const setting = await prisma.setting.findUnique({ where: { id: "global" } });
      const cfg = (setting?.contact as any) ?? {};
      const errorMessage =
        typeof cfg.errorMessage === "string" ? cfg.errorMessage : "Erreur serveur.";
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    } catch {
      return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
    }
  }
}