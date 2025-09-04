import { useEffect, useRef } from 'react';
import type { DialogState } from '@/types';
import Portal from './portal';
import styles from './dialog.module.scss';

interface DialogProps extends DialogState {
  onClose: (isConfirmed: boolean) => void;
}

export default function Dialog({
  type,
  title,
  description,
  confirmText,
  cancelText,
  canCloseOnOverlay,
  onClose,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, []);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && canCloseOnOverlay) {
      onClose(false);
    }
  };

  const handleConfirm = () => {
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <Portal>
      <div className={styles.overlay} onClick={handleOverlayClick} data-testid="okcancel-overlay">
        <dialog
          ref={dialogRef}
          className={styles.dialog}
          aria-labelledby={title ? 'okcancel-title' : undefined}
          aria-describedby={description ? 'okcancel-description' : undefined}
          data-testid="okcancel-dialog"
          open
        >
          <div className={styles.content}>
            {title && (
              <div id="okcancel-title" className={styles.title}>
                {title}
              </div>
            )}

            {description && (
              <div id="okcancel-description" className={styles.description}>
                {description}
              </div>
            )}
          </div>

          <div className={styles['btn-box']}>
            {type === 'confirm' && (
              <button
                type="button"
                className={styles['button-secondary']}
                onClick={handleCancel}
                data-testid="okcancel-cancel-button"
              >
                {cancelText}
              </button>
            )}
            <button
              ref={confirmButtonRef}
              type="button"
              className={styles['button-primary']}
              onClick={handleConfirm}
              data-testid="okcancel-confirm-button"
            >
              {confirmText}
            </button>
          </div>
        </dialog>
      </div>
    </Portal>
  );
}
