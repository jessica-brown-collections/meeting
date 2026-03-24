'use client';

import * as React from 'react';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import { FlashSale, DataChannelMessage } from '../shopping/types';

export function useFlashSale() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [activeFlashSale, setActiveFlashSale] = React.useState<FlashSale | null>(null);

  React.useEffect(() => {
    const handleData = (
      payload: Uint8Array,
      _participant: unknown,
      _kind: unknown,
      topic?: string,
    ) => {
      if (topic !== 'shopping:flash-sale') return;
      try {
        const text = new TextDecoder().decode(payload);
        const msg = JSON.parse(text) as DataChannelMessage<FlashSale>;
        const sale = msg.payload;
        setActiveFlashSale(sale);
        const remaining = sale.endsAt - Date.now();
        if (remaining > 0) {
          setTimeout(() => setActiveFlashSale(null), remaining);
        }
      } catch {
        // ignore malformed messages
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room]);

  const announceFlashSale = React.useCallback(
    (productId: string, discountPercent: number, durationMs: number, message: string) => {
      if (!localParticipant.permissions?.canUpdateMetadata) return;

      const sale: FlashSale = {
        productId,
        discountPercent,
        endsAt: Date.now() + durationMs,
        message,
      };

      const msg: DataChannelMessage<FlashSale> = {
        topic: 'shopping:flash-sale',
        payload: sale,
      };

      const encoded = new TextEncoder().encode(JSON.stringify(msg));
      localParticipant
        .publishData(encoded, {
          reliable: true,
          topic: 'shopping:flash-sale',
        })
        .catch(console.error);

      setActiveFlashSale(sale);
      setTimeout(() => setActiveFlashSale(null), durationMs);
    },
    [localParticipant],
  );

  const dismissFlashSale = React.useCallback(() => {
    setActiveFlashSale(null);
  }, []);

  return { activeFlashSale, announceFlashSale, dismissFlashSale };
}
