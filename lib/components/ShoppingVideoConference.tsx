'use client';

import * as React from 'react';
import { formatChatMessageLinks, VideoConference } from '@livekit/components-react';
import { SettingsMenu } from '../SettingsMenu';
import { useShoppingState } from '../hooks/useShoppingState';
import { useHost } from '../hooks/useHost';
import { useReactions } from '../hooks/useReactions';
import { useFlashSale } from '../hooks/useFlashSale';
import { PRODUCT_CATALOG } from '../shopping/products';
import { ProductOverlay } from './ProductOverlay';
import { ProductCarousel } from './ProductCarousel';
import { ReactionBar } from './ReactionBar';
import { FlashSaleBanner } from './FlashSaleBanner';
import styles from '../../styles/Shopping.module.css';

const SHOW_SETTINGS_MENU = process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU === 'true';

const DEFAULT_FLASH_SALE_DURATION_MS = 60_000;
const DEFAULT_FLASH_SALE_DISCOUNT = 20;

export function ShoppingVideoConference() {
  const { isHost } = useHost();
  const { pinnedProduct, pinProduct, unpinProduct } = useShoppingState();
  const { reactions, sendReaction } = useReactions();
  const { activeFlashSale, announceFlashSale, dismissFlashSale } = useFlashSale();

  const [viewerDismissedOverlay, setViewerDismissedOverlay] = React.useState(false);

  React.useEffect(() => {
    setViewerDismissedOverlay(false);
  }, [pinnedProduct?.id]);

  const handleFlashSale = React.useCallback(
    (productId: string) => {
      announceFlashSale(
        productId,
        DEFAULT_FLASH_SALE_DISCOUNT,
        DEFAULT_FLASH_SALE_DURATION_MS,
        '⚡ Flash Sale — Limited Time Only!',
      );
    },
    [announceFlashSale],
  );

  const showProductOverlay = pinnedProduct !== null && !viewerDismissedOverlay;

  return (
    <div className={styles.shoppingRoom}>
      <VideoConference
        chatMessageFormatter={formatChatMessageLinks}
        SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
      />

      {activeFlashSale && (
        <FlashSaleBanner flashSale={activeFlashSale} onDismiss={dismissFlashSale} />
      )}

      {showProductOverlay && (
        <ProductOverlay
          product={pinnedProduct}
          onDismiss={isHost ? undefined : () => setViewerDismissedOverlay(true)}
        />
      )}

      <ReactionBar reactions={reactions} onSendReaction={sendReaction} />

      {isHost && (
        <ProductCarousel
          products={PRODUCT_CATALOG}
          pinnedProductId={pinnedProduct?.id ?? null}
          onPin={pinProduct}
          onUnpin={unpinProduct}
          onFlashSale={handleFlashSale}
        />
      )}
    </div>
  );
}
