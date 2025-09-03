import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getPortalRoot } from '@/utils/portal';

interface PortalProps {
  children: ReactNode;
}

export default function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, getPortalRoot());
}
