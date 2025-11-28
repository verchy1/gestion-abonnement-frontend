import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, LogOut, Menu, X, Users, Sparkles } from 'lucide-react';
import './App.css';

// Imports des types
import { API_URL } from './types';
import type { CartePrepayee } from './types';

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
          const [abonRes, utilRes, vendRes, statsRes, cartesRes] = await Promise.all([
            fetch(`${API_URL}/abonnements`, { headers }),
            fetch(`${API_URL}/utilisateurs`, { headers }),
            fetch(`${API_URL}/vendeurs`, { headers }),
            fetch(`${API_URL}/stats`, { headers }),
            fetch(`${API_URL}/cartes`, { headers })
          ]);

          if (abonRes.ok) setAbonnements(await abonRes.json());
          if (utilRes.ok) setUtilisateurs(await utilRes.json());
          if (vendRes.ok) setVendeurs(await vendRes.json());
          if (statsRes.ok) setStats(await statsRes.json());
          if (cartesRes && cartesRes.ok) setCartes(await cartesRes.json());
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
      const response = await fetch(`${API_URL}/abonnements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await chargerAbonnements();
        await chargerStats();
        setShowModal(null);
      } else {
        alert('Erreur lors de l\'ajout de l\'abonnement');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* HEADER PREMIUM */}
      <header className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 shadow-2xl relative overflow-hidden">
        {/* Effet de brillance animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center py-5">
            {/* Logo et titre avec animation */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-white p-3 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                  <DollarSign className="text-indigo-600" size={32} />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    SubsManager
                  </h1>
                  <Sparkles className="text-yellow-300 animate-pulse" size={20} />
                </div>
                <p className="text-xs text-indigo-100 font-medium hidden sm:block">
                  Gestion intelligente d'abonnements
                </p>
              </div>
            </div>

            {/* Actions desktop avec design premium */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <p className="text-sm text-white font-bold">Administrateur</p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-indigo-100">En ligne</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-xl transition-all duration-300 border border-white/30 hover:border-white/50 hover:shadow-lg hover:scale-105"
              >
                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="font-semibold">Déconnexion</span>
              </button>
            </div>

            {/* Menu mobile amélioré */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu mobile dropdown stylisé */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top duration-300">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* NAVIGATION MODERNE AVEC GLASSMORPHISM */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-3">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
              { id: 'abonnements', label: 'Abonnements', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
              { id: 'utilisateurs', label: 'Utilisateurs', icon: Users, color: 'from-purple-500 to-pink-500' },
              { id: 'vendeurs', label: 'Vendeurs', icon: Users, color: 'from-orange-500 to-red-500' },
              { id: 'cartes', label: 'Cartes prépayées', icon: DollarSign, color: 'from-indigo-500 to-purple-500' }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  <Icon size={20} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
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
              formatDate={formatDate}
              isLoadingData={isLoadingData}
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
    </div>
  );
};

export default App;