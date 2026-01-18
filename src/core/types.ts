import type { ComponentType } from 'react';

/**
 * Unique identifier for each popup instance
 */
export type PopId = string;

/**
 * Base options for creating a popup
 */
export interface PopOptions<TProps = Record<string, unknown>> {
  /** Unique ID (auto-generated if not provided) */
  id?: PopId;
  /** Component to render */
  component: ComponentType<TProps>;
  /** Props to pass to the component */
  props?: TProps;
}

/**
 * Internal instance structure stored in the manager
 */
export interface PopInstance<TProps = unknown, TResult = unknown> {
  id: PopId;
  component: ComponentType<TProps>;
  props: TProps;
  resolve: (result: TResult) => void;
  reject: (reason?: unknown) => void;
  createdAt: number;
}

/**
 * Core Logic Manager Interface
 */
export interface PopManager {
  /**
   * Push a new popup to the stack
   * @returns A promise that resolves when the popup is closed/resolved
   */
  push<TProps, TResult>(
    component: ComponentType<TProps>,
    props?: TProps,
    options?: { id?: string },
  ): Promise<TResult>;

  /**
   * Remove a specific popup or the top one
   */
  pop(id?: PopId): void;

  /**
   * Resolve a popup with a value (success)
   */
  resolve<TResult>(id: PopId, result: TResult): void;

  /**
   * Reject a popup with a reason (failure/cancel)
   */
  reject(id: PopId, reason?: unknown): void;

  /**
   * Current stack of instances
   */
  getInstances(): PopInstance[];

  /**
   * Get current snapshot of instances
   */
  getSnapshot(): PopInstance[];

  /**
   * Subscribe to changes (Observer pattern)
   */
  subscribe(callback: () => void): () => void;
}
