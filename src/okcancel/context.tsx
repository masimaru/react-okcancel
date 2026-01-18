import { createContext } from 'react';
import type { NormalizedComponents } from './types';

export interface OkCancelContextValue {
  components: NormalizedComponents;
}

export const OkCancelContext = createContext<OkCancelContextValue | null>(null);
