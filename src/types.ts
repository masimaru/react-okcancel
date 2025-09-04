import type { ReactNode } from 'react';

export interface BaseDialogOptions {
  title?: ReactNode;
  description?: ReactNode;
}

export interface ConfirmOptions extends BaseDialogOptions {
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  canCloseOnOverlay?: boolean;
  canCloseOnEsc?: boolean;
}

export interface AlertOptions extends BaseDialogOptions {
  confirmText?: ReactNode;
  canCloseOnOverlay?: boolean;
  canCloseOnEsc?: boolean;
}

export interface DialogState {
  type: 'confirm' | 'alert' | null;
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  canCloseOnOverlay?: boolean;
  canCloseOnEsc?: boolean;
  resolve?: (value: boolean | void) => void;
}

export interface OkCancelContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  alert: (options: AlertOptions) => Promise<void>;
}

export interface OkCancelProviderProps {
  children: ReactNode;
}
