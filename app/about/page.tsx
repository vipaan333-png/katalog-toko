'use client';

import Link from 'next/link';
import styles from './about.module.css';

export default function AboutPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <Link href="/" className={styles.logo}>
                            🛍️ PT VALOR
                        </Link>
                        <Link href="/" className="btn btn-secondary">
                            ← Kembali ke Katalog
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container">
                <div className={`glass-card ${styles.aboutCard}`}>
                    <h1 className={styles.title}>Tentang PT VALOR INSPIRATION PESONA</h1>

                    <div className={styles.content}>
                        <section className={styles.section}>
                            <h2>Profil Perusahaan</h2>
                            <p>
                                PT VALOR INSPIRATION PESONA adalah perusahaan yang bergerak di bidang
                                distribusi produk kecantikan dan perawatan mata. Kami menyediakan
                                berbagai produk berkualitas tinggi dari merek terpercaya untuk memenuhi
                                kebutuhan pelanggan kami.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2>Kategori Produk</h2>
                            <div className={styles.categoryGrid}>
                                <div className={styles.categoryItem}>
                                    <h3>Softlens & Aksesoris</h3>
                                    <p>Berbagai pilihan softlens dari merek ternama</p>
                                </div>
                                <div className={styles.categoryItem}>
                                    <h3>Perawatan Mata</h3>
                                    <p>Produk perawatan mata berkualitas tinggi</p>
                                </div>
                                <div className={styles.categoryItem}>
                                    <h3>Produk Kecantikan</h3>
                                    <p>Berbagai produk kecantikan pilihan</p>
                                </div>
                                <div className={styles.categoryItem}>
                                    <h3>Perlengkapan</h3>
                                    <p>Aksesoris dan perlengkapan pendukung</p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2>Hubungi Kami</h2>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <strong>📧 Email:</strong>
                                    <p>info@ptvalor.com</p>
                                </div>
                                <div className={styles.contactItem}>
                                    <strong>📱 Telepon:</strong>
                                    <p>+62 21 1234 5678</p>
                                </div>
                                <div className={styles.contactItem}>
                                    <strong>📍 Alamat:</strong>
                                    <p>Jakarta, Indonesia</p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2>Informasi Teknis</h2>
                            <p className={styles.techInfo}>
                                Website ini dibangun menggunakan teknologi modern:
                            </p>
                            <ul className={styles.techList}>
                                <li><strong>Next.js 14</strong> - React Framework</li>
                                <li><strong>TypeScript</strong> - Type Safety</li>
                                <li><strong>Appwrite</strong> - Backend as a Service</li>
                                <li><strong>Vercel</strong> - Cloud Deployment</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
