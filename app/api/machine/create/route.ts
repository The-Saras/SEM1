import { PrismaClient } from "../../../generated/prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import {requireAuth} from "@/app/lib/auth-middleware";

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

    if (request.method !== "POST") {
      return NextResponse.json(
        { message: "Only Post request is allowed" },
        { status: 405 }
      );
    }

    const machine = await prisma.machine.create({
        data:{
            machineCode: body.machineCode,
            name: body.name,
            type: body.type,

        }
    })
    return NextResponse.json(machine, { status: 201 });

  } catch (error) {
    console.error("Error creating machine:", error);
  }
}
