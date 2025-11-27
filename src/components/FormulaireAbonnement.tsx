import { useState } from 'react';
import type { Vendeur } from '../types';

const FormulaireAbonnement = ({ ajouterAbonnement, vendeurs, loading }: { ajouterAbonnement: (data: Record<string, unknown>) => Promise<void>; vendeurs: Vendeur[]; loading: boolean }) => {
  const [form, setForm] = useState<{
    service: string;
    prix: number | string;
    slots: number | string;
    proprio: string;
    vendeurId: string;
    emailService: string;
  }>({
    service: 'Netflix',
    prix: '',
    slots: '',
    proprio: 'Moi',
    vendeurId: '',
    emailService: '',
  });

  const handleSubmit = () => {
    if (form.service && form.prix && form.slots && form.emailService) {
      const data: Record<string, unknown> = { ...form };
      if (form.proprio === 'Moi') {
        delete data['vendeurId'];
      }
      ajouterAbonnement(data);
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Service d'abonnement</label>
        <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
          <option value="Netflix">Netflix</option>
          <option value="Apple Music">Apple Music</option>
          <option value="Prime Video">Prime Video</option>
          <option value="Spotify">Spotify</option>
          <option value="Disney+">Disney+</option>
          <option value="YouTube Premium">YouTube Premium</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Prix par utilisateur (FCFA)</label>
        <input type="number" placeholder="Ex: 1800" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" value={form.prix} onChange={(e) => setForm({ ...form, prix: parseInt(e.target.value) || '' })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de places disponibles</label>
        <input type="number" placeholder="Ex: 4" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" value={form.slots} onChange={(e) => setForm({ ...form, slots: parseInt(e.target.value) || '' })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">email du service</label>
        <input type="email" placeholder="Ex: service@example.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" value={form.emailService} onChange={(e) => setForm({ ...form, emailService: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Propriétaire</label>
        <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" value={form.proprio} onChange={(e) => setForm({ ...form, proprio: e.target.value })}>
          <option value="Moi">Mon compte</option>
          <option value="Vendeur">Vendeur partenaire</option>
        </select>
      </div>

      {form.proprio === 'Vendeur' && vendeurs.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sélectionner le vendeur</label>
          <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" value={form.vendeurId} onChange={(e) => setForm({ ...form, vendeurId: e.target.value })}>
            <option value="">Choisir un vendeur</option>
            {vendeurs.map(v => (
              <option key={v._id} value={v._id}>
                {v.nom}
              </option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading} className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Ajout en cours...' : '✓ Ajouter l\'abonnement'}
      </button>
    </div>
  );
};

export default FormulaireAbonnement;
