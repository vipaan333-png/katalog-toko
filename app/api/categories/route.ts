// API route for categories
import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/database';

export async function GET() {
    try {
        const result = await getCategories();

        return NextResponse.json({
            success: true,
            data: result.documents,
            total: result.total,
        });
    } catch (error: any) {
        console.error('GET /api/categories error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to fetch categories',
            },
            { status: 500 }
        );
    }
}
