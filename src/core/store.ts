import type { PopManager, PopInstance, PopId } from './types';

const generateId = (): string => Math.random().toString(36).substring(2, 9);

export class DefaultPopManager implements PopManager {
  private _instances: PopInstance[] = [];
  private _listeners: Set<() => void> = new Set();

  push<TProps, TResult>(
    component: React.ComponentType<TProps>,
    props?: TProps,
    options?: { id?: string },
  ): Promise<TResult> {
    return new Promise((resolve, reject) => {
      const id = options?.id || generateId();

      const instance: PopInstance<unknown, unknown> = {
        id,
        component: component as React.ComponentType<unknown>,
        props: props || ({} as TProps),
        resolve: (value) => {
          this.removeInstance(id);
          resolve(value as TResult);
        },
        reject: (reason) => {
          this.removeInstance(id);
          reject(reason);
        },
        createdAt: Date.now(),
      };

      this._instances = [...this._instances, instance];
      this.notify();
    });
  }

  pop(id?: PopId): void {
    if (this._instances.length === 0) return;

    if (id) {
      this.reject(id, new Error('Popup closed explicitly'));
    } else {
      const lastInstance = this._instances[this._instances.length - 1];
      this.reject(lastInstance.id, new Error('Popup closed explicitly'));
    }
  }

  resolve<TResult>(id: PopId, result: TResult): void {
    const instance = this._instances.find((i) => i.id === id);
    if (instance) {
      instance.resolve(result);
    }
  }

  reject(id: PopId, reason?: unknown): void {
    const instance = this._instances.find((i) => i.id === id);
    if (instance) {
      instance.reject(reason);
    }
  }

  getInstances(): PopInstance[] {
    return this._instances;
  }

  getSnapshot(): PopInstance[] {
    return this._instances;
  }

  subscribe(callback: () => void): () => void {
    this._listeners.add(callback);
    return () => {
      this._listeners.delete(callback);
    };
  }

  private removeInstance(id: PopId): void {
    this._instances = this._instances.filter((i) => i.id !== id);
    this.notify();
  }

  private notify(): void {
    this._listeners.forEach((listener) => listener());
  }
}

export const createPopManager = (): PopManager => new DefaultPopManager();
