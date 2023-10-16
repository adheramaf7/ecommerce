import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { storeId: string, sizeId: string } }) {
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

        if (!params.sizeId) {
            return new NextResponse('Size ID is required', { status: 400 });
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

        const size = await prismadb.size.update({
            where: {
                id: params.sizeId,
            },
            data: {
                name, value
            }
        })

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZES_PATCH]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse('Billboard ID is required', { status: 400 });
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

        const size = await prismadb.size.delete({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZES_DELETE]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse('Billboard ID is required', { status: 400 });
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZES_GET]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
