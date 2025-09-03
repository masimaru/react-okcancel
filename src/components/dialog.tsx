import { useEffect, useRef } from 'react';
import type { DialogState, Theme } from '@/types';
import Portal from './portal';
import styles from './dialog.module.scss';

interface DialogProps extends DialogState {
  theme: Theme;
  onClose: (isConfirmed: boolean) => void;
}

export default function Dialog({
  type,
  title,
  description,
  confirmText,
  cancelText,
  canCloseOnOverlay,
  classNames = {},
  styles: inlineStyles = {},
  theme,
  onClose,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
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

  // Combine CSS Module classes with theme classes
  const getClassName = (baseClass: keyof typeof styles, themeKey: keyof Theme['classNames']) => {
    return [styles[baseClass], theme.classNames[themeKey], classNames[themeKey]]
      .filter(Boolean)
      .join(' ');
  };

  const dialogClassName = [styles.dialog, theme.classNames.dialog, classNames.dialog]
    .filter(Boolean)
    .join(' ');

  return (
    <Portal>
      <div
        className={getClassName('overlay', 'overlay')}
        style={{ ...theme.styles.overlay, ...inlineStyles.overlay }}
        onClick={handleOverlayClick}
        data-testid="okcancel-overlay"
      >
        <div
          ref={dialogRef}
          className={dialogClassName}
          style={{ ...theme.styles.dialog, ...inlineStyles.dialog }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'okcancel-title' : undefined}
          aria-describedby={description ? 'okcancel-description' : undefined}
          data-testid="okcancel-dialog"
        >
          {(title || description) && (
            <div
              className={getClassName('header', 'header')}
              style={{ ...theme.styles.header, ...inlineStyles.header }}
            >
              {title && (
                <h2
                  id="okcancel-title"
                  className={getClassName('title', 'title')}
                  style={{ ...theme.styles.title, ...inlineStyles.title }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <div
                  id="okcancel-description"
                  className={getClassName('description', 'description')}
                  style={{ ...theme.styles.description, ...inlineStyles.description }}
                >
                  {description}
                </div>
              )}
            </div>
          )}

          <div
            className={getClassName('footer', 'footer')}
            style={{ ...theme.styles.footer, ...inlineStyles.footer }}
          >
            {type === 'confirm' && (
              <button
                type="button"
                className={[
                  getClassName('button', 'button'),
                  styles['button-secondary'],
                  theme.classNames.buttonSecondary,
                  classNames.buttonSecondary,
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  ...theme.styles.buttonSecondary,
                  ...inlineStyles.buttonSecondary,
                }}
                onClick={handleCancel}
                data-testid="okcancel-cancel-button"
              >
                {cancelText}
              </button>
            )}
            <button
              ref={confirmButtonRef}
              type="button"
              className={[
                getClassName('button', 'button'),
                styles['button-primary'],
                theme.classNames.buttonPrimary,
                classNames.buttonPrimary,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                ...theme.styles.buttonPrimary,
                ...inlineStyles.buttonPrimary,
              }}
              onClick={handleConfirm}
              data-testid="okcancel-confirm-button"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
