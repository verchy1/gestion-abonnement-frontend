import { Plus, DollarSign, Trash2 } from 'lucide-react';
import type { Abonnement } from '../types';
import { SkeletonAbonnementCards } from './Skeleton';

const AbonnementsContent = ({ abonnements, setShowModal, supprimerItem, loading, isLoadingData }: { abonnements: Abonnement[]; setShowModal: (value: string | null) => void; supprimerItem: (type: string, id: string) => Promise<void>; loading: boolean; isLoadingData: boolean }) => {
  if (isLoadingData) {
    return <SkeletonAbonnementCards />;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Abonnements</h2>
          <p className="text-gray-500 mt-1">Gérez vos services d'abonnement</p>
        </div>
        <button onClick={() => setShowModal('abonnement')} className="flex items-center space-x-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg">
          <Plus size={20} />
          <span>Nouveau</span>
        </button>
      </div>

      {abonnements.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <DollarSign className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Aucun abonnement pour le moment</p>
          <p className="text-gray-400 text-sm mt-2">Cliquez sur "Nouveau" pour ajouter un abonnement</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {abonnements.map(abo => (
            <div key={abo._id} className="bg-white card-rounded shadow-lg transition-transform duration-300 overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-4">
                <h3 className="text-xl font-bold text-white">{abo.service}</h3>
                <p className="text-indigo-100 text-sm">{abo.proprio}</p>
                <p className="text-indigo-100 text-sm">{abo.emailService}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prix:</span>
                  <span className="text-2xl font-bold text-gray-800">{abo.prix.toLocaleString()} <span className="text-sm text-gray-500">FCFA</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Places:</span>
                  <span className={`text-xl font-bold ${abo.utilises >= abo.slots ? 'text-red-600' : 'text-green-600'}`}>{abo.utilises}/{abo.slots}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Occupation</span>
                    <span>{Math.round((abo.utilises / abo.slots) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${abo.utilises >= abo.slots ? 'bg-red-500' : abo.utilises >= abo.slots * 0.8 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(abo.utilises / abo.slots) * 100}%` }}></div>
                  </div>
                </div>
                <button onClick={() => supprimerItem('abonnement', abo._id)} disabled={loading} className="w-full flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition duration-200 disabled:opacity-50">
                  <Trash2 size={18} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AbonnementsContent;
