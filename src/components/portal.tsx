import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

export default function Portal({ children }: PortalProps) {
  return createPortal(children, document.getElementById('okcancel-portal-root') as HTMLElement);
}
