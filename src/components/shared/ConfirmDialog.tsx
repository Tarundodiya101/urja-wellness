import React from 'react';
import Modal from './Modal';
import { Button } from '../ui/fields';
import { FiAlertTriangle } from 'react-icons/fi';

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footerContent={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>{cancelText}</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }}>{confirmText}</Button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-full shrink-0">
          <FiAlertTriangle size={24} />
        </div>
        <div className="pt-1">
          <p className="text-gray-700 text-sm">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
