import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { requireAuth } from "@/app/lib/auth-middleware";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function POST(req: NextRequest) {
  const user = requireAuth(req);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const issueId = formData.get("issueId");
    if (!issueId || typeof issueId !== "string") {
      return NextResponse.json(
        { error: "issueId is required" },
        { status: 400 }
      );
    }

    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No images uploaded" },
        { status: 400 }
      );
    }

    if (files.length > 12) {
      return NextResponse.json(
        { error: "Max 12 images allowed" },
        { status: 400 }
      );
    }

    await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());

        return prisma.issueImage.create({
          data: {
            issueId,
            image: buffer,
            mimeType: file.type,
          },
        });
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
