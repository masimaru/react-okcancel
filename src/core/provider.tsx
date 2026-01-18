import { useState } from 'react';
import type { ReactNode } from 'react';
import { PopContext } from './context';
import { createPopManager } from './store';
import { usePopState } from './hooks';

interface PopProviderProps {
  children: ReactNode;
}

const PopRenderer = () => {
  const instances = usePopState();

  if (instances.length === 0) return null;

  return (
    <>
      {instances.map((instance) => {
        const Component = instance.component;
        return <Component key={instance.id} {...(instance.props as Record<string, unknown>)} />;
      })}
    </>
  );
};

export const PopProvider = ({ children }: PopProviderProps) => {
  const [manager] = useState(() => createPopManager());

  return (
    <PopContext.Provider value={manager}>
      {children}
      <PopRenderer />
    </PopContext.Provider>
  );
};
