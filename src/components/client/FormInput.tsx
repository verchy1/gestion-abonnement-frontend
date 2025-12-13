import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  required?: boolean;
}

export const FormInput = ({ 
  label, 
  icon: Icon, 
  required = false, 
  ...props 
}: FormInputProps) => (
  <div>
    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" size={18} />
      <input 
        {...props}
        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 text-sm sm:text-base"
      />
    </div>
  </div>
);