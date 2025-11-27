import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition duration-200">
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Modal;
