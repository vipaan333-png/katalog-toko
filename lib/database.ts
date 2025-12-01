// Database operations wrapper for Appwrite
import { databases, storage } from './appwrite-server';
import { Query, ID } from 'node-appwrite';
import { Product } from '@/types';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_PRODUCTS = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const COLLECTION_CATEGORIES = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

/**
 * Get all products with optional filtering
 */
export async function getProducts(category?: string, search?: string) {
    const queries: string[] = [Query.orderDesc('$createdAt'), Query.limit(100)];

    if (category && category !== 'ALL') {
        queries.push(Query.equal('category', category));
    }

    if (search) {
        queries.push(Query.search('name', search));
    }

    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_PRODUCTS,
        queries
    );

    return {
        documents: response.documents,
        total: response.total,
    };
}

/**
 * Get a single product by ID
 */
export async function getProductById(productId: string) {
    return await databases.getDocument(
        DATABASE_ID,
        COLLECTION_PRODUCTS,
        productId
    );
}

/**
 * Create a new product
 */
export async function createProduct(data: {
    name: string;
    price: number;
    discount?: number;
    category: string;
    imageId?: string;
}) {
    return await databases.createDocument(
        DATABASE_ID,
        COLLECTION_PRODUCTS,
        ID.unique(),
        {
            name: data.name,
            price: Math.round(data.price),
            discount: data.discount || 0,
            category: data.category,
            imageId: data.imageId || null,
        }
    );
}

/**
 * Update an existing product
 */
export async function updateProduct(
    productId: string,
    data: {
        name: string;
        price: number;
        discount?: number;
        category: string;
        imageId?: string;
    }
) {
    const updateData: any = {
        name: data.name,
        price: Math.round(data.price),
        discount: data.discount || 0,
        category: data.category,
    };

    if (data.imageId) {
        updateData.imageId = data.imageId;
    }

    return await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_PRODUCTS,
        productId,
        updateData
    );
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string) {
    // Get product to check for image
    const product = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_PRODUCTS,
        productId
    ) as any;

    // Delete the product
    await databases.deleteDocument(DATABASE_ID, COLLECTION_PRODUCTS, productId);

    // Delete associated image if exists
    if (product.imageId) {
        try {
            await storage.deleteFile(BUCKET_ID, product.imageId);
        } catch (error) {
            // Error deleting image
        }
    }

    return { success: true };
}

/**
 * Get all categories
 */
export async function getCategories() {
    const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_CATEGORIES,
        [Query.orderAsc('name'), Query.limit(100)]
    );

    return {
        documents: response.documents,
        total: response.total,
    };
}

/**
 * Upload image to Appwrite Storage
 */
export async function uploadImage(file: Buffer, filename: string) {
    // Convert Buffer to Blob for Appwrite
    const blob = new Blob([file]);
    const fileObject = new File([blob], filename);
    
    const uploadedFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        fileObject
    );

    return uploadedFile;
}

/**
 * Get public image URL
 */
export function getImageUrl(fileId: string) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

    return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
}

/**
 * Delete image from storage
 */
export async function deleteImage(fileId: string) {
    return await storage.deleteFile(BUCKET_ID, fileId);
}
