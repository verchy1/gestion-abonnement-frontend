import { Plus, DollarSign, Trash2, Users, Mail, TrendingUp, AlertTriangle } from 'lucide-react';
import type { Abonnement } from '../types';
import { SkeletonAbonnementCards } from './Skeleton';

const AbonnementsContent = ({ abonnements, setShowModal, supprimerItem, loading, isLoadingData }: { abonnements: Abonnement[]; setShowModal: (value: string | null) => void; supprimerItem: (type: string, id: string) => Promise<void>; loading: boolean; isLoadingData: boolean }) => {
  if (isLoadingData) {
    return <SkeletonAbonnementCards />;
  }

  // Calculer les statistiques
  const totalSlots = abonnements.reduce((acc, abo) => acc + abo.slots, 0);
  const totalUtilises = abonnements.reduce((acc, abo) => acc + abo.utilises, 0);
  const revenuTotal = abonnements.reduce((acc, abo) => acc + abo.prix, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Abonnements</h2>
            <p className="text-gray-600">Administrez vos services et suivez leur utilisation en temps réel</p>
          </div>
          
          <button 
            onClick={() => setShowModal('abonnement')} 
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Créer un abonnement</span>
          </button>
        </div>

        {/* Stats compactes */}
        {abonnements.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Revenus totaux</p>
                <p className="text-lg font-bold text-gray-900">{revenuTotal.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Places totales</p>
                <p className="text-lg font-bold text-gray-900">{totalUtilises}/{totalSlots}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Taux global</p>
                <p className="text-lg font-bold text-gray-900">{Math.round((totalUtilises / totalSlots) * 100)}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {abonnements.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <DollarSign className="text-gray-400" size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun abonnement</h3>
            <p className="text-gray-500 mb-6">Commencez par créer votre premier service d'abonnement</p>
            <button 
              onClick={() => setShowModal('abonnement')}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-semibold"
            >
              <Plus size={20} />
              <span>Créer un abonnement</span>
            </button>
          </div>
        </div>
      ) : (
        /* Grille des abonnements */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {abonnements.map(abo => {
            const occupationRate = (abo.utilises / abo.slots) * 100;
            const isAlmostFull = occupationRate >= 80;
            const isFull = abo.utilises >= abo.slots;

            return (
              <div 
                key={abo._id} 
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
              >
                {/* Header avec gradient subtil */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3 ">
                    <div className="flex-1 ">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{abo.service}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users size={14} />
                        <span className="font-medium">{abo.proprio}</span>
                      </div>
                    </div>
                    {(isAlmostFull || isFull) && (
                      <div className={`p-1.5 rounded-lg ${isFull ? 'bg-red-100' : 'bg-yellow-100'}`}>
                        <AlertTriangle className={isFull ? 'text-red-600' : 'text-yellow-600'} size={18} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Mail size={14} />
                    <span className="truncate">{abo.emailService}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Prix */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-gray-600">Prix mensuel</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">{abo.prix.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-1">FCFA</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100"></div>

                  {/* Occupation */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Occupation</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${
                          isFull ? 'text-red-600' : isAlmostFull ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {abo.utilises}/{abo.slots}
                        </span>
                        <span className="text-sm text-gray-500">({Math.round(occupationRate)}%)</span>
                      </div>
                    </div>
                    
                    {/* Progress bar professionnelle */}
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                          isFull 
                            ? 'bg-gradient-to-r from-red-500 to-red-600' 
                            : isAlmostFull 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        style={{ width: `${occupationRate}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="pt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      isFull 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : isAlmostFull 
                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {isFull ? 'Complet' : isAlmostFull ? 'Presque complet' : 'Places disponibles'}
                    </span>
                  </div>
                </div>

                {/* Footer avec action */}
                <div className="px-5 pb-5">
                  <button 
                    onClick={() => supprimerItem('abonnement', abo._id)} 
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-red-600 bg-gray-50 hover:bg-red-50 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-gray-200 hover:border-red-200"
                  >
                    <Trash2 size={18} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AbonnementsContent;