import { useState, useCallback, useMemo } from 'react';
import type {
  OkCancelContextValue,
  OkCancelProviderProps,
  DialogState,
  ConfirmOptions,
  AlertOptions,
} from './types';
import { OkCancelContext } from './context';
import Dialog from './components/dialog';

export default function OkCancelProvider({ children }: OkCancelProviderProps) {
  const [dialogState, setDialogState] = useState<DialogState>({ type: null });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        type: 'confirm',
        title: options.title,
        description: options.description,
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
        canCloseOnOverlay: options.canCloseOnOverlay ?? true,
        canCloseOnEsc: options.canCloseOnEsc ?? true,
        showCloseButton: options.showCloseButton ?? false,
        enableAnimation: options.enableAnimation ?? true,
        resolve: resolve as (value: boolean | void) => void,
      });
    });
  }, []);

  const alert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      setDialogState({
        type: 'alert',
        title: options.title,
        description: options.description,
        confirmText: options.confirmText || '확인',
        canCloseOnOverlay: options.canCloseOnOverlay ?? true,
        canCloseOnEsc: options.canCloseOnEsc ?? true,
        showCloseButton: options.showCloseButton ?? false,
        enableAnimation: options.enableAnimation ?? true,
        resolve: resolve as (value: boolean | void) => void,
      });
    });
  }, []);

  const contextValue = useMemo<OkCancelContextValue>(
    () => ({
      confirm,
      alert,
    }),
    [confirm, alert],
  );

  const handleDialogClose = useCallback((isConfirmed: boolean) => {
    setDialogState((prev) => {
      if (!prev.resolve) return prev;

      const result = prev.type === 'confirm' ? isConfirmed : undefined;
      prev.resolve(result);
      return { type: null };
    });
  }, []);

  return (
    <OkCancelContext.Provider value={contextValue}>
      {children}
      {dialogState.type && <Dialog {...dialogState} onClose={handleDialogClose} />}
    </OkCancelContext.Provider>
  );
}
