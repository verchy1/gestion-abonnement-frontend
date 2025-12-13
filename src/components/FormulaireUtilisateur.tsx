import { useState } from 'react';
import type { Abonnement } from '../types';

const FormulaireUtilisateur = ({ ajouterUtilisateur, abonnements, loading }: { ajouterUtilisateur: (data: Record<string, unknown>) => Promise<void>; abonnements: Abonnement[]; loading: boolean }) => {
  const [form, setForm] = useState<{
    nom: string;
    telephone: string;
    email: string;
    abonnementId: string;
    dateDebut: string;
    dateFin: string;
    paye: boolean;
    montant: number | string;
    methodePaiement: string;
  }>({
    nom: '',
    telephone: '',
    email: '',
    abonnementId: '',
    dateDebut: '',
    dateFin: '',
    paye: false,
    montant: '',
    methodePaiement: 'Mobile Money'
  });

  const handleSubmit = () => {
    if (form.nom && form.telephone && form.abonnementId && form.dateDebut && form.dateFin && form.montant) {
      ajouterUtilisateur(form);
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input type="text" placeholder="Ex: Jean Dupont" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition duration-200" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <input type="tel" placeholder="Ex: +242 06 123 45 67" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition duration-200" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email (optionnel)</label>
        <input type="email" placeholder="exemple@email.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition duration-200" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Service <span className="text-red-500">*</span>
        </label>
        <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition duration-200" value={form.abonnementId} onChange={(e) => setForm({ ...form, abonnementId: e.target.value })}>
          <option value="">Choisir un service</option>
          {abonnements.map(a => (
            <option key={a._id} value={a._id}>
              {a.service} - {a.emailService} ({a.utilises}/{a.slots} places)
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Date début <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            className="
              w-full 
              px-3 py-2 
              border-2 border-gray-200 
              rounded-xl 
              text-sm 
              focus:outline-none focus:border-green-500 
              transition duration-200
              appearance-none
            "
            value={form.dateDebut}
            onChange={(e) => setForm({ ...form, dateDebut: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Date fin <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            className="
        w-full 
        px-3 py-2 
        border-2 border-gray-200 
        rounded-xl 
        text-sm
        focus:outline-none focus:border-green-500 
        transition duration-200
        appearance-none
      "
            value={form.dateFin}
            onChange={(e) => setForm({ ...form, dateFin: e.target.value })}
          />
        </div>
      </div>


      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Montant (FCFA) <span className="text-red-500">*</span>
        </label>
        <input type="number" placeholder="Ex: 1800" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition duration-200" value={form.montant} onChange={(e) => setForm({ ...form, montant: parseInt(e.target.value) || '' })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Méthode de paiement</label>
        <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition duration-200" value={form.methodePaiement} onChange={(e) => setForm({ ...form, methodePaiement: e.target.value })}>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Cash">Cash</option>
          <option value="Virement">Virement</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <button onClick={handleSubmit} disabled={loading} className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Ajout en cours...' : '✓ Ajouter le client'}
      </button>
    </div>
  );
};

export default FormulaireUtilisateur;
