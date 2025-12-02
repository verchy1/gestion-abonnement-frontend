import { useState } from 'react';
import { User, Lock, Edit2, UserPlus, UserCheck, UserX, Trash2, UserCog, Mail } from 'lucide-react';

// Types
interface Utilisateur {
    _id: string;
    nom: string;
    telephone: string;
    email?: string;
}

interface Profil {
    _id: string;
    nom: string;
    codePIN: string;
    utilisateurId?: {
        _id: string;
        nom: string;
        telephone: string;
    } | null;
    avatar: string;
    estEnfant: boolean;
    dateAssignation?: string | null;
}

interface Abonnement {
    _id: string;
    service: string;
    prix: number;
    slots: number;
    utilises: number;
    profils?: Profil[];
    credentials?: {
        email: string;
        password: string;
    };
}

interface ProfilsManagerProps {
    abonnement: Abonnement;
    onClose: () => void;
    onUpdate: () => void;
    token: string;
    utilisateurs: Utilisateur[]
}

const API_URL = 'http://localhost:5000/api';

const ProfilsManager = ({ abonnement, onClose, onUpdate, token, utilisateurs }: ProfilsManagerProps) => {
    const [loading, setLoading] = useState(false);
    const [editingProfil, setEditingProfil] = useState<Profil | null>(null);
    const [assigningProfil, setAssigningProfil] = useState<Profil | null>(null);
    const [selectedUtilisateur, setSelectedUtilisateur] = useState<string>('');

    const [formData, setFormData] = useState({
        nom: '',
        codePIN: '',
        avatar: 'default',
        estEnfant: false
    });

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    // Modifier un profil
    const handleEditProfil = async (profilId: string) => {
        if (!formData.nom || !formData.codePIN) {
            return alert("Le nom et le code PIN sont obligatoires.");
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/abonnements/${abonnement._id}/profils/${profilId}`,
                {
                    method: 'PATCH',
                    headers: getHeaders(),
                    body: JSON.stringify(formData)
                }
            );

            if (response.ok) {
                onUpdate();
                setEditingProfil(null);
                setFormData({ nom: '', codePIN: '', avatar: 'default', estEnfant: false });
                alert('Profil modifié avec succès');
            } else {
                const error = await response.json();
                alert(error.message || 'Erreur lors de la modification');
            }
        } catch (error) {
            console.error('Erreur modification profil:', error);
            alert('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    // Assigner un profil à un utilisateur
    const handleAssignerProfil = async (profilId: string) => {
        if (!selectedUtilisateur) {
            return alert("Veuillez sélectionner un utilisateur");
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/abonnements/${abonnement._id}/profils/${profilId}/assigner`,
                {
                    method: 'PATCH',
                    headers: getHeaders(),
                    body: JSON.stringify({ utilisateurId: selectedUtilisateur })
                }
            );

            if (response.ok) {
                onUpdate();
                setAssigningProfil(null);
                setSelectedUtilisateur('');
                alert('Profil assigné avec succès');
            } else {
                const error = await response.json();
                alert(error.message || 'Erreur lors de l\'assignation');
            }
        } catch (error) {
            console.error('Erreur assignation profil:', error);
            alert('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    // Libérer un profil
    const handleLibererProfil = async (profilId: string) => {
        if (!confirm('Voulez-vous vraiment libérer ce profil ?')) return;

        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/abonnements/${abonnement._id}/profils/${profilId}/liberer`,
                {
                    method: 'PATCH',
                    headers: getHeaders()
                }
            );

            if (response.ok) {
                onUpdate();
                alert('Profil libéré avec succès');
            } else {
                const error = await response.json();
                alert(error.message || 'Erreur lors de la libération');
            }
        } catch (error) {
            console.error('Erreur libération profil:', error);
            alert('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    // Supprimer un profil
    const handleSupprimerProfil = async (profilId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est irréversible.')) return;

        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/abonnements/${abonnement._id}/profils/${profilId}`,
                {
                    method: 'DELETE',
                    headers: getHeaders()
                }
            );

            if (response.ok) {
                onUpdate();
                alert('Profil supprimé avec succès');
            } else {
                const error = await response.json();
                alert(error.message || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur suppression profil:', error);
            alert('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    // Ajouter un profil
    const handleAjouterProfil = async () => {
        if (!formData.nom || !formData.codePIN) {
            return alert("Le nom et le code PIN sont obligatoires.");
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/abonnements/${abonnement._id}/profils`,
                {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(formData)
                }
            );

            if (response.ok) {
                onUpdate();
                setFormData({ nom: '', codePIN: '', avatar: 'default', estEnfant: false });
                alert('Profil ajouté avec succès');
            } else {
                const error = await response.json();
                alert(error.message || 'Erreur lors de l\'ajout');
            }
        } catch (error) {
            console.error('Erreur ajout profil:', error);
            alert('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    };

    const profils = abonnement.profils || [];
    const profilsDisponibles = profils.filter(p => !p.utilisateurId);
    const profilsOccupes = profils.filter(p => p.utilisateurId);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">{abonnement.service}</h2>
                            <p className="text-indigo-100 text-sm mt-1">
                                Gestion des profils • {profilsOccupes.length}/{abonnement.slots} utilisés
                            </p>
                            {/* 🆕 NOUVEAU : Afficher les credentials */}
                            {abonnement.credentials && (
                                <div className="mt-3 p-3 bg-white/10 rounded-lg text-sm space-y-1">
                                    <p className="flex items-center space-x-2">
                                        <Mail size={14} />
                                        <span>{abonnement.credentials.email}</span>
                                    </p>
                                    <p className="flex items-center space-x-2">
                                        <Lock size={14} />
                                        <span>••••••••</span>
                                        <button
                                            onClick={() => {
                                                if (abonnement.credentials?.password) {
                                                    navigator.clipboard.writeText(abonnement.credentials.password);
                                                    alert('Mot de passe copié !');
                                                }
                                            }}
                                            className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
                                        >
                                            Copier
                                        </button>
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <UserCheck className="text-green-600" size={20} />
                                <span className="text-green-900 font-semibold">Disponibles: {profilsDisponibles.length}</span>
                            </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <UserX className="text-blue-600" size={20} />
                                <span className="text-blue-900 font-semibold">Occupés: {profilsOccupes.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Liste des profils */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Profils existants</h3>
                        <div className="space-y-3">
                            {profils.map((profil) => (
                                <div
                                    key={profil._id}
                                    className={`border-2 rounded-xl p-4 transition ${profil.utilisateurId
                                        ? 'border-blue-200 bg-blue-50'
                                        : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    {editingProfil?._id === profil._id ? (
                                        /* Mode édition */
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="Nom du profil"
                                            />
                                            <input
                                                type="text"
                                                value={formData.codePIN}
                                                onChange={(e) => setFormData({ ...formData, codePIN: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="Code PIN (4-6 chiffres)"
                                                maxLength={6}
                                            />
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.estEnfant}
                                                    onChange={(e) => setFormData({ ...formData, estEnfant: e.target.checked })}
                                                    className="rounded"
                                                />
                                                <span className="text-sm text-gray-700">Profil enfant</span>
                                            </label>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditProfil(profil._id)}
                                                    disabled={loading}
                                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                                >
                                                    Sauvegarder
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingProfil(null);
                                                        setFormData({ nom: '', codePIN: '', avatar: 'default', estEnfant: false });
                                                    }}
                                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    ) : assigningProfil?._id === profil._id ? (
                                        /* Mode assignation */
                                        <div className="space-y-3">
                                            <p className="font-semibold text-gray-700">Assigner à un utilisateur</p>
                                            <select
                                                value={selectedUtilisateur}
                                                onChange={(e) => setSelectedUtilisateur(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            >
                                                <option value="">Sélectionner un utilisateur</option>
                                                {utilisateurs.map((user) => (
                                                    <option key={user._id} value={user._id}>
                                                        {user.nom} - {user.telephone}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleAssignerProfil(profil._id)}
                                                    disabled={loading || !selectedUtilisateur}
                                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Assigner
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAssigningProfil(null);
                                                        setSelectedUtilisateur('');
                                                    }}
                                                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Mode affichage */
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-3 rounded-full ${profil.utilisateurId ? 'bg-blue-200' : 'bg-gray-200'}`}>
                                                    <User size={24} className={profil.utilisateurId ? 'text-blue-600' : 'text-gray-500'} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <p className="font-semibold text-gray-900">{profil.nom}</p>
                                                        {profil.estEnfant && (
                                                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                                Enfant
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                                        <Lock size={14} />
                                                        <span>PIN: {profil.codePIN}</span>
                                                    </div>
                                                    {profil.utilisateurId && (
                                                        <p className="text-sm text-blue-600 mt-1">
                                                            Assigné à: {profil.utilisateurId.nom} ({profil.utilisateurId.telephone})
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingProfil(profil);
                                                        setFormData({
                                                            nom: profil.nom,
                                                            codePIN: profil.codePIN,
                                                            avatar: profil.avatar,
                                                            estEnfant: profil.estEnfant
                                                        });
                                                    }}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                    title="Modifier"
                                                >
                                                    <Edit2 size={18} />
                                                </button>

                                                {!profil.utilisateurId ? (
                                                    <>
                                                        <button
                                                            onClick={() => setAssigningProfil(profil)}
                                                            disabled={loading}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                                                            title="Assigner"
                                                        >
                                                            <UserCog size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSupprimerProfil(profil._id)}
                                                            disabled={loading}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleLibererProfil(profil._id)}
                                                        disabled={loading}
                                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition disabled:opacity-50"
                                                        title="Libérer"
                                                    >
                                                        <UserX size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ajouter un profil */}
                    {profils.length < abonnement.slots && (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                <UserPlus size={20} className="mr-2" />
                                Ajouter un nouveau profil
                            </h4>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Nom du profil"
                                />
                                <input
                                    type="text"
                                    value={formData.codePIN}
                                    onChange={(e) => setFormData({ ...formData, codePIN: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Code PIN (4-6 chiffres)"
                                    maxLength={6}
                                />
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.estEnfant}
                                        onChange={(e) => setFormData({ ...formData, estEnfant: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-700">Profil enfant</span>
                                </label>
                                <button
                                    onClick={handleAjouterProfil}
                                    disabled={loading || !formData.nom || !formData.codePIN}
                                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Ajouter le profil
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilsManager;