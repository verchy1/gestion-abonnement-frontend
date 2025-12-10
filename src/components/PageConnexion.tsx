import { useState } from 'react';
import { DollarSign, AlertCircle, ArrowLeft } from 'lucide-react';
import { API_URL } from '../types';

const PageConnexion = ({
  setIsLoggedIn,
  setToken, 
  onBackToClient
}: {
  setIsLoggedIn: (v: boolean) => void;
  setToken: (v: string | null) => void;
  onBackToClient: () => void;
}) => {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleLogin = async () => {
    if (!identifiant || !motDePasse) {
      setErreur('Veuillez remplir tous les champs');
      return;
    }

    try {
      setChargement(true);
      setErreur('');

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifiant, motDePasse })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        setToken(data.token);
        setIsLoggedIn(true);
      } else {
        setErreur(data.message || 'Identifiant ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      setErreur('Erreur de connexion au serveur');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden text-gray-900">
        <button
          onClick={onBackToClient}
          className="absolute top-4 left-4 flex items-center space-x-2 text-white hover:text-gray-300 font-semibold"
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-8 text-center">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <DollarSign className="text-indigo-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Connexion Admin</h1>
          <p className="text-indigo-100">SubsManager Pro</p>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Identifiant</label>
              <input type="text" placeholder="Votre identifiant" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200 text-gray-900" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Mot de passe</label>
              <input type="password" placeholder="Votre mot de passe" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-200 text-gray-900" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
            </div>

            {erreur && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center animate-shake">
                <AlertCircle size={20} className="mr-2 shrink-0" />
                <span className="text-sm">{erreur}</span>
              </div>
            )}

            <button onClick={handleLogin} disabled={chargement} className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">{chargement ? 'Connexion...' : 'Se connecter'}</button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-800 text-center">💡 <strong>NB:</strong> Assurez-vous que le Subs vous a gerer vos informations de connexion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageConnexion;
