// Server-side Appwrite configuration (for admin operations with API key)
import { Client, Databases, Storage } from 'node-appwrite';

if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT environment variable');
}

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID environment variable');
}

if (!process.env.APPWRITE_API_KEY) {
    throw new Error('Missing APPWRITE_API_KEY environment variable');
}

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };
