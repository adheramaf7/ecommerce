import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { URL } from "url";

export async function POST(request: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();

        const body = await request.json();

        const { name, price, categoryId, sizeId, colorId, images, isArchived, isFeatured } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        }

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        }

        if (!price) {
            return new NextResponse('Price is required', { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse('Category is required', { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse('Size is required', { status: 400 });
        }

        if (!colorId) {
            return new NextResponse('Color is required', { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse('Images is required', { status: 400 });
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                sizeId,
                colorId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.log('[PRODUCTS_POST]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const isFeatured = searchParams.get('isFeatured');
        console.log(categoryId, sizeId, colorId, isFeatured);

        if (!params.storeId) {
            return new NextResponse('Store ID is required', { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(products);


        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_GET]', error);

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}