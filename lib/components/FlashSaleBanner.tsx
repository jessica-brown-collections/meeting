'use client';

import * as React from 'react';
import { FlashSale } from '../shopping/types';
import { getProductById } from '../shopping/products';
import styles from '../../styles/Shopping.module.css';

interface FlashSaleBannerProps {
  flashSale: FlashSale;
  onDismiss: () => void;
}

export function FlashSaleBanner({ flashSale, onDismiss }: FlashSaleBannerProps) {
  const product = getProductById(flashSale.productId);
  const [timeLeft, setTimeLeft] = React.useState(() =>
    Math.max(0, Math.ceil((flashSale.endsAt - Date.now()) / 1000)),
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((flashSale.endsAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [flashSale.endsAt, onDismiss]);

  return (
    <div className={styles.flashSaleBanner}>
      <span className={styles.flashSaleIcon}>⚡</span>
      <div className={styles.flashSaleContent}>
        <strong className={styles.flashSaleTitle}>{flashSale.message}</strong>
        {product && (
          <span className={styles.flashSaleProduct}>
            {product.name} — {flashSale.discountPercent}% OFF
          </span>
        )}
      </div>
      <span className={styles.flashSaleTimer}>{timeLeft}s</span>
      <button className={styles.flashSaleDismiss} onClick={onDismiss} aria-label="Dismiss sale">
        ✕
      </button>
    </div>
  );
}
