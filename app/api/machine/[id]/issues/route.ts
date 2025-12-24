import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { requireAuth } from "@/app/lib/auth-middleware";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = requireAuth(request);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params; // ✅ FIX

    const issues = await prisma.issue.findMany({
      where: { machineId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
