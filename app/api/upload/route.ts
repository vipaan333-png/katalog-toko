// API route for image upload
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/database';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No image file provided',
                },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed',
                },
                { status: 400 }
            );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'File size exceeds 5MB limit',
                },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Appwrite Storage
        const uploadedFile = await uploadImage(buffer, file.name);

        return NextResponse.json({
            success: true,
            data: {
                fileId: uploadedFile.$id,
                filename: uploadedFile.name,
            },
            message: 'Image uploaded successfully',
        });
    } catch (error: any) {
        console.error('POST /api/upload error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to upload image',
            },
            { status: 500 }
        );
    }
}
