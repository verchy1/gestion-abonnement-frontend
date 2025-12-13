import { Users, Check } from 'lucide-react';
import type { Abonnement } from '../../types';
import { SERVICE_AVANTAGES, SERVICE_LOGOS } from '../../components/client/services';

interface ServiceCardProps {
  abonnement: Abonnement;
  onSelect: (abo: Abonnement) => void;
}

export const ServiceCard = ({ abonnement, onSelect }: ServiceCardProps) => {
  const places = abonnement.slots - abonnement.utilises;
  const isAvailable = places > 0;
  const pourcentage = Math.round((abonnement.utilises / abonnement.slots) * 100);
  const avantages = SERVICE_AVANTAGES[abonnement.service] || [
    'Accès complet au service', 
    'Support client 24/7', 
    'Qualité premium', 
    'Sans engagement'
  ];

  return (
    <div className={`group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 ${isAvailable ? 'hover:-translate-y-1' : 'opacity-75'}`}>
      <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white opacity-10 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20"></div>
        <div className="relative">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl p-1.5 sm:p-2 shadow-lg flex items-center justify-center">
                <img
                  src={SERVICE_LOGOS[abonnement.service] || 'https://via.placeholder.com/40'}
                  alt={abonnement.service}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.innerHTML = `<div class="text-indigo-600 font-bold text-lg sm:text-xl">${abonnement.service[0]}</div>`;
                  }}
                />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold">{abonnement.service}</h3>
            </div>
            {isAvailable && <span className="bg-emerald-400 text-emerald-900 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full">DISPO</span>}
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-4xl font-bold">{abonnement.prix.toLocaleString()}</span>
            <span className="text-indigo-200 text-xs sm:text-sm">FCFA</span>
          </div>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1">par mois</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Disponibilité</span>
            <span className="text-[10px] sm:text-xs font-bold text-gray-500">{pourcentage}% occupé</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-2 sm:mb-3">
            <div
              className={`h-2 sm:h-2.5 rounded-full transition-all ${
                pourcentage >= 80 ? 'bg-linear-to-r from-red-500 to-red-600' :
                pourcentage >= 60 ? 'bg-linear-to-r from-yellow-400 to-yellow-500' :
                'bg-linear-to-r from-emerald-500 to-emerald-600'
              }`}
              style={{ width: `${pourcentage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Users className="text-indigo-600" size={16} />
              <span className="text-xs sm:text-sm text-gray-600">Places</span>
            </div>
            <span className={`text-sm sm:text-base font-bold ${places > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {places} / {abonnement.slots}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
          {avantages.map((avantage, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Check size={14} className="text-emerald-500 shrink-0 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{avantage}</span>
            </div>
          ))}
        </div>

        {!isAvailable ? (
          <button disabled className="w-full bg-gray-200 text-gray-500 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold cursor-not-allowed">
            Complet
          </button>
        ) : (
          <button 
            onClick={() => onSelect(abonnement)} 
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg group-hover:scale-105"
          >
            Souscrire maintenant
          </button>
        )}
      </div>
    </div>
  );
};