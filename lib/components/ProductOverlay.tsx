'use client';

import * as React from 'react';
import { Product } from '../shopping/types';
import styles from '../../styles/Shopping.module.css';

interface ProductOverlayProps {
  product: Product;
  onDismiss?: () => void;
}

export function ProductOverlay({ product, onDismiss }: ProductOverlayProps) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  return (
    <div className={styles.productOverlay}>
      <div className={styles.productOverlayInner}>
        <div className={styles.productImageWrap}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImage}
            loading="lazy"
          />
          {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
        </div>
        <div className={styles.productInfo}>
          <p className={styles.productCategory}>{product.category}</p>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productDescription}>{product.description}</p>
          <div className={styles.productPricing}>
            <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={styles.productOriginalPrice}>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {discount && <span className={styles.productDiscount}>-{discount}%</span>}
          </div>
          {!product.inStock && <p className={styles.outOfStock}>Out of stock</p>}
          {product.inStock && product.stockCount && product.stockCount <= 20 && (
            <p className={styles.lowStock}>Only {product.stockCount} left!</p>
          )}
          <a
            href={product.cartUrl}
            className={styles.addToCartBtn}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!product.inStock}
            onClick={(e) => !product.inStock && e.preventDefault()}
          >
            🛒 {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </a>
        </div>
        {onDismiss && (
          <button className={styles.overlayDismiss} onClick={onDismiss} aria-label="Close product">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
