'use client';

import * as React from 'react';
import { Product } from '../shopping/types';
import styles from '../../styles/Shopping.module.css';

interface ProductCarouselProps {
  products: Product[];
  pinnedProductId: string | null;
  onPin: (productId: string) => void;
  onUnpin: () => void;
  onFlashSale: (productId: string) => void;
}

export function ProductCarousel({
  products,
  pinnedProductId,
  onPin,
  onUnpin,
  onFlashSale,
}: ProductCarouselProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={styles.carouselContainer}>
      <button
        className={`${styles.carouselToggle} lk-button`}
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        🏪 Products {isOpen ? '▼' : '▲'}
      </button>

      {isOpen && (
        <div className={styles.carouselPanel}>
          <div className={styles.carouselGrid}>
            {products.map((product) => {
              const isPinned = pinnedProductId === product.id;
              return (
                <div
                  key={product.id}
                  className={`${styles.carouselItem} ${isPinned ? styles.carouselItemPinned : ''}`}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={styles.carouselItemImage}
                    loading="lazy"
                  />
                  <div className={styles.carouselItemInfo}>
                    <p className={styles.carouselItemName}>{product.name}</p>
                    <p className={styles.carouselItemPrice}>${product.price.toFixed(2)}</p>
                    {!product.inStock && (
                      <span className={styles.carouselItemOutOfStock}>Out of stock</span>
                    )}
                  </div>
                  <div className={styles.carouselItemActions}>
                    <button
                      className={`lk-button ${styles.carouselPinBtn}`}
                      onClick={() => (isPinned ? onUnpin() : onPin(product.id))}
                      title={isPinned ? 'Unpin product' : 'Pin product for viewers'}
                    >
                      {isPinned ? '📌 Unpin' : '📌 Pin'}
                    </button>
                    {product.inStock && (
                      <button
                        className={`lk-button ${styles.carouselFlashBtn}`}
                        onClick={() => onFlashSale(product.id)}
                        title="Start a flash sale"
                      >
                        ⚡ Flash
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
