import type { ReactNode, CSSProperties } from 'react';

export type DialogKind = 'default' | 'danger' | 'success' | 'info';

export type ToastKind = 'default' | 'success' | 'error' | 'info';

export type CloseReason = 'confirm' | 'cancel' | 'esc' | 'overlay' | 'system';

export interface ClassNames {
  overlay: string;
  dialog: string;
  header: string;
  title: string;
  description: string;
  footer: string;
  button: string;
  buttonPrimary: string;
  buttonSecondary: string;
  toast: string;
  toastContainer: string;
}

export interface InlineStyles {
  overlay?: CSSProperties;
  dialog?: CSSProperties;
  header?: CSSProperties;
  title?: CSSProperties;
  description?: CSSProperties;
  footer?: CSSProperties;
  button?: CSSProperties;
  buttonPrimary?: CSSProperties;
  buttonSecondary?: CSSProperties;
  toast?: CSSProperties;
  toastContainer?: CSSProperties;
}

export interface Theme {
  classNames: Partial<ClassNames>;
  styles: Partial<InlineStyles>;
}

export interface BaseDialogOptions {
  title?: ReactNode;
  description?: ReactNode;
  kind?: DialogKind;
  classNames?: Partial<ClassNames>;
  styles?: Partial<InlineStyles>;
}

export interface ConfirmOptions extends BaseDialogOptions {
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

export interface AlertOptions extends BaseDialogOptions {
  confirmText?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  kind?: ToastKind;
  autoDismiss?: number;
  classNames?: Partial<ClassNames>;
  styles?: Partial<InlineStyles>;
}

export interface Toast {
  id: number;
  kind: ToastKind;
  title?: ReactNode;
  description?: ReactNode;
  autoDismiss?: number;
  classNames?: Partial<ClassNames>;
  styles?: Partial<InlineStyles>;
}

export interface DialogState {
  type: 'confirm' | 'alert' | null;
  title?: ReactNode;
  description?: ReactNode;
  kind?: DialogKind;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  classNames?: Partial<ClassNames>;
  styles?: Partial<InlineStyles>;
  resolve?: (value: boolean | void) => void;
}

export interface OkCancelContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  alert: (options: AlertOptions) => Promise<void>;
  toast: {
    success: (options: Omit<ToastOptions, 'kind'>) => void;
    error: (options: Omit<ToastOptions, 'kind'>) => void;
    info: (options: Omit<ToastOptions, 'kind'>) => void;
    custom: (options: ToastOptions) => void;
  };
}

export interface OkCancelProviderProps {
  children: ReactNode;
  theme?: Partial<Theme>;
}
