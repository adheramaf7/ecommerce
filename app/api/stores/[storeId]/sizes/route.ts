import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();

        const body = await request.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!value) {
            return new NextResponse('Value is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', { status: 403 });
        }

        const billboard = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId,
            }
        });

        return NextResponse.json(billboard, { status: 201 });
    } catch (error) {
        console.log('[SIZES_POST]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = auth();


        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const sizes = await prismadb.size.findMany({
            where: {
                storeId:params.storeId
            }
        });

        return NextResponse.json(sizes, { status: 201 });
    } catch (error) {
        console.log('[SIZES_GET]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}