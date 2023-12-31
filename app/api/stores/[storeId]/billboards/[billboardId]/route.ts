import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth();

        const body = await request.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!label) {
            return new NextResponse('Label is required', { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!params.billboardId) {
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

        const billboard = await prismadb.billboard.update({
            where: {
                id: params.billboardId,
            },
            data: {
                label, imageUrl
            }
        })

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_PATCH]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!params.billboardId) {
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

        const billboard = await prismadb.billboard.delete({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_DELETE]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_GET]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
