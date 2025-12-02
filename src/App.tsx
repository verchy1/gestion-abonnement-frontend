import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, LogOut, Menu, X, Users, RefreshCcw, CreditCard, User } from 'lucide-react';
import './App.css';

// Imports des types
import { API_URL } from './types';
import type { Abonnement, Admin, CartePrepayee } from './types';

// Imports des composants
import PageConnexion from './components/PageConnexion';
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

const App = () => {
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
  // État pour les données du profil
  const [adminProfile, setAdminProfile] = useState<Admin | null>(null);

  // 🆕 NOUVEAU : État pour gérer le modal des profils
  const [selectedAbonnementForProfils, setSelectedAbonnementForProfils] = useState<Abonnement | null>(null);

  // Fonction pour rafraîchir les données
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

      // Récupérer le PDF sous forme de blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Télécharger automatiquement
      const a = document.createElement("a");
      a.href = url;
      a.download = `recu_${userId}.pdf`;
      a.click();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de générer le reçu");
    }
  };



  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  // Charger les données quand l'utilisateur est connecté
  useEffect(() => {
    if (isLoggedIn && token) {
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
          if (profileRes && profileRes.ok) setAdminProfile(await profileRes.json()); // NOUVEAU
        } catch (error) {
          console.error('Erreur chargement données:', error);
        } finally {
          setIsLoadingData(false);
        }
      };
      loadData();
    }
  }, [isLoggedIn, token]);

  // Headers pour les requêtes API
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  // Charger le profil de l'admin
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

  // Mettre à jour le profil
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

  // Changer le mot de passe
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

  // Charger les abonnements
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

  // Charger les utilisateurs
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

  // Charger les statistiques
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

  // Charger les cartes prépayées
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

  // Ajouter un abonnement
  const ajouterAbonnement = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);
      console.log('📤 Données envoyées:', data); // DEBUG

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
        console.error('❌ Erreur backend:', errorData); // DEBUG
        alert(`Erreur: ${errorData.message || 'Erreur inconnue'}\nDétails: ${errorData.error || ''}`);
      }
    } catch (error) {
      console.error('Erreur ajout abonnement:', error);
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un utilisateur
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

  // Toggle paiement utilisateur
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

  // Supprimer un item
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

  // Supprimer une carte prépayée
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

  // 🆕 NOUVELLE FONCTION : Modifier le solde d'une carte
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

  // 🆕 NOUVELLE FONCTION : Supprimer un abonnement d'une carte
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

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setIsLoggedIn(false);
    setAbonnements([]);
    setUtilisateurs([]);
    setVendeurs([]);
  };

  // Formater les dates
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Si pas connecté, afficher la page de connexion
  if (!isLoggedIn) {
    return <PageConnexion setIsLoggedIn={setIsLoggedIn} setToken={setToken} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* HEADER PREMIUM */}
      <header className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl shadow-md">
              <img src="/subsManager logo.svg" alt="SubsManager Logo" width={30} height={30} />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-wide">SubsManager</h1>
          </div>

          {/* Actions desktop */}
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-700 text-white py-3 px-4 space-y-3">
            <button onClick={refreshData} className="w-full bg-indigo-500 py-2 rounded-lg">Rafraîchir</button>
            <button onClick={handleLogout} className="w-full bg-white text-indigo-600 py-2 rounded-lg">Déconnexion</button>
          </div>
        )}
      </header>

      {/* NAVIGATION MODERNE AVEC GLASSMORPHISM */}
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
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all
          ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50'
                }
        `}
            >
              <tab.icon size={18} />
              <span className="font-medium whitespace-nowrap">{tab.label}</span>
            </button>
          ))}

        </div>
      </nav>


      {/* CONTENU PRINCIPAL AVEC ANIMATIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardContent
              stats={stats}
              abonnements={abonnements}
              isLoadingData={isLoadingData}
            />
          )}

          {/* ABONNEMENTS */}
          {activeTab === 'abonnements' && (
            <AbonnementsContent
              abonnements={abonnements}
              setShowModal={setShowModal}
              supprimerItem={supprimerItem}
              loading={loading}
              isLoadingData={isLoadingData}
              onGererProfils={(abonnement: Abonnement) => setSelectedAbonnementForProfils(abonnement)}
            />
          )}

          {/* UTILISATEURS */}
          {activeTab === 'utilisateurs' && (
            <UtilisateursContent
              utilisateurs={utilisateurs}
              setShowModal={setShowModal}
              togglePaiement={togglePaiement}
              supprimerItem={supprimerItem}
              loading={loading}
              isLoadingData={isLoadingData}
              formatDate={formatDate}
              genererRecu={genererRecu}   // 🆕
            />
          )}

          {/* VENDEURS */}
          {activeTab === 'vendeurs' && (
            <VendeursContent vendeurs={vendeurs} />
          )}

          {/* CARTES PRÉPAYÉES - 🆕 AVEC LES NOUVELLES PROPS */}
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

          {/* MON PROFIL */}
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
          <FormulaireAbonnement
            ajouterAbonnement={ajouterAbonnement}
            vendeurs={vendeurs}
            loading={loading}
          />
        </Modal>
      )}
      {showModal === 'utilisateur' && (
        <Modal title="Ajouter un Utilisateur" onClose={() => setShowModal(null)}>
          <FormulaireUtilisateur
            ajouterUtilisateur={ajouterUtilisateur}
            abonnements={abonnements}
            loading={loading}
          />
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

      {/* 🆕 NOUVEAU : Modal du gestionnaire de profils */}
      {selectedAbonnementForProfils && token && (
        <ProfilsManager
          utilisateurs={utilisateurs}
          abonnement={selectedAbonnementForProfils}
          onClose={() => setSelectedAbonnementForProfils(null)}
          onUpdate={async () => {
            await chargerAbonnements();
            // Mettre à jour l'abonnement sélectionné avec les nouvelles données
            const updatedAbo = abonnements.find(a => a === selectedAbonnementForProfils._id);
            if (updatedAbo) {
              setSelectedAbonnementForProfils(updatedAbo as Abonnement);
            }
          }}
          token={token}
        />
      )}
    </div>
  );
};

export default App;