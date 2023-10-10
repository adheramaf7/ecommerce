import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const body = await request.json();

        const { name } = body;

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        const store = await prismadb.store.update({
            where: {
                id: params.storeId,
                userId,
            },
            data: {
                name
            }
        })

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORES_PATCH]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const store = await prismadb.store.delete({
            where: {
                id: params.storeId,
                userId
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORES_DELETE]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}