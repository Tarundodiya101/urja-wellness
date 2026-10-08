import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface CustomSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value?: string | number | readonly string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string; name?: string } }) => void;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ children, value, onChange, className, icon, wrapperClassName, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options = React.Children.toArray(children).filter(React.isValidElement).map((child: any) => ({
    value: child.props.value,
    label: child.props.children
  }));

  const selectedOption = options.find(opt => String(opt.value) === String(value)) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (onChange) {
      // Simulate an event object for compatibility with standard onChange handlers
      onChange({ target: { value: val, name: props.name } } as any);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${wrapperClassName || ''}`} ref={ref}>
      <button
        type="button"
        onClick={() => !props.disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-gray-50 transition-colors ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
        title={props.title}
        disabled={props.disabled}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-gray-500 flex-shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption?.label || 'Select...'}</span>
        </div>
        <FiChevronDown className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full min-w-[120px] mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(opt.value)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${String(value) === String(opt.value) ? 'bg-emerald-100 text-emerald-900 font-medium' : 'text-gray-700'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};