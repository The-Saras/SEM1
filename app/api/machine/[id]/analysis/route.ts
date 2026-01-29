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
    const { id } = await context.params;

    // Fetch all issues for this machine
    const issues = await prisma.issue.findMany({
      where: { machineId: id },
      orderBy: { createdAt: "desc" },
      include: {
        loggedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Calculate statistics
    const totalIssues = issues.length;
    
    // Issues by status
    const issuesByStatus = {
      OPEN: issues.filter((i: { status: string }) => i.status === "OPEN").length,
      IN_PROGRESS: issues.filter((i: { status: string }) => i.status === "IN_PROGRESS").length,
      RESOLVED: issues.filter((i: { status: string }) => i.status === "RESOLVED").length,
      CLOSED: issues.filter((i: { status: string }) => i.status === "CLOSED").length,
    };

    // Issues by category
    const categoryCounts: Record<string, number> = {};
    issues.forEach((issue: { category: string | null }) => {
      const category = issue.category || "Uncategorized";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Issues over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const issuesOverTime: Record<string, number> = {};
    issues
      .filter((issue: { createdAt: Date }) => new Date(issue.createdAt) >= sixMonthsAgo)
      .forEach((issue: { createdAt: Date }) => {
        const month = new Date(issue.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });
        issuesOverTime[month] = (issuesOverTime[month] || 0) + 1;
      });

    // Resolution time (for resolved/closed issues)
    const resolvedIssues = issues.filter(
      (i: { status: string }) => i.status === "RESOLVED" || i.status === "CLOSED"
    );
    const resolutionTimes = resolvedIssues.map((issue: { createdAt: Date; updatedAt: Date }) => {
      const created = new Date(issue.createdAt);
      const updated = new Date(issue.updatedAt);
      return Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)); // days
    });

    const avgResolutionTime =
      resolutionTimes.length > 0
        ? Math.round(
            resolutionTimes.reduce((a: number, b: number) => a + b, 0) / resolutionTimes.length
          )
        : 0;

    // Issues with root cause vs without
    const issuesWithRootCause = issues.filter((i: { rootCause: string | null }) => i.rootCause).length;
    const issuesWithoutRootCause = totalIssues - issuesWithRootCause;

    // Issues with corrective action vs without
    const issuesWithCorrectiveAction = issues.filter(
      (i: { correctiveAction: string | null }) => i.correctiveAction
    ).length;
    const issuesWithoutCorrectiveAction =
      totalIssues - issuesWithCorrectiveAction;

    // Top issues by logged by user
    const issuesByUser: Record<string, number> = {};
    issues.forEach((issue: { loggedBy: { name: string } }) => {
      const userName = issue.loggedBy.name;
      issuesByUser[userName] = (issuesByUser[userName] || 0) + 1;
    });

    return NextResponse.json({
      totalIssues,
      issuesByStatus,
      categoryCounts,
      issuesOverTime,
      avgResolutionTime,
      issuesWithRootCause,
      issuesWithoutRootCause,
      issuesWithCorrectiveAction,
      issuesWithoutCorrectiveAction,
      issuesByUser,
      resolutionTimes: resolutionTimes.length > 0 ? resolutionTimes : [],
    });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

