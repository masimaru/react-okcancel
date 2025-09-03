import { useEffect, useState } from 'react';
import type { Toast as ToastType, Theme } from '../../types';
import styles from './toast.module.scss';

interface ToastItemProps {
  toast: ToastType;
  theme: Theme;
  onRemove: (id: number) => void;
}

export const ToastItem = ({ toast, theme, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 150);
  };

  const toastClassName = [
    styles.toast,
    styles[toast.kind],
    isVisible ? styles.visible : styles.hidden,
    theme.classNames.toast,
    toast.classNames?.toast,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={toastClassName}
      style={{ ...theme.styles.toast, ...toast.styles?.toast }}
      role="status"
      aria-live="polite"
      data-testid={`okcancel-toast-${toast.id}`}
    >
      <div className={styles.content}>
        {toast.title && <div className={styles.title}>{toast.title}</div>}
        {toast.description && <div className={styles.description}>{toast.description}</div>}
      </div>
      <button
        type="button"
        className={styles['close-button']}
        onClick={handleClose}
        aria-label="닫기"
        data-testid={`okcancel-toast-close-${toast.id}`}
      >
        ×
      </button>
    </div>
  );
};
