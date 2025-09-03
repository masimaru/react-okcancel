import { createContext } from 'react';
import type { OkCancelContextValue } from './types';

export const OkCancelContext = createContext<OkCancelContextValue | null>(null);
