import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";


export async function GET(
    request: NextRequest,
    { params }: { params:  Promise<{ code: string }> }
){
    try {
        const { code } = await params;

        const link = await prisma.link.findFirst({
            where: {
                code: code,
                deleted_at: null,
            },
        });

        if(!link) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }

        await prisma.link.update({
            where: { code: code },
            data: { clicks: { increment: 1 }, last_clicked_at: new Date() },
        });

        return NextResponse.redirect(link.target_url, { status: 302 });

    } catch (error) {
        console.error("Error redirecting:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}