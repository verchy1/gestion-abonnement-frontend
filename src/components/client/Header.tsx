import { ShoppingCart, User } from 'lucide-react';

interface HeaderProps {
  onSwitchToAdmin: () => void;
}

export const Header = ({ onSwitchToAdmin }: HeaderProps) => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-linear-to-br from-indigo-400 to-purple-300 p-2 sm:p-2.5 rounded-xl shadow-lg">
            <ShoppingCart size={20} className="sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              OVFA Stream
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium hidden sm:block">
              Votre plateforme d'abonnements
            </p>
          </div>
        </div>
        <button 
          onClick={onSwitchToAdmin} 
          className="flex items-center justify-center space-x-1 sm:space-x-2 bg-indigo-600 hover:bg-indigo-700 px-3 sm:px-4 py-2 rounded-full text-white text-xs sm:text-sm font-semibold transition-all"
        >
          <User size={14} className="sm:w-4 sm:h-4" />
          <span className='hidden sm:inline'>Espace Admin</span>
          <span className='sm:hidden'>Admin</span>
        </button>
      </div>
    </div>
  </header>
);