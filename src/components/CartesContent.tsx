import type { FC } from 'react';
import { Plus, Trash2, CreditCard, Link2, Calendar, TrendingUp, Wallet, Edit2, X } from 'lucide-react';
import type { CartePrepayee } from '../types';

interface Props {
  cartes?: CartePrepayee[];
  setShowModal: (value: string | null) => void;
  supprimerCarte: (id: string) => Promise<void>;
  modifierSoldeCarte: (id: string, nouveauSolde: number) => Promise<void>;
  supprimerAbonnementCarte: (carteId: string, abonnementIndex: number) => Promise<void>;
  loading: boolean;
  onLinkClick: (id: string) => void;
}

const safeDate = (value?: string | number | Date) => {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('fr-FR');
};

const CartesContent: FC<Props> = ({ 
  cartes = [], 
  setShowModal, 
  supprimerCarte, 
  modifierSoldeCarte,
  supprimerAbonnementCarte,
  loading, 
  onLinkClick 
}) => {
  // Calculer les statistiques
  const soldeTotal = cartes.reduce((acc, c) => acc + (c.solde || 0), 0);
  const cartesActives = cartes.filter(c => c.abonnements && c.abonnements.length > 0).length;
  const totalAbonnementsLies = cartes.reduce((acc, c) => acc + (c.abonnements?.length || 0), 0);

  const handleEditSolde = async (cardId: string, currentSolde: number) => {
    const nouveauSolde = prompt(`Entrez le nouveau solde (actuel: ${currentSolde} FCFA):`, String(currentSolde));
    if (nouveauSolde !== null && !isNaN(Number(nouveauSolde))) {
      await modifierSoldeCarte(cardId, Number(nouveauSolde));
    }
  };

  const handleDeleteAbonnement = async (carteId: string, abonnementIndex: number, serviceName: string) => {
    if (confirm(`Voulez-vous vraiment supprimer l'abonnement "${serviceName}" de cette carte ?`)) {
      await supprimerAbonnementCarte(carteId, abonnementIndex);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cartes Prépayées</h2>
            <p className="text-gray-600">Gérez les moyens de paiement de vos abonnements</p>
          </div>

          <button
            onClick={() => setShowModal('carte')}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            aria-label="Ajouter une carte"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Ajouter une carte</span>
          </button>
        </div>

        {/* Stats compactes */}
        {cartes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Wallet className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Solde total</p>
                <p className="text-lg font-bold text-gray-900">{soldeTotal.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Cartes actives</p>
                <p className="text-lg font-bold text-gray-900">{cartesActives}/{cartes.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Link2 className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Abonnements liés</p>
                <p className="text-lg font-bold text-gray-900">{totalAbonnementsLies}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {cartes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="text-gray-400" size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune carte prépayée</h3>
            <p className="text-gray-500 mb-6">Ajoutez votre première carte pour commencer à gérer vos paiements</p>
            <button
              onClick={() => setShowModal('carte')}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-semibold"
              aria-label="Ajouter une carte"
            >
              <Plus size={20} />
              <span>Ajouter une carte</span>
            </button>
          </div>
        </div>
      ) : (
        /* Grille des cartes */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {cartes.map(c => {
            const hasAbonnements = !!(c.abonnements && c.abonnements.length > 0);
            const soldeColor = c.solde > 10000 ? 'text-emerald-600' : c.solde > 5000 ? 'text-yellow-600' : 'text-red-600';
            type MaybeIds = { _id?: string; id?: string };
            const ids = c as unknown as MaybeIds;
            const cardKey = ids._id ?? ids.id ?? c.code;

            return (
              <div
                key={cardKey}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
              >
                {/* Card Header - Style carte bancaire */}
                <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-6 overflow-hidden">
                  {/* Pattern background */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-8">
                      <CreditCard className="text-white/90" size={32} strokeWidth={1.5} />
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          hasAbonnements
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                        }`}
                        aria-hidden
                      >
                        {hasAbonnements ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Code carte</p>
                      <p className="text-xl font-bold text-white tracking-wider truncate">{c.code}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Solde avec bouton modifier */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium mb-1">Solde disponible</p>
                        <p className={`text-2xl font-bold ${soldeColor}`}>
                          {Number(c.solde || 0).toLocaleString()}
                          <span className="text-sm text-gray-500 ml-1 font-normal">FCFA</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSolde(cardKey as string, c.solde)}
                          disabled={loading}
                          className="p-2 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Modifier le solde"
                          title="Modifier le solde"
                        >
                          <Edit2 className="text-indigo-600" size={18} />
                        </button>
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <TrendingUp className={soldeColor} size={24} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Abonnements liés */}
                  {hasAbonnements ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700">Abonnements liés</p>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                          {c.abonnements?.length ?? 0}
                        </span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {c.abonnements?.map((a, idx) => {
                          const ab = a as { _id?: string; id?: string; service?: string; emailService?: string; dateFin?: string | number | Date };
                          const abonnementKey = ab._id ?? ab.id ?? idx;
                          return (
                            <div
                              key={abonnementKey}
                              className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group/abo hover:border-red-300 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{a.service}</p>
                                {a.emailService ? (
                                  <p className="text-xs text-gray-500 truncate">({a.emailService})</p>
                                ) : null}
                                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                                  <Calendar size={12} />
                                  <span className="whitespace-nowrap">{safeDate(a.dateFin)}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteAbonnement(cardKey as string, idx, a.service)}
                                disabled={loading}
                                className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/abo:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Supprimer l'abonnement ${a.service}`}
                                title="Supprimer cet abonnement"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <Link2 className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-sm text-gray-500">Aucun abonnement lié</p>
                    </div>
                  )}
                </div>

                {/* Card Footer avec actions */}
                <div className="px-5 pb-5 flex space-x-2">
                  <button
                    onClick={() => onLinkClick(cardKey as string)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold border border-indigo-200 hover:border-indigo-300"
                    aria-label={`Lier un abonnement à la carte ${c.code}`}
                  >
                    <Link2 size={16} />
                    <span>Lier</span>
                  </button>
                  <button
                    onClick={() => supprimerCarte(cardKey as string)}
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 text-gray-700 hover:text-red-600 bg-gray-50 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium border border-gray-200 hover:border-red-200"
                    aria-label={`Supprimer la carte ${c.code}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default CartesContent;