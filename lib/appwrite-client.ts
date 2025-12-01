// Client-side Appwrite configuration (for public operations)
import { Client, Databases, Storage } from 'appwrite';

if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT environment variable');
}

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID environment variable');
}

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };
