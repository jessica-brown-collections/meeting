'use client';

import * as React from 'react';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import { ATTR_PINNED_PRODUCT, type PinnedProduct, type Product } from '../shopping/types';
import { getProductById } from '../shopping/products';

function parsePinnedProduct(value: string | undefined): PinnedProduct | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as PinnedProduct;
  } catch {
    return null;
  }
}

function findHostPinnedProduct(room: ReturnType<typeof useRoomContext>): PinnedProduct | null {
  for (const participant of [room.localParticipant, ...room.remoteParticipants.values()]) {
    if (participant.permissions?.canUpdateMetadata) {
      const raw = participant.attributes?.[ATTR_PINNED_PRODUCT];
      const pinned = parsePinnedProduct(raw);
      if (pinned) return pinned;
    }
  }
  return null;
}

export function useShoppingState() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const [pinnedProduct, setPinnedProduct] = React.useState<Product | null>(() => {
    const initial = findHostPinnedProduct(room);
    return initial ? (getProductById(initial.productId) ?? null) : null;
  });

  React.useEffect(() => {
    const handleAttributesChanged = () => {
      const pinned = findHostPinnedProduct(room);
      setPinnedProduct(pinned ? (getProductById(pinned.productId) ?? null) : null);
    };

    room.on(RoomEvent.ParticipantAttributesChanged, handleAttributesChanged);
    return () => {
      room.off(RoomEvent.ParticipantAttributesChanged, handleAttributesChanged);
    };
  }, [room]);

  const pinProduct = React.useCallback(
    async (productId: string) => {
      if (!localParticipant.permissions?.canUpdateMetadata) return;
      const payload: PinnedProduct = { productId, pinnedAt: Date.now() };
      await localParticipant.setAttributes({
        [ATTR_PINNED_PRODUCT]: JSON.stringify(payload),
      });
    },
    [localParticipant],
  );

  const unpinProduct = React.useCallback(async () => {
    if (!localParticipant.permissions?.canUpdateMetadata) return;
    await localParticipant.setAttributes({ [ATTR_PINNED_PRODUCT]: '' });
  }, [localParticipant]);

  return { pinnedProduct, pinProduct, unpinProduct };
}
