import { Plus, Trash2, DollarSign } from 'lucide-react';
import type { CartePrepayee } from '../types';

const CartesContent = ({ cartes, setShowModal, supprimerCarte, loading, onLinkClick }: { cartes: CartePrepayee[]; setShowModal: (value: string | null) => void; supprimerCarte: (id: string) => Promise<void>; loading: boolean; onLinkClick: (id: string) => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Cartes prépayées</h2>
          <p className="text-gray-500 mt-1">Gérez les cartes qui paient les abonnements</p>
        </div>
        <button onClick={() => setShowModal('carte')} className="flex items-center space-x-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl">
          <Plus size={18} />
          <span>Ajouter Carte</span>
        </button>
      </div>

      {cartes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <DollarSign className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Aucune carte prépayée</p>
          <p className="text-gray-400 text-sm mt-2">Ajoutez une carte pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartes.map(c => (
            <div key={c._id} className="bg-white card-rounded shadow-lg p-6 transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Code</p>
                  <p className="text-lg font-semibold text-gray-900">{c.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Solde</p>
                  <p className="text-lg font-bold text-indigo-600">{c.solde.toLocaleString()} FCFA</p>
                </div>
              </div>

              {c.abonnements && c.abonnements.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Abonnements liés</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {c.abonnements.map((a, idx) => (
                      <li key={idx} className="flex justify-between"><span>{a.service} {a.emailService && `(${a.emailService})`}</span><span className="text-gray-500">{new Date(a.dateFin).toLocaleDateString()}</span></li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-2">
                <button onClick={() => onLinkClick(c._id)} disabled={loading} className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-2 rounded-lg disabled:opacity-50">Lier abonnement</button>
                <button onClick={() => supprimerCarte(c._id)} disabled={loading} className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded-lg disabled:opacity-50"><Trash2 size={16} /> Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartesContent;
