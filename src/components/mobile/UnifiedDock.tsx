import React from 'react';
import { ZurboDock } from './ZurboDock';

// This component is deprecated in favor of ZurboDock
// Keeping for backwards compatibility but redirecting to new component
export const UnifiedDock = () => {
  return <ZurboDock />;
};
