import React from 'react';

/**
 * Status → { bg, text, dot } color mapping.
 * Covers all domain-specific statuses used across URJA.
 */
const STATUS_STYLES = {
  // Membership
  Active:          'bg-green-100  text-green-700  border border-green-200',
  Expired:         'bg-red-100    text-red-700    border border-red-200',
  Inactive:        'bg-slate-100  text-slate-500  border border-slate-200',
  Suspended:       'bg-orange-100 text-orange-700 border border-orange-200',
  Pending:         'bg-yellow-100 text-yellow-700 border border-yellow-200',

  // Billing / Payment
  Paid:            'bg-green-100  text-green-700  border border-green-200',
  'Part Paid':     'bg-blue-100   text-blue-700   border border-blue-200',
  Unpaid:          'bg-red-100    text-red-700    border border-red-200',
  Overdue:         'bg-rose-100   text-rose-700   border border-rose-200',
  Refunded:        'bg-purple-100 text-purple-700 border border-purple-200',
  Cancelled:       'bg-slate-100  text-slate-500  border border-slate-200',
  Draft:           'bg-yellow-50  text-yellow-600 border border-yellow-200',

  // Inventory
  'Out of Stock':  'bg-red-100    text-red-700    border border-red-200',
  'Low Stock':     'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Good:            'bg-green-100  text-green-700  border border-green-200',

  // Attendance
  Present:         'bg-green-100  text-green-700  border border-green-200',
  Absent:          'bg-red-100    text-red-700    border border-red-200',
  Leave:           'bg-blue-100   text-blue-700   border border-blue-200',
  Holiday:         'bg-purple-100 text-purple-700 border border-purple-200',

  // CRM / Lead
  'New Lead':      'bg-cyan-100   text-cyan-700   border border-cyan-200',
  'In Progress':   'bg-blue-100   text-blue-700   border border-blue-200',
  Converted:       'bg-green-100  text-green-700  border border-green-200',
  Lost:            'bg-red-100    text-red-600    border border-red-200',
  'Follow Up':     'bg-indigo-100 text-indigo-700 border border-indigo-200',
  'Hot Lead':      'bg-orange-100 text-orange-700 border border-orange-200',
  'Cold Lead':     'bg-slate-100  text-slate-600  border border-slate-200',

  // Generic
  Success:         'bg-green-100  text-green-700  border border-green-200',
  Error:           'bg-red-100    text-red-700    border border-red-200',
  Warning:         'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Info:            'bg-blue-100   text-blue-700   border border-blue-200',
};

const DOT_COLORS = {
  Active: 'bg-green-500', Paid: 'bg-green-500', Present: 'bg-green-500', Good: 'bg-green-500',
  Expired: 'bg-red-500',  Unpaid: 'bg-red-500',  Absent: 'bg-red-500', 'Out of Stock': 'bg-red-500',
  Pending: 'bg-yellow-400', 'Low Stock': 'bg-yellow-400', Warning: 'bg-yellow-400',
  'Part Paid': 'bg-blue-500', Leave: 'bg-blue-500', 'In Progress': 'bg-blue-500',
};

const SIZE_CLASSES = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs    px-2.5 py-1 gap-1.5',
};

/**
 * Badge
 * @param {string} status   - The status text to display
 * @param {'sm'|'md'} size  - Badge size
 * @param {boolean} dot     - Show a status dot
 */
export default function Badge({ status = '', size = 'md', dot = true }) {
  const styleClass = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border border-slate-200';
  const dotColor   = DOT_COLORS[status]   || 'bg-slate-400';
  const sizeClass  = SIZE_CLASSES[size]   || SIZE_CLASSES.md;

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full whitespace-nowrap
        ${styleClass} ${sizeClass}
      `}
    >
      {dot && (
        <span className={`inline-block rounded-full ${dotColor} ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      )}
      {status}
    </span>
  );
}
