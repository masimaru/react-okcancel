import { useContext, useCallback } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { PopContext } from './context';

export const usePop = () => {
  const manager = useContext(PopContext);

  if (!manager) {
    throw new Error('usePop must be used within a PopProvider');
  }

  return manager;
};

export const usePopState = () => {
  const manager = usePop();

  const subscribe = useCallback((callback: () => void) => manager.subscribe(callback), [manager]);

  const getSnapshot = useCallback(() => manager.getSnapshot(), [manager]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
