import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { requireAuth } from "@/app/lib/auth-middleware";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const images = await prisma.issueImage.findMany({
    where: { issueId: id  },
    select: {
      id: true,
      image: true,
      mimeType: true,
    },
  });

  const formatted = images.map((img) => ({
    id: img.id,
    src: `data:${img.mimeType};base64,${Buffer.from(
      img.image
    ).toString("base64")}`,
  }));

  return NextResponse.json(formatted);
}
