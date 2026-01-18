/**
 * shadcn/ui 기반 프리셋
 * OkCancelProvider에 바로 전달하여 사용
 */

import { ConfirmDialog } from './confirm-dialog';
import { SimpleAlertDialog } from './simple-alert-dialog';

export const shadcnPreset = {
  confirm: ConfirmDialog,
  alert: SimpleAlertDialog,
};

export { ConfirmDialog } from './confirm-dialog';
export { SimpleAlertDialog } from './simple-alert-dialog';
