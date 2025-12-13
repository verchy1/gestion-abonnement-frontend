import { AlertCircle } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'warning' | 'info';
  message: string;
}

export const Alert = ({ type = 'error', message }: AlertProps) => {
  const colors = {
    error: 'bg-red-50 border-red-500 text-red-700',
    warning: 'bg-amber-50 border-amber-400 text-amber-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800'
  };

  return (
    <div className={`${colors[type]} border-l-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 flex items-center text-sm`}>
      <AlertCircle size={18} className="mr-2 shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
};