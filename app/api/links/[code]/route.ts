import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { link } from '@/lib/schema';
import { eq, } from 'drizzle-orm';

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
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(linkData);
    } catch(error) {
        console.error('Error fetching link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
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
            .set({ deleted_at: new Date() })
            .where(eq(link.code, code));

        return NextResponse.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}