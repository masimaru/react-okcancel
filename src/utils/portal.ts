let portalRoot: HTMLElement | null = null;

export const getPortalRoot = (): HTMLElement => {
  if (!portalRoot) {
    portalRoot = document.getElementById('okcancel-portal-root');
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = 'okcancel-portal-root';
      document.body.appendChild(portalRoot);
    }
  }
  return portalRoot;
};

export const cleanupPortal = (): void => {
  if (portalRoot && portalRoot.parentNode) {
    portalRoot.parentNode.removeChild(portalRoot);
    portalRoot = null;
  }
};
