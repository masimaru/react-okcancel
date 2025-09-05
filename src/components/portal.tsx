import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
}

export default function Portal({ children }: PortalProps) {
  let portalRoot = document.getElementById('okcancel-portal-root');

  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'okcancel-portal-root';
    document.body.appendChild(portalRoot);
  }

  return createPortal(children, portalRoot);
}
