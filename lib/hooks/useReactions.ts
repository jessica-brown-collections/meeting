'use client';

import * as React from 'react';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { RoomEvent, DataPacket_Kind } from 'livekit-client';
import { Reaction, ReactionType, DataChannelMessage } from '../shopping/types';
import { randomString } from '../client-utils';

const MAX_VISIBLE_REACTIONS = 30;
const REACTION_TTL_MS = 3500;
const THROTTLE_MS = 500;

export function useReactions() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [reactions, setReactions] = React.useState<Reaction[]>([]);
  const lastSentRef = React.useRef<number>(0);

  React.useEffect(() => {
    const handleData = (
      payload: Uint8Array,
      _participant: unknown,
      _kind: unknown,
      topic?: string,
    ) => {
      if (topic !== 'shopping:reaction') return;
      try {
        const text = new TextDecoder().decode(payload);
        const msg = JSON.parse(text) as DataChannelMessage<Reaction>;
        const reaction = msg.payload;
        setReactions((prev) => {
          const next = [...prev, reaction].slice(-MAX_VISIBLE_REACTIONS);
          return next;
        });
        setTimeout(() => {
          setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
        }, REACTION_TTL_MS);
      } catch {
        // ignore malformed messages
      }
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room]);

  const sendReaction = React.useCallback(
    (type: ReactionType) => {
      const now = Date.now();
      if (now - lastSentRef.current < THROTTLE_MS) return;
      lastSentRef.current = now;

      const reaction: Reaction = {
        id: randomString(8),
        type,
        participantIdentity: localParticipant.identity,
        timestamp: now,
      };

      const msg: DataChannelMessage<Reaction> = {
        topic: 'shopping:reaction',
        payload: reaction,
      };

      const encoded = new TextEncoder().encode(JSON.stringify(msg));
      localParticipant
        .publishData(encoded, {
          reliable: false,
          topic: 'shopping:reaction',
        })
        .catch(console.error);

      setReactions((prev) => {
        const next = [...prev, reaction].slice(-MAX_VISIBLE_REACTIONS);
        return next;
      });
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
      }, REACTION_TTL_MS);
    },
    [localParticipant],
  );

  return { reactions, sendReaction };
}
