'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, CartItem } from '@/types';
import styles from './page.module.css';

const CATEGORIES = [
  'ALL',
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageId?: string) => {
    if (!imageId) return '/placeholder-product.jpg';
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

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.$id === product.$id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.$id === product.$id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setSelectedProduct(null);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.$id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.$id !== productId));
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
      const price = calculateDiscountedPrice(item.product.price, item.product.discount);
      return sum + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const completeCheckout = () => {
    alert('Terima kasih! Pesanan Anda telah diterima.');
    setCart([]);
    setShowCheckout(false);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>
              🛍️ PT VALOR TOKO
            </Link>

            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.navLinks}>
              <button
                className={`btn btn-secondary ${styles.cartBtn}`}
                onClick={() => setShowCart(true)}
              >
                🛒 Keranjang ({getTotalItems()})
              </button>
              <Link href="/about" className="btn btn-secondary">
                Tentang
              </Link>
              <Link href="/admin" className="btn btn-primary">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className={styles.mainContent}>
          {/* Sidebar - Category Filter */}
          <aside className={styles.sidebar}>
            <div className={`glass-card ${styles.filterCard}`}>
              <h2 className={styles.filterTitle}>Kategori</h2>
              <ul className={styles.categoryList}>
                {CATEGORIES.map((category) => (
                  <li
                    key={category}
                    className={`${styles.categoryItem} ${selectedCategory === category ? styles.active : ''
                      }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'ALL' ? 'Semua Produk' : category}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Section */}
          <section className={styles.productsSection}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>
                {selectedCategory === 'ALL' ? 'Semua Produk' : selectedCategory}
              </h1>
              <div className={styles.productCount}>
                {products.length} Produk
              </div>
            </div>

            {loading ? (
              <div className={styles.loadingContainer}>
                <div className="loading"></div>
                <p>Memuat produk...</p>
              </div>
            ) : products.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Tidak ada produk ditemukan</p>
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {products.map((product) => (
                  <div
                    key={product.$id}
                    className={`glass-card ${styles.productCard}`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.discount && product.discount > 0 && (
                      <div className={styles.discountBadge}>
                        -{product.discount}%
                      </div>
                    )}
                    <div className={styles.productImage}>
                      <img
                        src={getImageUrl(product.imageId)}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <div className={styles.productCategory}>
                        {product.category}
                      </div>
                      <div className={styles.priceContainer}>
                        {product.discount && product.discount > 0 ? (
                          <>
                            <div className={styles.originalPrice}>
                              {formatPrice(product.price)}
                            </div>
                            <div className={styles.productPrice}>
                              {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                            </div>
                          </>
                        ) : (
                          <div className={styles.productPrice}>
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <div className={styles.modal} onClick={() => setSelectedProduct(null)}>
          <div
            className={`glass-card ${styles.modalContent}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>{selectedProduct.name}</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalImage}>
                <img
                  src={getImageUrl(selectedProduct.imageId)}
                  alt={selectedProduct.name}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.jpg';
                  }}
                />
              </div>
              <div className={styles.modalInfo}>
                <div className={styles.modalCategory}>
                  {selectedProduct.category}
                </div>
                <div className={styles.priceContainer}>
                  {selectedProduct.discount && selectedProduct.discount > 0 ? (
                    <>
                      <div className={styles.originalPrice}>
                        {formatPrice(selectedProduct.price)}
                      </div>
                      <div className={styles.modalPrice}>
                        {formatPrice(calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount))}
                      </div>
                      <div className={styles.discountText}>
                        Hemat {selectedProduct.discount}%
                      </div>
                    </>
                  ) : (
                    <div className={styles.modalPrice}>
                      {formatPrice(selectedProduct.price)}
                    </div>
                  )}
                </div>
              </div>
              <button
                className={`btn btn-primary ${styles.addToCartBtn}`}
                onClick={() => addToCart(selectedProduct)}
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className={styles.modal} onClick={() => setShowCart(false)}>
          <div
            className={`glass-card ${styles.modalContent} ${styles.cartModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Keranjang Belanja</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowCart(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.cartBody}>
              {cart.length === 0 ? (
                <div className={styles.emptyCart}>
                  <p>Keranjang belanja kosong</p>
                </div>
              ) : (
                <>
                  <div className={styles.cartItems}>
                    {cart.map((item) => (
                      <div key={item.product.$id} className={styles.cartItem}>
                        <img
                          src={getImageUrl(item.product.imageId)}
                          alt={item.product.name}
                          className={styles.cartItemImage}
                        />
                        <div className={styles.cartItemInfo}>
                          <h4>{item.product.name}</h4>
                          <p className={styles.cartItemPrice}>
                            {formatPrice(calculateDiscountedPrice(item.product.price, item.product.discount))}
                          </p>
                        </div>
                        <div className={styles.cartItemActions}>
                          <button
                            onClick={() => updateQuantity(item.product.$id, item.quantity - 1)}
                            className={styles.qtyBtn}
                          >
                            -
                          </button>
                          <span className={styles.quantity}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.$id, item.quantity + 1)}
                            className={styles.qtyBtn}
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.$id)}
                            className={styles.removeBtn}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.cartSummary}>
                    <div className={styles.totalRow}>
                      <span>Total:</span>
                      <span className={styles.totalPrice}>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <button
                      className={`btn btn-primary ${styles.checkoutBtn}`}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className={styles.modal} onClick={() => setShowCheckout(false)}>
          <div
            className={`glass-card ${styles.modalContent} ${styles.checkoutModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Checkout</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowCheckout(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.checkoutBody}>
              <div className={styles.checkoutSection}>
                <h3>Ringkasan Pesanan</h3>
                <div className={styles.orderSummary}>
                  {cart.map((item) => (
                    <div key={item.product.$id} className={styles.orderItem}>
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>{formatPrice(calculateDiscountedPrice(item.product.price, item.product.discount) * item.quantity)}</span>
                    </div>
                  ))}
                  <div className={styles.orderTotal}>
                    <strong>Total:</strong>
                    <strong>{formatPrice(getTotalPrice())}</strong>
                  </div>
                </div>
              </div>

              <div className={styles.checkoutSection}>
                <h3>Informasi Pengiriman</h3>
                <form className={styles.checkoutForm}>
                  <input type="text" placeholder="Nama Lengkap" required />
                  <input type="tel" placeholder="Nomor Telepon" required />
                  <input type="email" placeholder="Email" required />
                  <textarea placeholder="Alamat Lengkap" rows={3} required></textarea>
                </form>
              </div>

              <button
                className={`btn btn-primary ${styles.completeBtn}`}
                onClick={completeCheckout}
              >
                Selesaikan Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
