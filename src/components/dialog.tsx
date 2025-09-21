import { useCallback, useEffect, useState } from 'react';
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
  showCloseButton,
  enableAnimation,
  onClose,
}: DialogProps) {
  const [phase, setPhase] = useState<Phase>('enter');
  const [pendingResult, setPendingResult] = useState<boolean | null>(null); // return 값

  const startExit = useCallback(
    (result: boolean) => {
      if (!enableAnimation) {
        onClose(result);
        return;
      }

      setPendingResult(result);
      setPhase('exit');
    },
    [enableAnimation, onClose],
  );

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && canCloseOnOverlay) {
      startExit(false);
    }
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (!enableAnimation) return;
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
  }, [canCloseOnEsc, startExit]);

  return (
    <Portal>
      <div className={styles.overlay} data-phase={phase} onClick={handleOverlayClick}>
        <dialog
          className={styles.dialog}
          data-phase={phase}
          data-animation={enableAnimation ?? true}
          aria-labelledby={title ? 'okcancel-title' : undefined}
          aria-describedby={description ? 'okcancel-description' : undefined}
          onAnimationEnd={handleAnimationEnd}
          open
        >
          {showCloseButton && (
            <button
              type="button"
              className={styles['close-button']}
              onClick={() => startExit(false)}
              aria-label="닫기"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3L3 9M3 3L9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
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
