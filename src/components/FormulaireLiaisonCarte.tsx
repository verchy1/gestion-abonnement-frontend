import { useState } from 'react';
import type { Abonnement } from '../types';
import { API_URL } from '../types';

const FormulaireLiaisonCarte = ({ cardId, abonnements, loading, onSuccess }: { cardId: string; abonnements: Abonnement[]; loading: boolean; onSuccess: () => void }) => {
    const [abonnementId, setAbonnementId] = useState<string>('');
    const [prixFournisseur, setPrixFournisseur] = useState<number | ''>('');

    const [dateFin, setDateFin] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0]; 
    });

    const selectedAbonnement = abonnements.find(a => a._id === abonnementId);

    const handleSubmit = async () => {
        
        if (!cardId) return;
        if (!abonnementId) return alert('Choisissez un abonnement');

        const selected = abonnements.find(a => a._id === abonnementId);
        if (!selected) return alert('Abonnement invalide');


        try {
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/cartes/${cardId}/abonnements`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    abonnementId,
                    dateFin,
                    prixFournisseur
                })
            });
            if (response.ok) {
                onSuccess();
            } else {
                const err = await response.json();
                alert(err.message || 'Erreur liaison carte');
            }
        } catch (error) {
            console.error('Erreur liaison carte:', error);
            alert('Erreur de connexion au serveur');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Choisir un abonnement</label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" value={abonnementId} onChange={(e) => setAbonnementId(e.target.value)}>
                    <option value="">-- Choisir --</option>
                    {abonnements.map(a => (
                        <option key={a._id} value={a._id}>
                            {a.service} — {a.prix} FCFA
                        </option>
                    ))}
                </select>

                {/* Affichage email du service sélectionné */}
                {selectedAbonnement?.emailService && (
                    <p className="mt-2 text-sm text-gray-600">
                        📧 Email du service :{' '}
                        <span className="font-medium text-gray-900">{selectedAbonnement.emailService}</span>
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prix fournisseur (FCFA)
                </label>
                <input
                    type="number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
                    value={prixFournisseur}
                    onChange={(e) => setPrixFournisseur(Number(e.target.value))}
                    placeholder="Ex: 1200"
                />
            </div>
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
                <input type="date" className="px-2 py-3 border-2 border-gray-200 rounded-xl" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
            </div>




            <button onClick={handleSubmit} disabled={loading} className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold">
                {loading ? 'En cours...' : '✓ Lier la carte'}
            </button>
        </div>
    );
};

export default FormulaireLiaisonCarte;
