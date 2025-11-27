import { Users } from 'lucide-react';
import type { Vendeur } from '../types';

const VendeursContent = ({ vendeurs }: { vendeurs: Vendeur[] }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Vendeurs Partenaires</h2>
        <p className="text-gray-500 mt-1">Gérez vos partenaires et leurs commissions</p>
      </div>

      {vendeurs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Users className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">Aucun vendeur partenaire</p>
          <p className="text-gray-400 text-sm mt-2">Les vendeurs apparaîtront ici</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendeurs.map(vendeur => (
            <div key={vendeur._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-linear-to-r from-purple-500 to-pink-600 p-6 text-center">
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-3xl font-bold text-purple-600">{vendeur.nom.charAt(0).toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{vendeur.nom}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600"><span className="text-sm">📞</span><span className="ml-2 text-sm">{vendeur.telephone}</span></div>
                  {vendeur.email && (<div className="flex items-center text-gray-600"><span className="text-sm">✉️</span><span className="ml-2 text-sm">{vendeur.email}</span></div>)}
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-600">Commission par vente</span><span className="text-lg font-bold text-purple-600">{vendeur.commission.toLocaleString()} FCFA</span></div>
                </div>
                <div className={`px-3 py-2 rounded-lg text-center text-sm font-semibold ${vendeur.actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{vendeur.actif ? '✓ Actif' : '✗ Inactif'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendeursContent;
