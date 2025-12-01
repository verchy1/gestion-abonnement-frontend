// components/MonProfile.tsx
import { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Eye, EyeOff } from 'lucide-react';

interface Admin {
  _id: string;
  nom: string;
  email: string;
  telephone?: string;
  role: string;
  dateCreation: string;
  identifiant: string;
}

interface MonProfileProps {
  adminProfile: Admin | null;
  mettreAJourProfil: (data: { nom: string; email: string; telephone?: string }) => Promise<boolean>;
  changerMotDePasse: (data: { ancienMotDePasse: string; nouveauMotDePasse: string }) => Promise<boolean>;
  loading: boolean;
}

const MonProfile = ({ adminProfile, mettreAJourProfil, changerMotDePasse, loading }: MonProfileProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // États pour le formulaire profil
  const [profileForm, setProfileForm] = useState({
    nom: adminProfile?.nom || '',
    email: adminProfile?.email || '',
    telephone: adminProfile?.telephone || '',
    identifiant: adminProfile?.identifiant || ''
  });

  // États pour le formulaire mot de passe
  const [passwordForm, setPasswordForm] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmMotDePasse: ''
  });

  // Gérer la soumission du profil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await mettreAJourProfil(profileForm);
    if (success) {
      setIsEditingProfile(false);
    }
  };

  // Gérer la soumission du mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.nouveauMotDePasse !== passwordForm.confirmMotDePasse) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.nouveauMotDePasse.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const success = await changerMotDePasse({
      ancienMotDePasse: passwordForm.ancienMotDePasse,
      nouveauMotDePasse: passwordForm.nouveauMotDePasse
    });

    if (success) {
      setPasswordForm({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmMotDePasse: ''
      });
      setIsChangingPassword(false);
    }
  };

  if (!adminProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-4 rounded-full">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{adminProfile.nom}</h2>
            <p className="text-indigo-100">{adminProfile.role === 'super-admin' ? 'Super Administrateur' : 'Administrateur'}</p>
          </div>
        </div>
      </div>

      {/* Informations du profil */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Informations du profil</h3>
          {!isEditingProfile && (
            <button
              onClick={() => {
                setProfileForm({
                  nom: adminProfile.nom,
                  email: adminProfile.email,
                  telephone: adminProfile.telephone || '',
                  identifiant: adminProfile.identifiant
                });
                setIsEditingProfile(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Modifier
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline mr-2" size={18} />
                Nom complet
              </label>
              <input
                type="text"
                value={profileForm.nom}
                onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline mr-2" size={18} />
                Identifiant
              </label>
              <input
                type="text"
                value={profileForm.identifiant}
                onChange={(e) => setProfileForm({ ...profileForm, identifiant: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline mr-2" size={18} />
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline mr-2" size={18} />
                Téléphone (optionnel)
              </label>
              <input
                type="tel"
                value={profileForm.telephone}
                onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                <Save className="mr-2" size={18} />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <User className="text-indigo-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-medium">{adminProfile.nom}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-indigo-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{adminProfile.email}</p>
              </div>
            </div>

            {adminProfile.telephone && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{adminProfile.telephone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-indigo-600">📅</div>
              <div>
                <p className="text-sm text-gray-500">Membre depuis</p>
                <p className="font-medium">
                  {new Date(adminProfile.dateCreation).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Changer le mot de passe */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Sécurité</h3>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Changer le mot de passe
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline mr-2" size={18} />
                Ancien mot de passe
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={passwordForm.ancienMotDePasse}
                  onChange={(e) => setPasswordForm({ ...passwordForm, ancienMotDePasse: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline mr-2" size={18} />
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.nouveauMotDePasse}
                  onChange={(e) => setPasswordForm({ ...passwordForm, nouveauMotDePasse: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline mr-2" size={18} />
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordForm.confirmMotDePasse}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmMotDePasse: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                <Lock className="mr-2" size={18} />
                {loading ? 'Modification...' : 'Changer le mot de passe'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordForm({
                    ancienMotDePasse: '',
                    nouveauMotDePasse: '',
                    confirmMotDePasse: ''
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Pour des raisons de sécurité, changez régulièrement votre mot de passe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonProfile;