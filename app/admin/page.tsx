'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import styles from './admin.module.css';

const CATEGORIES = [
    'DIOSYS & Y2000',
    'GIP',
    'SOFTLENS',
    'BLESSING',
    'MELANIE',
    'TUFT & LUMI',
    'RIDHA',
    'TAKEDA & LUMINIQUE',
    'BESTZ 3G',
    'PERLENGKAPAN',
    'LAIN LAIN',
    'AKSESORIS',
    'BEAUTICA',
];

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: '',
        category: CATEGORIES[0],
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            showMessage('error', 'Gagal memuat produk');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return null;

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                return data.data.fileId;
            }
            throw new Error(data.message);
        } catch (error: any) {
            showMessage('error', error.message || 'Gagal upload gambar');
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageId = editingProduct?.imageId;

            // Upload new image if selected
            if (imageFile) {
                const uploadedImageId = await uploadImage();
                if (uploadedImageId) {
                    imageId = uploadedImageId;
                } else {
                    setUploading(false);
                    return;
                }
            }

            const productData = {
                name: formData.name,
                price: parseFloat(formData.price),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                category: formData.category,
                imageId,
            };

            if (editingProduct) {
                // Update existing product
                const response = await fetch('/api/products', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingProduct.$id, ...productData }),
                });

                const data = await response.json();
                if (data.success) {
                    showMessage('success', 'Produk berhasil diperbarui');
                    resetForm();
                    fetchProducts();
                } else {
                    showMessage('error', data.message || 'Gagal memperbarui produk');
                }
            } else {
                // Create new product
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });

                const data = await response.json();
                if (data.success) {
                    showMessage('success', 'Produk berhasil ditambahkan');
                    resetForm();
                    fetchProducts();
                } else {
                    showMessage('error', data.message || 'Gagal menambahkan produk');
                }
            }
        } catch (error) {
            showMessage('error', 'Terjadi kesalahan');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            discount: product.discount ? product.discount.toString() : '',
            category: product.category,
        });
        setImagePreview('');
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;

        try {
            const response = await fetch(`/api/products?id=${productId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                showMessage('success', 'Produk berhasil dihapus');
                fetchProducts();
            } else {
                showMessage('error', data.message || 'Gagal menghapus produk');
            }
        } catch (error) {
            showMessage('error', 'Terjadi kesalahan');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', discount: '', category: CATEGORIES[0] });
        setImageFile(null);
        setImagePreview('');
        setEditingProduct(null);
    };

    const getImageUrl = (imageId?: string) => {
        if (!imageId) return '';
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
        const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
        const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
        return `${endpoint}/storage/buckets/${bucketId}/files/${imageId}/view?project=${projectId}`;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <Link href="/" className={styles.logo}>
                            🛍️ PT VALOR - Admin Panel
                        </Link>
                        <Link href="/" className="btn btn-secondary">
                            ← Kembali ke Katalog
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container">
                {/* Message Alert */}
                {message && (
                    <div
                        className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className={styles.adminContent}>
                    {/* Product Form */}
                    <aside className={styles.formSection}>
                        <div className={`glass-card ${styles.formCard}`}>
                            <h2 className={styles.formTitle}>
                                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h2>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Nama Produk *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                        placeholder="Contoh: Softlens Daily Black"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="price">Harga (IDR) *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        required
                                        min="0"
                                        step="1000"
                                        placeholder="Contoh: 85000"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="discount">Diskon (%)</label>
                                    <input
                                        type="number"
                                        id="discount"
                                        value={formData.discount}
                                        onChange={(e) =>
                                            setFormData({ ...formData, discount: e.target.value })
                                        }
                                        min="0"
                                        max="100"
                                        step="1"
                                        placeholder="Contoh: 10"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="category">Kategori *</label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                        required
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="image">Gambar Produk</label>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleImageChange}
                                    />
                                    {(imagePreview || (editingProduct && editingProduct.imageId)) && (
                                        <div className={styles.imagePreview}>
                                            <img
                                                src={
                                                    imagePreview ||
                                                    getImageUrl(editingProduct?.imageId)
                                                }
                                                alt="Preview"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.formActions}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={uploading}
                                    >
                                        {uploading
                                            ? 'Menyimpan...'
                                            : editingProduct
                                                ? 'Perbarui Produk'
                                                : 'Simpan Produk'}
                                    </button>
                                    {editingProduct && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={resetForm}
                                        >
                                            Batal Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </aside>

                    {/* Products List */}
                    <section className={styles.productsSection}>
                        <div className={`glass-card ${styles.productsCard}`}>
                            <h2 className={styles.productsTitle}>
                                Daftar Produk ({products.length})
                            </h2>

                            {loading ? (
                                <div className={styles.loadingContainer}>
                                    <div className="loading"></div>
                                    <p>Memuat produk...</p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <p>Belum ada produk. Tambahkan produk pertama Anda!</p>
                                </div>
                            ) : (
                                <div className={styles.productsList}>
                                    {products.map((product) => (
                                        <div key={product.$id} className={styles.productItem}>
                                            {product.imageId && (
                                                <div className={styles.productItemImage}>
                                                    <img
                                                        src={getImageUrl(product.imageId)}
                                                        alt={product.name}
                                                    />
                                                </div>
                                            )}
                                            <div className={styles.productItemInfo}>
                                                <h3>{product.name}</h3>
                                                <div className={styles.productItemMeta}>
                                                    <span className={styles.categoryBadge}>
                                                        {product.category}
                                                    </span>
                                                    <span className={styles.priceBadge}>
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    {product.discount && product.discount > 0 && (
                                                        <span className={styles.discountBadge}>
                                                            -{product.discount}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.productItemActions}>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(product.$id)}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
