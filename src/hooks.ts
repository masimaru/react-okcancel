import { useContext } from 'react';
import { OkCancelContext } from './context';
import type { OkCancelContextValue } from './types';

export const useOkCancel = (): OkCancelContextValue => {
  const context = useContext(OkCancelContext);

  if (!context) {
    throw new Error('useOkCancel must be used within an OkCancelProvider');
  }
  //tt
  return context;
};
