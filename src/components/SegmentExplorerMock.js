'use client';
import React, { createContext, useContext, useState } from 'react';

export const SEGMENT_EXPLORER_SIMULATED_ERROR_MESSAGE = 'NEXT_DEVTOOLS_SIMULATED_ERROR';

export function SegmentBoundaryTriggerNode() {
  return null;
}

const SegmentStateContext = createContext({
  boundaryType: null,
  setBoundaryType: () => {}
});

export function SegmentStateProvider({ children }) {
  const [boundaryType, setBoundaryType] = useState(null);
  return (
    <SegmentStateContext.Provider value={{ boundaryType, setBoundaryType }}>
      {children}
    </SegmentStateContext.Provider>
  );
}

export function useSegmentState() {
  return useContext(SegmentStateContext);
}

export function SegmentViewStateNode() {
  return null;
}

export function SegmentViewNode({ children }) {
  return <>{children}</>;
}
