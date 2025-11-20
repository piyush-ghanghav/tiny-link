import { db } from "@/lib/db";
import { link } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        const linkData = await db.query.link.findFirst({
            where: (link, { eq, and, isNull }) => 
                and(eq(link.code, code), isNull(link.deleted_at))
        });

        if (!linkData) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }

        await db.update(link)
            .set({ 
                clicks: sql`${link.clicks} + 1`,
                last_clicked_at: new Date() 
            })
            .where(eq(link.code, code));

        return NextResponse.redirect(linkData.target_url, { status: 302 });

    } catch (error) {
        console.error("Error redirecting:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}