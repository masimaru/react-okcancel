import { createContext } from 'react';
import type { PopManager } from './types';

export const PopContext = createContext<PopManager | null>(null);
