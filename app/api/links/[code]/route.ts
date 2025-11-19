import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params:  { code: string } }
) {
    try {
        const { code } = await params;
        const link = await prisma.link.findFirst({
            where: {
                code: code,
                deleted_at: null,
            },
        });
        if (!link) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(link);
    } catch(error) {
        console.error('Error fetching link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }

}

export async function DELETE(
    request: Request,
    { params }: { params: { code: string } }
) {
    try {
        const { code } = await params;
        const link = await prisma.link.findFirst({
            where: {
                code: code,
                deleted_at: null,
            },
        });

        if (!link) {
            return NextResponse.json(
                { error: "Link not found" },
                { status: 404 }
            );
        }
        await prisma.link.update({
            where: { code: code },
            data: { deleted_at: new Date() },
        });

        return NextResponse.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}