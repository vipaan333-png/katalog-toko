/**
 * Script untuk setup Appwrite Database
 * Membuat database, collections, attributes, indexes, dan sample data
 * 
 * Cara menjalankan:
 * npx ts-node scripts/setup-appwrite.ts
 */

import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';

// Konfigurasi Appwrite
const ENDPOINT = 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = 'katalog-toko';
const API_KEY = 'standard_eef04d86b20d99a9a5b5642ecc947fd7d9d252112725fa52183ce8469ba741284f9ea87417b83276410743e4466f979a3a886c4df201f5a71e23d50c85714b7397356f1921e1565a6626fd4c451cf06b30f308748d6e1c36b968b2eb106bdd076ba5fd51d811d3b28016c78949412a727c08e40798b32c3a18a6671ebacb175e';

// IDs yang akan digunakan
const DATABASE_ID = 'katalog-toko-db';
const COLLECTION_PRODUCTS = 'products';
const COLLECTION_CATEGORIES = 'categories';
const BUCKET_ID = 'product-images';

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// Kategori produk
const CATEGORIES = [
    { name: 'DIOSYS & Y2000', description: 'Produk perawatan mata DIOSYS dan Y2000' },
    { name: 'GIP', description: 'Produk GIP untuk kesehatan mata' },
    { name: 'SOFTLENS', description: 'Berbagai jenis softlens' },
    { name: 'BLESSING', description: 'Produk Blessing untuk mata' },
    { name: 'MELANIE', description: 'Koleksi Melanie' },
    { name: 'TUFT & LUMI', description: 'Produk Tuft dan Lumi' },
    { name: 'RIDHA', description: 'Produk Ridha' },
    { name: 'TAKEDA & LUMINIQUE', description: 'Produk premium Takeda dan Luminique' },
    { name: 'BESTZ 3G', description: 'Produk Bestz 3G' },
    { name: 'PERLENGKAPAN', description: 'Perlengkapan dan aksesoris mata' },
    { name: 'LAIN LAIN', description: 'Produk lainnya' },
    { name: 'AKSESORIS', description: 'Aksesoris mata dan kacamata' },
    { name: 'BEAUTICA', description: 'Koleksi Beautica' },
];

// Sample products
const SAMPLE_PRODUCTS = [
    // DIOSYS & Y2000
    { name: 'Diosys Eye Drops 5ml', price: 45000, discount: 10, category: 'DIOSYS & Y2000' },
    { name: 'Y2000 Vision Care', price: 38000, discount: 0, category: 'DIOSYS & Y2000' },
    { name: 'Diosys Premium Solution', price: 52000, discount: 15, category: 'DIOSYS & Y2000' },

    // GIP
    { name: 'GIP Eye Solution 10ml', price: 52000, discount: 0, category: 'GIP' },
    { name: 'GIP Plus Advanced', price: 65000, discount: 20, category: 'GIP' },
    { name: 'GIP Comfort Drops', price: 48000, discount: 5, category: 'GIP' },

    // SOFTLENS
    { name: 'Softlens Daily Black', price: 85000, discount: 0, category: 'SOFTLENS' },
    { name: 'Softlens Monthly Gray', price: 120000, discount: 10, category: 'SOFTLENS' },
    { name: 'Softlens Colored Blue', price: 95000, discount: 15, category: 'SOFTLENS' },
    { name: 'Softlens Natural Brown', price: 90000, discount: 0, category: 'SOFTLENS' },
    { name: 'Softlens Hazel Premium', price: 110000, discount: 12, category: 'SOFTLENS' },

    // BLESSING
    { name: 'Blessing Eye Care', price: 42000, discount: 0, category: 'BLESSING' },
    { name: 'Blessing Premium Drops', price: 55000, discount: 8, category: 'BLESSING' },

    // MELANIE
    { name: 'Melanie Natural Look', price: 78000, discount: 0, category: 'MELANIE' },
    { name: 'Melanie Glamour Series', price: 92000, discount: 10, category: 'MELANIE' },
    { name: 'Melanie Elegant Collection', price: 88000, discount: 5, category: 'MELANIE' },

    // TUFT & LUMI
    { name: 'Tuft Clear Vision', price: 68000, discount: 0, category: 'TUFT & LUMI' },
    { name: 'Lumi Bright Eyes', price: 72000, discount: 0, category: 'TUFT & LUMI' },

    // RIDHA
    { name: 'Ridha Eye Comfort', price: 48000, discount: 0, category: 'RIDHA' },
    { name: 'Ridha Ultra Care', price: 59000, discount: 10, category: 'RIDHA' },

    // TAKEDA & LUMINIQUE
    { name: 'Takeda Professional', price: 118000, discount: 15, category: 'TAKEDA & LUMINIQUE' },
    { name: 'Luminique Luxury', price: 135000, discount: 20, category: 'TAKEDA & LUMINIQUE' },

    // BESTZ 3G
    { name: 'Bestz 3G Standard', price: 88000, discount: 0, category: 'BESTZ 3G' },
    { name: 'Bestz 3G Premium', price: 105000, discount: 10, category: 'BESTZ 3G' },

    // PERLENGKAPAN
    { name: 'Contact Lens Case', price: 15000, discount: 0, category: 'PERLENGKAPAN' },
    { name: 'Lens Cleaning Solution 100ml', price: 25000, discount: 0, category: 'PERLENGKAPAN' },
    { name: 'Lens Tweezers', price: 18000, discount: 0, category: 'PERLENGKAPAN' },
    { name: 'Lens Storage Kit', price: 35000, discount: 5, category: 'PERLENGKAPAN' },

    // LAIN LAIN
    { name: 'Eye Vitamin Supplement', price: 75000, discount: 10, category: 'LAIN LAIN' },
    { name: 'Reading Glasses', price: 65000, discount: 0, category: 'LAIN LAIN' },
    { name: 'Blue Light Glasses', price: 85000, discount: 15, category: 'LAIN LAIN' },

    // AKSESORIS
    { name: 'Stylish Glasses Chain', price: 35000, discount: 0, category: 'AKSESORIS' },
    { name: 'Lens Storage Box', price: 28000, discount: 0, category: 'AKSESORIS' },
    { name: 'Microfiber Cleaning Cloth', price: 12000, discount: 0, category: 'AKSESORIS' },
    { name: 'Glasses Case Premium', price: 45000, discount: 10, category: 'AKSESORIS' },

    // BEAUTICA
    { name: 'Beautica Natural Brown', price: 98000, discount: 0, category: 'BEAUTICA' },
    { name: 'Beautica Hazel Premium', price: 108000, discount: 12, category: 'BEAUTICA' },
    { name: 'Beautica Ocean Blue', price: 98000, discount: 8, category: 'BEAUTICA' },
    { name: 'Beautica Gray Elegant', price: 105000, discount: 10, category: 'BEAUTICA' },
];

async function setupAppwrite() {
    console.log('🚀 Memulai setup Appwrite Database...\n');

    try {
        // Step 1: Create Database
        console.log('📦 Step 1: Membuat Database...');
        let database;
        try {
            database = await databases.create(DATABASE_ID, 'Katalog Toko Database');
            console.log('✅ Database berhasil dibuat:', database.$id);
        } catch (error: any) {
            if (error.code === 409) {
                console.log('ℹ️  Database sudah ada, melanjutkan...');
            } else {
                throw error;
            }
        }

        // Step 2: Create Products Collection
        console.log('\n📦 Step 2: Membuat Collection Products...');
        try {
            const productsCollection = await databases.createCollection(
                DATABASE_ID,
                COLLECTION_PRODUCTS,
                'Products',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ]
            );
            console.log('✅ Collection Products berhasil dibuat');

            // Create attributes for products
            console.log('   📝 Membuat attributes untuk Products...');
            
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_PRODUCTS, 'name', 255, true);
            console.log('   ✅ Attribute "name" dibuat');
            
            await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_PRODUCTS, 'price', true);
            console.log('   ✅ Attribute "price" dibuat');
            
            await databases.createFloatAttribute(DATABASE_ID, COLLECTION_PRODUCTS, 'discount', false, 0);
            console.log('   ✅ Attribute "discount" dibuat');
            
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_PRODUCTS, 'category', 100, true);
            console.log('   ✅ Attribute "category" dibuat');
            
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_PRODUCTS, 'imageId', 255, false);
            console.log('   ✅ Attribute "imageId" dibuat');

            // Wait for attributes to be available
            console.log('   ⏳ Menunggu attributes siap...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Create indexes
            console.log('   📑 Membuat indexes...');
            try {
                await databases.createIndex(DATABASE_ID, COLLECTION_PRODUCTS, 'category_idx', 'key' as any, ['category']);
                console.log('   ✅ Index "category" dibuat');
            } catch (e: any) {
                console.log('   ℹ️  Index "category" sudah ada atau error:', e.message);
            }
            
            try {
                await databases.createIndex(DATABASE_ID, COLLECTION_PRODUCTS, 'name_idx', 'fulltext' as any, ['name']);
                console.log('   ✅ Index "name" dibuat');
            } catch (e: any) {
                console.log('   ℹ️  Index "name" sudah ada atau error:', e.message);
            }

        } catch (error: any) {
            if (error.code === 409) {
                console.log('ℹ️  Collection Products sudah ada, melanjutkan...');
            } else {
                throw error;
            }
        }

        // Step 3: Create Categories Collection
        console.log('\n📦 Step 3: Membuat Collection Categories...');
        try {
            await databases.createCollection(
                DATABASE_ID,
                COLLECTION_CATEGORIES,
                'Categories',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ]
            );
            console.log('✅ Collection Categories berhasil dibuat');

            // Create attributes for categories
            console.log('   📝 Membuat attributes untuk Categories...');
            
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_CATEGORIES, 'name', 100, true);
            console.log('   ✅ Attribute "name" dibuat');
            
            await databases.createStringAttribute(DATABASE_ID, COLLECTION_CATEGORIES, 'description', 500, false);
            console.log('   ✅ Attribute "description" dibuat');

            // Wait for attributes to be available
            console.log('   ⏳ Menunggu attributes siap...');
            await new Promise(resolve => setTimeout(resolve, 3000));

        } catch (error: any) {
            if (error.code === 409) {
                console.log('ℹ️  Collection Categories sudah ada, melanjutkan...');
            } else {
                throw error;
            }
        }

        // Step 4: Create Storage Bucket
        console.log('\n📦 Step 4: Membuat Storage Bucket...');
        try {
            await storage.createBucket(
                BUCKET_ID,
                'Product Images',
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ],
                false, // compression
                false, // encryption
                10485760, // 10MB max file size
                ['jpg', 'jpeg', 'png', 'webp', 'gif'], // allowed extensions
            );
            console.log('✅ Storage Bucket berhasil dibuat');
        } catch (error: any) {
            if (error.code === 409) {
                console.log('ℹ️  Storage Bucket sudah ada, melanjutkan...');
            } else {
                throw error;
            }
        }

        // Step 5: Insert Categories
        console.log('\n📦 Step 5: Memasukkan data Categories...');
        let insertedCategories = 0;
        for (const category of CATEGORIES) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_CATEGORIES,
                    ID.unique(),
                    category
                );
                insertedCategories++;
                console.log(`   ✅ Category "${category.name}" ditambahkan`);
            } catch (error: any) {
                if (error.code === 409) {
                    console.log(`   ℹ️  Category "${category.name}" sudah ada`);
                } else {
                    console.log(`   ⚠️  Error menambahkan "${category.name}":`, error.message);
                }
            }
        }
        console.log(`✅ Total ${insertedCategories} categories berhasil ditambahkan`);

        // Step 6: Insert Sample Products
        console.log('\n📦 Step 6: Memasukkan sample products...');
        let insertedProducts = 0;
        for (const product of SAMPLE_PRODUCTS) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_PRODUCTS,
                    ID.unique(),
                    {
                        name: product.name,
                        price: product.price,
                        discount: product.discount,
                        category: product.category,
                        imageId: null,
                    }
                );
                insertedProducts++;
                console.log(`   ✅ Product "${product.name}" ditambahkan`);
            } catch (error: any) {
                console.log(`   ⚠️  Error menambahkan "${product.name}":`, error.message);
            }
        }
        console.log(`✅ Total ${insertedProducts} products berhasil ditambahkan`);

        // Step 7: Update .env.local
        console.log('\n📦 Step 7: Informasi Environment Variables...');
        console.log('\n📋 Pastikan .env.local Anda memiliki nilai berikut:');
        console.log('─────────────────────────────────────────────────');
        console.log(`NEXT_PUBLIC_APPWRITE_ENDPOINT=${ENDPOINT}`);
        console.log(`NEXT_PUBLIC_APPWRITE_PROJECT_ID=${PROJECT_ID}`);
        console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${DATABASE_ID}`);
        console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS=${COLLECTION_PRODUCTS}`);
        console.log(`NEXT_PUBLIC_APPWRITE_COLLECTION_CATEGORIES=${COLLECTION_CATEGORIES}`);
        console.log(`NEXT_PUBLIC_APPWRITE_BUCKET_ID=${BUCKET_ID}`);
        console.log(`APPWRITE_API_KEY=your_api_key_here`);
        console.log('─────────────────────────────────────────────────\n');

        console.log('🎉 Setup Appwrite selesai!');
        console.log('\n📊 Summary:');
        console.log(`   - Database: ${DATABASE_ID}`);
        console.log(`   - Collections: 2 (products, categories)`);
        console.log(`   - Categories: ${insertedCategories}`);
        console.log(`   - Products: ${insertedProducts}`);
        console.log(`   - Storage Bucket: ${BUCKET_ID}`);
        console.log('\n✅ Aplikasi siap digunakan!');
        console.log('   Jalankan: npm run dev');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        console.error('Detail:', error);
        process.exit(1);
    }
}

// Run setup
setupAppwrite();
