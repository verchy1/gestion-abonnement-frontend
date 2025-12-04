import { useState } from 'react';
import type { FC } from "react";
import type { Abonnement, Vendeur } from '../types';

interface Props {
  abonnement: Abonnement;
  vendeurs: Vendeur[];
  loading: boolean;
  onSubmit: (id: string, data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

const FormulaireModificationAbonnement: FC<Props> = ({
  abonnement,
  vendeurs,
  loading,
  onSubmit,
  onCancel
}) => {
  const [form, setForm] = useState({
    service: abonnement.service || 'Netflix',
    prix: abonnement.prix || '',
    slots: abonnement.slots || '',
    proprio: abonnement.proprio || 'Moi',
    vendeurId: abonnement.vendeurId || abonnement.vendeurId || '',
    emailService: abonnement.emailService || '',
    password: '', // Vide par défaut - ne sera envoyé que si rempli
    actif: abonnement.actif !== undefined ? abonnement.actif : true
  });

  const handleSubmit = async () => {
    // Validation de base
    if (!form.service || !form.prix || !form.slots || !form.emailService) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (form.proprio === 'Vendeur' && !form.vendeurId) {
      alert('Veuillez sélectionner un vendeur');
      return;
    }

    // Vérifier qu'on ne réduit pas les slots en dessous du nombre utilisé
    if (Number(form.slots) < (abonnement.utilises || 0)) {
      alert(`Vous ne pouvez pas réduire le nombre de places en dessous de ${abonnement.utilises} (places actuellement utilisées)`);
      return;
    }

    // Préparer les données
    const data: Record<string, unknown> = {
      service: form.service,
      prix: Number(form.prix),
      slots: Number(form.slots),
      proprio: form.proprio,
      emailService: form.emailService,
      actif: form.actif
    };

    // Ajouter vendeurId seulement si proprio === 'Vendeur'
    if (form.proprio === 'Vendeur') {
      data.vendeurId = form.vendeurId;
    } else {
      data.vendeurId = null;
    }

    // Structurer les credentials
    const credentials: Record<string, string> = {
      email: form.emailService
    };

    // Ajouter le mot de passe seulement s'il a été modifié
    if (form.password && form.password.trim() !== '') {
      credentials.password = form.password;
    }

    data.credentials = credentials;

    await onSubmit(abonnement._id as string, data);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Service d'abonnement
        </label>
        <select 
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" 
          value={form.service} 
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Prix par utilisateur (FCFA)
        </label>
        <input 
          type="number" 
          placeholder="Ex: 1800" 
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" 
          value={form.prix} 
          onChange={(e) => setForm({ ...form, prix: e.target.value })} 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre de places disponibles
        </label>
        <input 
          type="number" 
          placeholder="Ex: 4" 
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" 
          value={form.slots} 
          onChange={(e) => setForm({ ...form, slots: e.target.value })} 
        />
        <p className="text-xs text-gray-500 mt-1">
          Places actuellement utilisées : {abonnement.utilises || 0}
        </p>
        {Number(form.slots) < (abonnement.utilises || 0) && (
          <p className="text-xs text-red-600 mt-1 font-medium">
            ⚠️ Impossible de réduire en dessous de {abonnement.utilises} places utilisées
          </p>
        )}
      </div>

      {/* 🔐 SECTION CREDENTIALS */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          🔐 Identifiants du service
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email du service <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              placeholder="Ex: service@example.com" 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" 
              value={form.emailService} 
              onChange={(e) => setForm({ ...form, emailService: e.target.value })} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mot de passe
            </label>
            <input 
              type="password" 
              placeholder="Laisser vide pour ne pas modifier" 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Laissez ce champ vide si vous ne souhaitez pas changer le mot de passe
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Propriétaire
        </label>
        <select 
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" 
          value={form.proprio} 
          onChange={(e) => setForm({ ...form, proprio: e.target.value })}
        >
          <option value="Moi">Mon compte</option>
          <option value="Vendeur">Vendeur partenaire</option>
        </select>
      </div>

      {form.proprio === 'Vendeur' && vendeurs.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sélectionner le vendeur
          </label>
          <select 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200" 
            value={form.vendeurId} 
            onChange={(e) => setForm({ ...form, vendeurId: e.target.value })}
          >
            <option value="">Choisir un vendeur</option>
            {vendeurs.map(v => (
              <option key={v._id} value={v._id}>
                {v.nom}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Statut actif/inactif */}
      <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
        <input
          type="checkbox"
          id="actif"
          checked={form.actif}
          onChange={(e) => setForm({ ...form, actif: e.target.checked })}
          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="actif" className="text-sm font-medium text-gray-700">
          Abonnement actif
        </label>
      </div>

      {/* Boutons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition duration-200 font-semibold"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || Number(form.slots) < (abonnement.utilises || 0)}
          className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Modification...' : '✓ Modifier'}
        </button>
      </div>
    </div>
  );
};

export default FormulaireModificationAbonnement;