import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { requireAuth } from "@/app/lib/auth-middleware";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  
  const user = requireAuth(request);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      machineId,
      description,
      category,
      rootCause,
      correctiveAction,
      resolution,
    } = body;

    
    if (!machineId || !description) {
      return NextResponse.json(
        { message: "machineId and description are required" },
        { status: 400 }
      );
    }

    // (Optional) ensure machine exists
    const machineExists = await prisma.machine.findUnique({
      where: { id: machineId },
      select: { id: true },
    });

    if (!machineExists) {
      return NextResponse.json(
        { message: "Machine not found" },
        { status: 404 }
      );
    }

    
    const issue = await prisma.issue.create({
      data: {
        machineId,
        description,
        category,
        rootCause,
        correctiveAction,
        resolution,

        loggedById: user.id, 
      },
    });

    return NextResponse.json(issue, { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
