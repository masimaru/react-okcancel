import { useEffect, useState } from 'react';
import type { DialogState } from '@/types';
import Portal from './portal';
import styles from './dialog.module.scss';

interface DialogProps extends DialogState {
  onClose: (isConfirmed: boolean) => void;
}

type Phase = 'enter' | 'exit';

export default function Dialog({
  type,
  title,
  description,
  confirmText,
  cancelText,
  canCloseOnOverlay,
  canCloseOnEsc,
  onClose,
}: DialogProps) {
  const [phase, setPhase] = useState<Phase>('enter');
  const [pendingResult, setPendingResult] = useState<boolean | null>(null); // return 값

  const startExit = (result: boolean) => {
    setPendingResult(result);
    setPhase('exit');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && canCloseOnOverlay) {
      startExit(false);
    }
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget) return; // 버블링 방지
    if (phase === 'exit' && pendingResult !== null) {
      onClose(pendingResult);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && canCloseOnEsc) {
        event.preventDefault();
        startExit(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canCloseOnEsc]);

  return (
    <Portal>
      <div className={styles.overlay} data-phase={phase} onClick={handleOverlayClick}>
        <dialog
          className={styles.dialog}
          data-phase={phase}
          aria-labelledby={title ? 'okcancel-title' : undefined}
          aria-describedby={description ? 'okcancel-description' : undefined}
          onAnimationEnd={handleAnimationEnd}
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
                onClick={() => startExit(false)}
              >
                {cancelText}
              </button>
            )}
            <button
              type="button"
              className={styles['button-primary']}
              onClick={() => startExit(true)}
              autoFocus
            >
              {confirmText}
            </button>
          </div>
        </dialog>
      </div>
    </Portal>
  );
}
