import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { link } from '@/lib/schema';
import { isNull, desc, } from 'drizzle-orm';
import { isValidCode, isValidUrl, generateCode } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { target_url, code: customCode } = body;

        if (!target_url || !isValidUrl(target_url)) {
            return NextResponse.json(
                { error: "Invalid URL format" }, 
                { status: 400 }
            );
        }
        
        let code = customCode;

        if (code) {
            if (!isValidCode(code)) {
                return NextResponse.json(
                    { error: "Code must be 6-8 alphanumeric characters" }, 
                    { status: 400 }
                );
            }

            const existing = await db.query.link.findFirst({
                where: (link, { eq, and, isNull }) => 
                    and(eq(link.code, code), isNull(link.deleted_at))
            });

            if (existing) {
                return NextResponse.json(
                    { error: "Code already exists" }, 
                    { status: 409 }
                );
            }
        } else {
            // Generate a unique code
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                code = generateCode();
                const existing = await db.query.link.findFirst({
                    where: (link, { eq }) => eq(link.code, code)
                });
                
                if (!existing || existing.deleted_at) {
                    break;
                }

                attempts++;
            }

            if (attempts === maxAttempts) {
                return NextResponse.json(
                    { error: 'Could not generate unique code' },
                    { status: 500 }
                );
            }
        }

        const [newLink] = await db.insert(link).values({
            code,
            target_url,
        }).returning();

        return NextResponse.json(newLink, { status: 201 });

    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const links = await db.query.link.findMany({
            where: isNull(link.deleted_at),
            orderBy: desc(link.created_at)
        });

        return NextResponse.json(links, { status: 200 });
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}