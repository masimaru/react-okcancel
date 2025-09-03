import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  OkCancelContextValue,
  OkCancelProviderProps,
  DialogState,
  Toast,
  ConfirmOptions,
  AlertOptions,
  ToastOptions,
  Theme,
} from './types';
import { OkCancelContext } from './context';
import { Dialog } from './components/dialog/dialog';
import { ToastContainer } from './components/toast/toast-container';

// Default theme configuration
const defaultTheme: Theme = {
  classNames: {
    overlay: '',
    dialog: '',
    header: '',
    title: '',
    description: '',
    footer: '',
    button: '',
    buttonPrimary: '',
    buttonSecondary: '',
    toast: '',
    toastContainer: '',
  },
  styles: {},
};

let toastIdCounter = 0;

export const OkCancelProvider = ({ children, theme = {} }: OkCancelProviderProps) => {
  const [dialogState, setDialogState] = useState<DialogState>({ type: null });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const previousActiveElementRef = useRef<Element | null>(null);

  // Merge user theme with defaults
  const mergedTheme: Theme = {
    classNames: {
      ...defaultTheme.classNames,
      ...theme.classNames,
    },
    styles: {
      ...defaultTheme.styles,
      ...theme.styles,
    },
  };

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
        kind: options.kind || 'default',
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
        closeOnOverlay: options.closeOnOverlay ?? true,
        closeOnEsc: options.closeOnEsc ?? true,
        classNames: options.classNames,
        styles: options.styles,
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
        kind: options.kind || 'default',
        confirmText: options.confirmText || '확인',
        closeOnOverlay: options.closeOnOverlay ?? false,
        closeOnEsc: options.closeOnEsc ?? false,
        classNames: options.classNames,
        styles: options.styles,
        resolve: resolve as (value: boolean | void) => void,
      });
    });
  }, []);

  const addToast = useCallback((kind: Toast['kind'], options: ToastOptions) => {
    const id = ++toastIdCounter;
    const toast: Toast = {
      id,
      kind,
      title: options.title,
      description: options.description,
      autoDismiss: options.autoDismiss ?? 3000,
      classNames: options.classNames,
      styles: options.styles,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto dismiss if configured
    if (toast.autoDismiss && toast.autoDismiss > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.autoDismiss);
    }
  }, []);

  const toast = {
    success: (options: Omit<ToastOptions, 'kind'>) => addToast('success', options),
    error: (options: Omit<ToastOptions, 'kind'>) => addToast('error', options),
    info: (options: Omit<ToastOptions, 'kind'>) => addToast('info', options),
    custom: (options: ToastOptions) => addToast(options.kind || 'default', options),
  };

  const contextValue: OkCancelContextValue = {
    confirm,
    alert,
    toast,
  };

  const handleDialogClose = useCallback(
    (confirmed: boolean) => {
      if (dialogState.resolve) {
        if (dialogState.type === 'confirm') {
          dialogState.resolve(confirmed);
        } else {
          dialogState.resolve();
        }
      }
      closeDialog();
    },
    [dialogState, closeDialog],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle keyboard events for ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dialogState.type && dialogState.closeOnEsc) {
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
      {dialogState.type && (
        <Dialog {...dialogState} theme={mergedTheme} onClose={handleDialogClose} />
      )}
      <ToastContainer toasts={toasts} theme={mergedTheme} onRemove={removeToast} />
    </OkCancelContext.Provider>
  );
};
