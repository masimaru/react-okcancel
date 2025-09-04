import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  OkCancelContextValue,
  OkCancelProviderProps,
  DialogState,
  ConfirmOptions,
  AlertOptions,
} from './types';
import { OkCancelContext } from './context';
import Dialog from './components/dialog';
// Toast feature removed

export default function OkCancelProvider({ children }: OkCancelProviderProps) {
  const [dialogState, setDialogState] = useState<DialogState>({ type: null });
  const previousActiveElementRef = useRef<Element | null>(null); // dialog를 열기 직전의 포커스 대상

  const closeDialog = useCallback(() => {
    setDialogState({ type: null });

    // Restore focus to previously active element
    if (previousActiveElementRef.current) {
      (previousActiveElementRef.current as HTMLElement).focus?.();
      previousActiveElementRef.current = null;
    }
  }, []);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      // Store current active element for focus restoration
      previousActiveElementRef.current = document.activeElement;

      setDialogState({
        type: 'confirm',
        title: options.title,
        description: options.description,
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
        canCloseOnOverlay: options.canCloseOnOverlay ?? true,
        canCloseOnEsc: options.canCloseOnEsc ?? true,
        resolve: resolve as (value: boolean | void) => void,
      });
    });
  }, []);

  const alert = useCallback((options: AlertOptions): Promise<void> => {
    return new Promise((resolve) => {
      // Store current active element for focus restoration
      previousActiveElementRef.current = document.activeElement;

      setDialogState({
        type: 'alert',
        title: options.title,
        description: options.description,
        confirmText: options.confirmText || '확인',
        canCloseOnOverlay: options.canCloseOnOverlay ?? false,
        canCloseOnEsc: options.canCloseOnEsc ?? false,
        resolve: resolve as (value: boolean | void) => void,
      });
    });
  }, []);

  const contextValue: OkCancelContextValue = {
    confirm,
    alert,
  };

  const handleDialogClose = useCallback(
    (isConfirmed: boolean) => {
      if (dialogState.resolve) {
        if (dialogState.type === 'confirm') {
          dialogState.resolve(isConfirmed);
        } else {
          dialogState.resolve();
        }
      }
      closeDialog();
    },
    [dialogState, closeDialog],
  );

  // Handle keyboard events for ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dialogState.type && dialogState.canCloseOnEsc) {
        event.preventDefault();
        handleDialogClose(false);
      }
    };

    if (dialogState.type) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [dialogState, handleDialogClose]);

  return (
    <OkCancelContext.Provider value={contextValue}>
      {children}
      {dialogState.type && <Dialog {...dialogState} onClose={handleDialogClose} />}
    </OkCancelContext.Provider>
  );
}
