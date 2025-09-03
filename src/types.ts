import type { ReactNode, CSSProperties } from 'react';

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
}

export interface Theme {
  classNames: Partial<ClassNames>;
  styles: Partial<InlineStyles>;
}

export interface BaseDialogOptions {
  title?: ReactNode;
  description?: ReactNode;
  classNames?: Partial<ClassNames>;
  styles?: Partial<InlineStyles>;
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
  classNames?: Partial<ClassNames>;
  styles?: Partial<InlineStyles>;
  resolve?: (value: boolean | void) => void;
}

export interface OkCancelContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  alert: (options: AlertOptions) => Promise<void>;
}

export interface OkCancelProviderProps {
  children: ReactNode;
  theme?: Partial<Theme>;
}
