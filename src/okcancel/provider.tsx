import React, { useState, useMemo } from 'react';
import { createPopManager, PopContext, usePopState } from '../core';
import { Portal } from '../core/portal';
import { OkCancelContext } from './context';
import type {
  OkCancelComponents,
  NormalizedComponents,
  ConfirmDialogProps,
  AlertDialogProps,
} from './types';

function normalizeComponents(components: OkCancelComponents): NormalizedComponents {
  return {
    confirm:
      typeof components.confirm === 'function' ||
      'displayName' in components.confirm ||
      'render' in components.confirm
        ? { default: components.confirm as React.ComponentType<ConfirmDialogProps> }
        : (components.confirm as {
            default: React.ComponentType<ConfirmDialogProps>;
            [k: string]: React.ComponentType<ConfirmDialogProps>;
          }),
    alert:
      typeof components.alert === 'function' ||
      'displayName' in components.alert ||
      'render' in components.alert
        ? { default: components.alert as React.ComponentType<AlertDialogProps> }
        : (components.alert as {
            default: React.ComponentType<AlertDialogProps>;
            [k: string]: React.ComponentType<AlertDialogProps>;
          }),
  };
}

const OkCancelRenderer = () => {
  const instances = usePopState();

  if (instances.length === 0) return null;

  return (
    <Portal>
      {instances.map((instance) => {
        const Component = instance.component;
        // props에 이미 onConfirm/onCancel이 주입되어 있음 (hooks.ts에서)
        return <Component key={instance.id} {...(instance.props as Record<string, unknown>)} />;
      })}
    </Portal>
  );
};

export interface OkCancelProviderProps {
  children: React.ReactNode;
  components: OkCancelComponents;
}

export const OkCancelProvider = ({ children, components }: OkCancelProviderProps) => {
  const [manager] = useState(() => createPopManager());

  const normalized = useMemo(() => normalizeComponents(components), [components]);

  return (
    <PopContext.Provider value={manager}>
      <OkCancelContext.Provider value={{ components: normalized }}>
        {children}
        <OkCancelRenderer />
      </OkCancelContext.Provider>
    </PopContext.Provider>
  );
};
