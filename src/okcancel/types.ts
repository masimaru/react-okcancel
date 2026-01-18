import type { ReactNode, ComponentType } from 'react';

export interface ConfirmDialogProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Default: '확인' */
  confirmText?: ReactNode;
  /** Default: '취소' */
  cancelText?: ReactNode;

  /** Default: true */
  canCloseOnOverlay?: boolean;
  /** Default: true */
  canCloseOnEsc?: boolean;
  /** Default: false */
  showCloseButton?: boolean;
  /** Default: true */
  enableAnimation?: boolean;

  onConfirm: () => void;
  onCancel: () => void;
}

export interface AlertDialogProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Default: '확인' */
  confirmText?: ReactNode;

  /** Default: true */
  canCloseOnOverlay?: boolean;
  /** Default: true */
  canCloseOnEsc?: boolean;
  /** Default: false */
  showCloseButton?: boolean;
  /** Default: true */
  enableAnimation?: boolean;

  onConfirm: () => void;
}

export type ConfirmOptions = Omit<ConfirmDialogProps, 'onConfirm' | 'onCancel'>;
export type AlertOptions = Omit<AlertDialogProps, 'onConfirm'>;

export type ComponentOrVariants<TProps> =
  | ComponentType<TProps>
  | {
      default: ComponentType<TProps>;
      [variant: string]: ComponentType<TProps>;
    };

export interface OkCancelComponents {
  confirm: ComponentOrVariants<ConfirmDialogProps>;
  alert: ComponentOrVariants<AlertDialogProps>;
}

export type NormalizedComponents = {
  confirm: {
    default: ComponentType<ConfirmDialogProps>;
    [k: string]: ComponentType<ConfirmDialogProps>;
  };
  alert: { default: ComponentType<AlertDialogProps>; [k: string]: ComponentType<AlertDialogProps> };
};

export type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;
export type AlertFn = (options?: AlertOptions) => Promise<void>;
