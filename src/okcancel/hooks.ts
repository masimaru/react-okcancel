import { useContext, useMemo, useRef } from 'react';
import type { ComponentType } from 'react';
import { usePop } from '../core';
import { OkCancelContext } from './context';
import type {
  OkCancelComponents,
  ConfirmOptions,
  AlertOptions,
  ConfirmFn,
  AlertFn,
  ConfirmDialogProps,
  AlertDialogProps,
} from './types';

export function useOkCancel<T extends OkCancelComponents>() {
  const manager = usePop();
  const context = useContext(OkCancelContext);
  const idCounterRef = useRef(0);

  if (!context) {
    throw new Error('useOkCancel must be used within an OkCancelProvider');
  }

  const { components } = context;

  return useMemo(() => {
    const generateId = () => `okcancel-${++idCounterRef.current}-${Date.now()}`;

    const confirmBase =
      (variant: string) =>
      (options: ConfirmOptions = {}): Promise<boolean> => {
        const Component = components.confirm[variant] || components.confirm.default;

        if (!Component && process.env.NODE_ENV === 'development') {
          console.warn(`[@pop-kit/okcancel] Unknown confirm variant: "${variant}". Using default.`);
        }

        const id = generateId();

        // manager.push가 반환하는 Promise를 직접 사용
        // 컴포넌트는 onConfirm/onCancel 호출 시 manager.resolve를 통해 이 Promise를 resolve
        const resultPromise = manager.push<ConfirmDialogProps, boolean>(
          (Component || components.confirm.default) as ComponentType<ConfirmDialogProps>,
          {
            ...options,
            onConfirm: () => manager.resolve(id, true),
            onCancel: () => manager.resolve(id, false),
          } as ConfirmDialogProps,
          { id },
        );

        return resultPromise;
      };

    const confirmFn = confirmBase('default') as ConfirmFn & {
      [K in keyof T['confirm']]: ConfirmFn;
    };

    Object.keys(components.confirm).forEach((key) => {
      if (key !== 'default') {
        (confirmFn as Record<string, ConfirmFn>)[key] = confirmBase(key);
      }
    });

    const alertBase =
      (variant: string) =>
      (options: AlertOptions = {}): Promise<void> => {
        const Component = components.alert[variant] || components.alert.default;

        if (!Component && process.env.NODE_ENV === 'development') {
          console.warn(`[@pop-kit/okcancel] Unknown alert variant: "${variant}". Using default.`);
        }

        const id = generateId();

        const resultPromise = manager.push<AlertDialogProps, void>(
          (Component || components.alert.default) as ComponentType<AlertDialogProps>,
          {
            ...options,
            onConfirm: () => {
              manager.resolve(id, undefined);
            },
          } as AlertDialogProps,
          { id },
        );

        return resultPromise;
      };

    const alertFn = alertBase('default') as AlertFn & { [K in keyof T['alert']]: AlertFn };

    Object.keys(components.alert).forEach((key) => {
      if (key !== 'default') {
        (alertFn as Record<string, AlertFn>)[key] = alertBase(key);
      }
    });

    return {
      confirm: confirmFn,
      alert: alertFn,
    };
  }, [manager, components]);
}
