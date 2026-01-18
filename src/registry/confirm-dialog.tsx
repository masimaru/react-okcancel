/**
 * ConfirmDialog - shadcn AlertDialog 기반 Confirm 컴포넌트
 * useOkCancel hook과 연동하여 Promise 기반으로 사용
 */

import { useState, useCallback } from 'react';
import type { ConfirmDialogProps } from '@/okcancel/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export function ConfirmDialog({
  title = '확인',
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(true);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    setTimeout(onConfirm, 200);
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    setTimeout(onCancel, 200);
  }, [onCancel]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
