import { databases, storage, client } from '../lib/appwrite-server';
import { InputFile } from 'node-appwrite/file';
import { ID } from 'node-appwrite';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Environment variables (ensure they are loaded)
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

// Paths
const SQL_FILE = path.resolve(__dirname, '..', 'database_schema.sql');
const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');

// Helper to upload an image and return the file ID
async function uploadImage(fileName: string): Promise<string> {
    const filePath = path.join(UPLOADS_DIR, fileName);
    if (!fs.existsSync(filePath)) {
        console.warn(`Image file not found: ${filePath}. Using placeholder.`);
        return '';
    }
    // InputFile.fromPath requires both path and filename
    const file = InputFile.fromPath(filePath, fileName);
    const result = await storage.createFile(BUCKET_ID, ID.unique(), file);
    return result.$id;
}


// Parse INSERT statements from the SQL file
async function parseProducts(): Promise<Array<{ name: string; price: number; image: string; category: string }>> {
    const products: Array<{ name: string; price: number; image: string; category: string }> = [];
    const fileStream = fs.createReadStream(SQL_FILE);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    const insertRegex = /\('([^']+)'\s*,\s*([0-9.]+)\s*,\s*'([^']*)'\s*,\s*'([^']+)'\)/;

    for await (const line of rl) {
        const trimmed = line.trim();
        if (trimmed.startsWith('(') && trimmed.endsWith('),')) {
            const match = trimmed.match(insertRegex);
            if (match) {
                const [, name, priceStr, image, category] = match;
                const price = parseFloat(priceStr);
                products.push({ name, price, image, category });
            }
        }
    }
    return products;
}

async function main() {
    console.log('Starting migration...');
    const products = await parseProducts();
    console.log(`Found ${products.length} products to migrate.`);

    for (const product of products) {
        try {
            const imageId = await uploadImage(product.image);
            const doc = await databases.createDocument(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                ID.unique(),
                {
                    name: product.name,
                    price: product.price,
                    imageId: imageId || null,
                    category: product.category,
                }
            );
            console.log(`Created product ${doc.$id} - ${product.name}`);
        } catch (err) {
            console.error('Error migrating product', product.name, err);
        }
    }
    console.log('Migration completed.');
}

main().catch((e) => console.error('Fatal error:', e));
