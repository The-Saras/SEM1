import bcrypt from "bcrypt";
import { PrismaClient } from "../../../generated/prisma/client";
import { NextRequest } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  const { name, email, password, role } = await request.json();

  if (!name || !email || !password) {
    return new Response("Missing fields", { status: 400 });
  }

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return new Response("User already exists", { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword,role },
  });

  return Response.json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}
