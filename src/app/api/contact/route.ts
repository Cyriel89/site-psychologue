import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";

// Fonction appelée sur requête POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot : détection de bot
    if (website) {
      return NextResponse.json({ message: "Spam détecté." }, { status: 400 });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 });
    }

    // Création d’un compte de test Ethereal (pour développement uniquement)
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "contact@tonsite.fr",
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log("📨 Prévisualisation :", previewUrl);

    return NextResponse.json({ message: "Message envoyé avec succès !", previewUrl });
  } catch (error) {
    console.error("❌ Erreur envoi email :", error);
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}