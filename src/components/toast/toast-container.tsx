import type { Toast, Theme } from '../../types';
import { Portal } from '../portal/portal';
import { ToastItem } from './toast';
import styles from './toast.module.scss';

interface ToastContainerProps {
  toasts: Toast[];
  theme: Theme;
  onRemove: (id: number) => void;
}

export const ToastContainer = ({ toasts, theme, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) {
    return null;
  }

  const containerClassName = [styles.container, theme.classNames.toastContainer]
    .filter(Boolean)
    .join(' ');

  return (
    <Portal>
      <div
        className={containerClassName}
        style={{ ...theme.styles.toastContainer }}
        data-testid="okcancel-toast-container"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} theme={theme} onRemove={onRemove} />
        ))}
      </div>
    </Portal>
  );
};
