import React, { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: keyof typeof sizeClasses;
  footerContent?: React.ReactNode;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footerContent,
}: ModalProps) {
  const overlayRef = useRef(null);

  /* Lock body scroll while open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ESC to close */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* Click outside to close */
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 23, 42, 0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Panel */}
      <div
        className={`
          relative w-full ${sizeClasses[size] || sizeClasses.md}
          bg-white rounded-2xl shadow-2xl
          flex flex-col max-h-[90vh]
          animate-modal-in
        `}
        style={{
          animation: 'modalIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2
            id="modal-title"
            className="text-lg font-bold text-slate-800 leading-tight"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
          {children}
        </div>

        {/* ── Footer (optional) ── */}
        {footerContent && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl shrink-0">
            {footerContent}
          </div>
        )}
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}
