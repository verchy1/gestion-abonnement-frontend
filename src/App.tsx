import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, LogOut, Menu, X, Users, RefreshCcw, CreditCard, User } from 'lucide-react';
import './App.css';

// Imports des types
import { API_URL } from './types';
import type { Abonnement, Admin, CartePrepayee } from './types';

// Imports des composants
import PageConnexion from './components/PageConnexion';
import ClientApp from './components/client/ClientApp';
import DashboardContent from './components/DashboardContent';
import AbonnementsContent from './components/AbonnementsContent';
import UtilisateursContent from './components/UtilisateursContent';
import VendeursContent from './components/VendeursContent';
import CartesContent from './components/CartesContent';
import Modal from './components/Modal';
import FormulaireAbonnement from './components/FormulaireAbonnement';
import FormulaireUtilisateur from './components/FormulaireUtilisateur';
import FormulaireCarte from './components/FormulaireCarte';
import FormulaireLiaisonCarte from './components/FormulaireLiaisonCarte';
import MonProfile from './components/MonProfile';
import ProfilsManager from './components/ProfilsManager';
import FormulaireModificationAbonnement from './components/FormulaireModificationAbonnement';

const App = () => {
  // 🆕 État principal pour gérer le mode (client ou admin)
  const [mode, setMode] = useState<'client' | 'admin-login' | 'admin-dashboard'>('client');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // États pour les données
  const [abonnements, setAbonnements] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [vendeurs, setVendeurs] = useState([]);
  const [cartes, setCartes] = useState<CartePrepayee[]>([]);
  const [selectedCardForLink, setSelectedCardForLink] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUtilisateurs: 0,
    totalAbonnements: 0,
    revenusMois: 0,
    commissionsTotal: 0,
    paiementsEnAttente: 0
  });
  const [adminProfile, setAdminProfile] = useState<Admin | null>(null);
  const [selectedAbonnementForProfils, setSelectedAbonnementForProfils] = useState<Abonnement | null>(null);
  const [selectedAbonnementForEdit, setSelectedAbonnementForEdit] = useState<Abonnement | null>(null);

  // Vérifier si l'utilisateur est déjà connecté en tant qu'admin
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      setMode('admin-dashboard');
    }
  }, []);

  // Charger les données admin
  useEffect(() => {
    if (isLoggedIn && token && mode === 'admin-dashboard') {
      const loadData = async () => {
        try {
          setIsLoadingData(true);
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          };
          const [abonRes, utilRes, vendRes, statsRes, cartesRes, profileRes] = await Promise.all([
            fetch(`${API_URL}/abonnements`, { headers }),
            fetch(`${API_URL}/utilisateurs`, { headers }),
            fetch(`${API_URL}/vendeurs`, { headers }),
            fetch(`${API_URL}/stats`, { headers }),
            fetch(`${API_URL}/cartes`, { headers }),
            fetch(`${API_URL}/admin/profile`, { headers })
          ]);

          if (abonRes.ok) setAbonnements(await abonRes.json());
          if (utilRes.ok) setUtilisateurs(await utilRes.json());
          if (vendRes.ok) setVendeurs(await vendRes.json());
          if (statsRes.ok) setStats(await statsRes.json());
          if (cartesRes && cartesRes.ok) setCartes(await cartesRes.json());
          if (profileRes && profileRes.ok) setAdminProfile(await profileRes.json());
        } catch (error) {
          console.error('Erreur chargement données:', error);
        } finally {
          setIsLoadingData(false);
        }
      };
      loadData();
    }
  }, [isLoggedIn, token, mode]);

  // Headers pour les requêtes API
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const refreshData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    try {
      await Promise.all([
        chargerAbonnements(),
        chargerUtilisateurs(),
        chargerStats(),
        chargerCartes(),
        chargerProfil()
      ]);
    } catch (error) {
      console.error('Erreur actualisation des données :', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const genererRecu = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/recu/${userId}`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        alert("Erreur lors de la génération du reçu");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recu_${userId}.pdf`;
      a.click();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de générer le reçu");
    }
  };

  const chargerProfil = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/profile`, {
        headers: getHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setAdminProfile(data);
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const mettreAJourProfil = async (data: { nom: string; email: string; telephone?: string }) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/profile`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setAdminProfile(updatedProfile);
        alert('Profil mis à jour avec succès');
        return true;
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la mise à jour');
        return false;
      }
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      alert('Erreur de connexion au serveur');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changerMotDePasse = async (data: { ancienMotDePasse: string; nouveauMotDePasse: string }) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/profile/password`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Mot de passe modifié avec succès');
        return true;
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors du changement de mot de passe');
        return false;
      }
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      alert('Erreur de connexion au serveur');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const chargerAbonnements = async () => {
    try {
      const response = await fetch(`${API_URL}/abonnements`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAbonnements(data);
      }
    } catch (error) {
      console.error('Erreur chargement abonnements:', error);
    }
  };

  const chargerUtilisateurs = async () => {
    try {
      const response = await fetch(`${API_URL}/utilisateurs`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setUtilisateurs(data);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    }
  };

  const chargerStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`, {
        headers: getHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const chargerCartes = async () => {
    try {
      const response = await fetch(`${API_URL}/cartes`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setCartes(data);
      }
    } catch (error) {
      console.error('Erreur chargement cartes:', error);
    }
  };

  const ajouterAbonnement = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/abonnements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await chargerAbonnements();
        await chargerStats();
        setShowModal(null);
        alert('Abonnement ajouté avec succès !');
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur ajout abonnement:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const modifierAbonnement = async (id: string, data: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/abonnements/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await chargerAbonnements();
        await chargerStats();
        setShowModal(null);
        setSelectedAbonnementForEdit(null);
        alert('Abonnement modifié avec succès !');
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur modification abonnement:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const ajouterUtilisateur = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/utilisateurs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await chargerUtilisateurs();
        await chargerAbonnements();
        await chargerStats();
        setShowModal(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de l\'ajout de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur ajout utilisateur:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const togglePaiement = async (id: string, payeActuel: boolean) => {
    try {
      const response = await fetch(`${API_URL}/utilisateurs/${id}/paiement`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ paye: !payeActuel })
      });

      if (response.ok) {
        await chargerUtilisateurs();
        await chargerStats();
      }
    } catch (error) {
      console.error('Erreur toggle paiement:', error);
    }
  };

  const supprimerItem = async (type: string, id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      setLoading(true);
      const endpoint = type === 'abonnement' ? 'abonnements' : 'utilisateurs';
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (response.ok) {
        if (type === 'abonnement') {
          await chargerAbonnements();
        } else {
          await chargerUtilisateurs();
          await chargerAbonnements();
        }
        await chargerStats();
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setLoading(false);
    }
  };

  const supprimerCarte = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cartes/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        await chargerCartes();
      }
    } catch (error) {
      console.error('Erreur suppression carte:', error);
    } finally {
      setLoading(false);
    }
  };

  const modifierSoldeCarte = async (id: string, nouveauSolde: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cartes/${id}/solde`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ solde: nouveauSolde })
      });

      if (response.ok) {
        await chargerCartes();
        alert('Solde mis à jour avec succès');
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la modification du solde');
      }
    } catch (error) {
      console.error('Erreur modification solde carte:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const supprimerAbonnementCarte = async (carteId: string, abonnementIndex: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cartes/${carteId}/abonnements/${abonnementIndex}`, {
        method: 'DELETE',
        headers: getHeaders()
      });

      if (response.ok) {
        await chargerCartes();
        alert('Abonnement supprimé avec succès');
      } else {
        const error = await response.json();
        alert(error.message || 'Erreur lors de la suppression de l\'abonnement');
      }
    } catch (error) {
      console.error('Erreur suppression abonnement carte:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setIsLoggedIn(false);
    setAbonnements([]);
    setUtilisateurs([]);
    setVendeurs([]);
    setMode('client'); // 🆕 Retour au mode client
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // 🆕 Gestion de la connexion admin réussie
  const handleAdminLoginSuccess = (newToken: string | null) => {
    setToken(newToken);
    setIsLoggedIn(true);
    setMode('admin-dashboard');
  };

  // 🆕 RENDU CONDITIONNEL SELON LE MODE
  
  // MODE CLIENT - Afficher ClientApp
  if (mode === 'client') {
    return <ClientApp onSwitchToAdmin={() => setMode('admin-login')} />;
  }

  // MODE ADMIN LOGIN - Afficher PageConnexion
  if (mode === 'admin-login') {
    return (
      <PageConnexion 
        setIsLoggedIn={setIsLoggedIn} 
        setToken={handleAdminLoginSuccess}
        onBackToClient={() => setMode('client')}
      />
    );
  }

  // MODE ADMIN DASHBOARD - Afficher le dashboard admin
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* HEADER PREMIUM */}
      <header className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl shadow-md">
              <img src="/subsManager logo.svg" alt="SubsManager Logo" width={30} height={30} />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-wide">SubsManager</h1>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={refreshData}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white flex items-center space-x-2"
            >
              <RefreshCcw size={18} />
              <span>Rafraîchir</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-white text-indigo-600 hover:bg-indigo-50 font-semibold flex items-center space-x-2"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-700 text-white py-3 px-4 space-y-3">
            <button onClick={refreshData} className="w-full bg-indigo-500 py-2 rounded-lg">Rafraîchir</button>
            <button onClick={handleLogout} className="w-full bg-white text-indigo-600 py-2 rounded-lg">Déconnexion</button>
          </div>
        )}
      </header>

      {/* NAVIGATION */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex overflow-x-auto space-x-2 scrollbar-hide">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
            { id: 'abonnements', label: 'Abonnements', icon: DollarSign },
            { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
            { id: 'vendeurs', label: 'Vendeurs', icon: Users },
            { id: 'cartes', label: 'Cartes prépayées', icon: CreditCard },
            { id: 'profile', label: 'Mon profil', icon: User },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          {activeTab === 'dashboard' && (
            <DashboardContent stats={stats} abonnements={abonnements} isLoadingData={isLoadingData} />
          )}
          {activeTab === 'abonnements' && (
            <AbonnementsContent
              abonnements={abonnements}
              setShowModal={setShowModal}
              supprimerItem={supprimerItem}
              loading={loading}
              isLoadingData={isLoadingData}
              onGererProfils={(abonnement: Abonnement) => setSelectedAbonnementForProfils(abonnement)}
              onModifier={(abonnement: Abonnement) => {
                setSelectedAbonnementForEdit(abonnement);
                setShowModal('modifier-abonnement');
              }}
            />
          )}
          {activeTab === 'utilisateurs' && (
            <UtilisateursContent
              utilisateurs={utilisateurs}
              setShowModal={setShowModal}
              togglePaiement={togglePaiement}
              supprimerItem={supprimerItem}
              loading={loading}
              isLoadingData={isLoadingData}
              formatDate={formatDate}
              genererRecu={genererRecu}
            />
          )}
          {activeTab === 'vendeurs' && <VendeursContent vendeurs={vendeurs} />}
          {activeTab === 'cartes' && (
            <CartesContent
              cartes={cartes}
              setShowModal={setShowModal}
              supprimerCarte={supprimerCarte}
              modifierSoldeCarte={modifierSoldeCarte}
              supprimerAbonnementCarte={supprimerAbonnementCarte}
              loading={loading}
              onLinkClick={(id: string) => { setSelectedCardForLink(id); setShowModal('link'); }}
            />
          )}
          {activeTab === 'profile' && (
            <MonProfile
              adminProfile={adminProfile}
              mettreAJourProfil={mettreAJourProfil}
              changerMotDePasse={changerMotDePasse}
              loading={loading}
            />
          )}
        </div>
      </main>

      {/* MODALS */}
      {showModal === 'abonnement' && (
        <Modal title="Ajouter un Abonnement" onClose={() => setShowModal(null)}>
          <FormulaireAbonnement ajouterAbonnement={ajouterAbonnement} vendeurs={vendeurs} loading={loading} />
        </Modal>
      )}
      {showModal === 'utilisateur' && (
        <Modal title="Ajouter un Utilisateur" onClose={() => setShowModal(null)}>
          <FormulaireUtilisateur ajouterUtilisateur={ajouterUtilisateur} abonnements={abonnements} loading={loading} />
        </Modal>
      )}
      {showModal === 'carte' && (
        <Modal title="Ajouter une Carte prépayée" onClose={() => setShowModal(null)}>
          <FormulaireCarte
            ajouterCarte={async (data: Record<string, unknown>) => {
              try {
                setLoading(true);
                const response = await fetch(`${API_URL}/cartes`, {
                  method: 'POST',
                  headers: getHeaders(),
                  body: JSON.stringify(data)
                });
                if (response.ok) {
                  await chargerCartes();
                  setShowModal(null);
                } else {
                  const err = await response.json();
                  alert(err.message || 'Erreur création carte');
                }
              } catch (error) {
                console.error('Erreur ajout carte:', error);
                alert('Erreur de connexion au serveur');
              } finally {
                setLoading(false);
              }
            }}
            loading={loading}
          />
        </Modal>
      )}
      {showModal === 'link' && selectedCardForLink && (
        <Modal title="Lier une carte à un abonnement" onClose={() => { setShowModal(null); setSelectedCardForLink(null); }}>
          <FormulaireLiaisonCarte
            cardId={selectedCardForLink}
            abonnements={abonnements}
            loading={loading}
            onSuccess={async () => { await chargerCartes(); setShowModal(null); setSelectedCardForLink(null); }}
          />
        </Modal>
      )}
      {selectedAbonnementForProfils && token && (
        <ProfilsManager
          utilisateurs={utilisateurs}
          abonnement={selectedAbonnementForProfils}
          onClose={() => setSelectedAbonnementForProfils(null)}
          onUpdate={async () => {
            await chargerAbonnements();
            const updatedAbo = abonnements.find(a => a === selectedAbonnementForProfils._id);
            if (updatedAbo) {
              setSelectedAbonnementForProfils(updatedAbo as Abonnement);
            }
          }}
          token={token}
        />
      )}
      {showModal === 'modifier-abonnement' && selectedAbonnementForEdit && (
        <Modal
          title="Modifier l'Abonnement"
          onClose={() => {
            setShowModal(null);
            setSelectedAbonnementForEdit(null);
          }}
        >
          <FormulaireModificationAbonnement
            abonnement={selectedAbonnementForEdit}
            vendeurs={vendeurs}
            loading={loading}
            onSubmit={modifierAbonnement}
            onCancel={() => {
              setShowModal(null);
              setSelectedAbonnementForEdit(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;