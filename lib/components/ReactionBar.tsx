'use client';

import * as React from 'react';
import { Reaction, ReactionType, REACTION_TYPES } from '../shopping/types';
import styles from '../../styles/Shopping.module.css';

interface ReactionBarProps {
  reactions: Reaction[];
  onSendReaction: (type: ReactionType) => void;
}

export function ReactionBar({ reactions, onSendReaction }: ReactionBarProps) {
  return (
    <div className={styles.reactionBarWrap}>
      <div className={styles.reactionFloats} aria-live="polite" aria-atomic="false">
        {reactions.map((reaction) => (
          <span
            key={reaction.id}
            className={styles.reactionFloat}
            style={{
              left: `${10 + Math.random() * 80}%`,
            }}
          >
            {reaction.type}
          </span>
        ))}
      </div>
      <div className={styles.reactionButtons}>
        {REACTION_TYPES.map((type) => (
          <button
            key={type}
            className={styles.reactionBtn}
            onClick={() => onSendReaction(type)}
            aria-label={`Send ${type} reaction`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
