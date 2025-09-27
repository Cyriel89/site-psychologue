import { prisma } from "@/lib/prisma";

export type AboutData = {
    title: string;
    description: { goal: string; mission: string; presentation: string };
};

type AboutJSON = {
    title?: string;
    description?: { goal?: string; mission?: string; presentation?: string };
};

export async function getAbout(): Promise<AboutData> {
    const s = await prisma.setting.findUnique({
        where: { id: "global" },

    });

    const about = (s?.about ?? {}) as AboutJSON;

    return {
        title: about.title ?? "À propos",
        description: {
            goal: about.description?.goal ?? "Mon objectif : vous offrir un espace sécurisé pour comprendre, exprimer, évoluer.",
            mission: about.description?.mission ?? "J'accompagne les adultes en questionnement personnel ou professionnel, en souffrance au travail ou en quête d’un mieux-être. Mon travail s'appuie sur une approche intégrative, mêlant rigueur scientifique et sensibilité humaine.",
            presentation: about.description?.presentation ?? "Je suis Pauline Diné, psychologue du travail basée à Nantes. Mon approche est centrée sur l'écoute, la bienveillance et l’accompagnement au rythme de chacun."
        }
    };
}