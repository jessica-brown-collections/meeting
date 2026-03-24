'use client';

import * as React from 'react';
import { useLocalParticipant } from '@livekit/components-react';

export function useHost() {
  const { localParticipant } = useLocalParticipant();

  const isHost = React.useMemo(() => {
    return localParticipant.permissions?.canUpdateMetadata === true;
  }, [localParticipant.permissions?.canUpdateMetadata]);

  return { isHost };
}
