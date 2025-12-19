import bcrypt from "bcrypt";
import { PrismaClient } from "../../../generated/prisma/client";
import { NextRequest } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";
import { signJwt } from "@/app/lib/jwt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return new Response("Missing fields", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return new Response("Invalid credentials", { status: 401 });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const token = signJwt({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return Response.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
