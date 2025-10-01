import { prisma } from "@/lib/prisma";

export type FaqData = {
  id: string;
  question: string;
  answer: string;
};

export async function getFaqs(): Promise<FaqData[]> {

  const rows = await prisma.faq.findMany({
    where: { visible: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return rows.map((r) => ({ id: r.id, question: r.question, answer: r.answer }));
  
}
