import { useState } from 'react';

const FormulaireCarte = ({ ajouterCarte, loading }: { ajouterCarte: (data: Record<string, unknown>) => Promise<void>; loading: boolean }) => {
  const [form, setForm] = useState<{ code: string; solde: number | string }>({ code: '', solde: '' });

  const handleSubmit = () => {
    if (form.code && form.solde !== '') {
      ajouterCarte({ code: form.code, solde: Number(form.solde) });
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Code de la carte</label>
        <input type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Solde (FCFA)</label>
        <input type="number" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" value={form.solde} onChange={(e) => setForm({ ...form, solde: e.target.value === '' ? '' : Number(e.target.value) })} />
      </div>

      <button onClick={handleSubmit} disabled={loading} className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold">
        {loading ? 'En cours...' : 'Ajouter la carte'}
      </button>
    </div>
  );
};

export default FormulaireCarte;
