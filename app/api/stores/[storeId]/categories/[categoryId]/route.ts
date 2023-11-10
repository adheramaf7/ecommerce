import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId } = auth();

        const body = await request.json();

        const { name, billboardId } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!params.categoryId) {
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

        const category = await prismadb.category.update({
            where: {
                id: params.categoryId,
            },
            data: {
                name, billboardId
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORIES_PATCH]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse('Category ID is required', { status: 400 });
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

        const category = await prismadb.category.delete({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORIES_DELETE]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse('Category ID is required', { status: 400 });
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                billboard: true
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORIES_GET]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
