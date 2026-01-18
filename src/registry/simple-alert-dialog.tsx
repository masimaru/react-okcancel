/**
 * SimpleAlertDialog - shadcn AlertDialog 기반 Alert 컴포넌트
 * useOkCancel hook과 연동하여 Promise 기반으로 사용
 */

import { useState, useCallback } from 'react';
import type { AlertDialogProps } from '@/okcancel/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export function SimpleAlertDialog({
  title = '알림',
  description,
  confirmText = '확인',
  onConfirm,
}: AlertDialogProps) {
  const [open, setOpen] = useState(true);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    setTimeout(onConfirm, 200);
  }, [onConfirm]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
