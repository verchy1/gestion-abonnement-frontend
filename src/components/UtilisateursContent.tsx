import { Users, Trash2 } from 'lucide-react';
import type { Utilisateur } from '../types';
import { SkeletonTable } from './Skeleton';

const getExpirationStatus = (dateFin: string) => {
    const today = new Date();
    const end = new Date(dateFin);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let color = "text-green-600";
    let label = `${diffDays} jours restants`;

    if (diffDays <= 0) {
        color = "text-red-600 font-bold";
        label = "Expiré";
    } else if (diffDays === 1) {
        color = "text-red-600 font-bold";
        label = "Expire demain";
    } else if (diffDays <= 5) {
        color = "text-orange-500 font-semibold";
        label = `${diffDays} jours restants`;
    }

    return { diffDays, color, label };
};


const UtilisateursContent = ({ utilisateurs, setShowModal, togglePaiement, supprimerItem, loading, formatDate, isLoadingData }: { utilisateurs: Utilisateur[]; setShowModal: (value: string | null) => void; togglePaiement: (id: string, payeActuel: boolean) => Promise<void>; supprimerItem: (type: string, id: string) => Promise<void>; loading: boolean; formatDate: (date: string) => string; isLoadingData: boolean }) => {
    if (isLoadingData) {
        return <SkeletonTable />;
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Utilisateurs</h2>
                    <p className="text-gray-500 mt-1">Gérez vos clients et leurs abonnements</p>
                </div>
                <button onClick={() => setShowModal('utilisateur')} className="flex items-center space-x-2 bg-linear-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition duration-200 shadow-lg">
                    <PlusIcon />
                    <span>Nouveau Client</span>
                </button>
            </div>

            {utilisateurs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <Users className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 text-lg">Aucun utilisateur pour le moment</p>
                    <p className="text-gray-400 text-sm mt-2">Ajoutez votre premier client</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Téléphone</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiration</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {utilisateurs.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                        {user.nom.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.nom}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">{user.abonnementId?.service || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.telephone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {(() => {
                                                const { color, label } = getExpirationStatus(user.dateFin);
                                                return (
                                                    <span className={color}>
                                                        {formatDate(user.dateFin)} — {label}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-semibold text-gray-900">{user.montant.toLocaleString()} <span className="text-gray-500 text-xs">FCFA</span></span></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => togglePaiement(user._id, user.paye)} className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition duration-200 ${user.paye ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>{user.paye ? '✓ Payé' : '✗ Non payé'}</button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => supprimerItem('utilisateur', user._id)} disabled={loading} className="text-red-600 hover:text-red-800 transition duration-150 disabled:opacity-50"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="lg:hidden divide-y divide-gray-200">
                        {utilisateurs.map(user => (
                            <div key={user._id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{user.nom.charAt(0).toUpperCase()}</div>
                                        <div className="ml-3">
                                            <p className="font-semibold text-gray-900">{user.nom}</p>
                                            <p className="text-sm text-gray-500">{user.telephone}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => supprimerItem('utilisateur', user._id)} disabled={loading} className="text-red-600"><Trash2 size={18} /></button>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-600">Service:</span><span className="font-medium text-gray-900">{user.abonnementId?.service || 'N/A'}</span></div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Expiration:</span>
                                        {(() => {
                                            const { color, label } = getExpirationStatus(user.dateFin);
                                            return (
                                                <span className={`font-medium ${color}`}>
                                                    {formatDate(user.dateFin)} — {label}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                    <div className="flex justify-between"><span className="text-gray-600">Montant:</span><span className="font-bold text-gray-900">{user.montant.toLocaleString()} FCFA</span></div>
                                </div>
                                <button onClick={() => togglePaiement(user._id, user.paye)} className={`w-full mt-3 px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 ${user.paye ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}>{user.paye ? '✓ Payé' : '✗ Marquer comme payé'}</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// local tiny icon to avoid importing Plus from lucide for mobile button duplication
const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
        <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default UtilisateursContent;
