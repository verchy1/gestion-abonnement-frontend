import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, LogOut, Menu, X, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* HEADER MODERNE */}
      <header className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo et titre */}
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-2xl shadow-lg transform transition-transform duration-200 hover:scale-105">
                <DollarSign className="text-indigo-600" size={30} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">SubsManager</h1>
                <p className="text-xs text-indigo-100 hidden sm:block">Gestion d'Abonnements</p>
              </div>
            </div>

            {/* Actions desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white font-medium">Admin</p>
                <p className="text-xs text-indigo-100">En ligne</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>

            {/* Menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu mobile dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg"
              >
                <LogOut size={18} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* NAVIGATION MODERNE */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: TrendingUp },
              { id: 'abonnements', label: 'Abonnements', icon: DollarSign },
              { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
              { id: 'vendeurs', label: 'Vendeurs', icon: Users },
              { id: 'cartes', label: 'Cartes prépayées', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-700 shadow-md'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        {/* CARTES PRÉPAYÉES */}
        {activeTab === 'cartes' && (
          <CartesContent
            cartes={cartes}
            setShowModal={setShowModal}
            supprimerCarte={supprimerCarte}
            loading={loading}
            onLinkClick={(id: string) => { setSelectedCardForLink(id); setShowModal('link'); }}
          />
        )}
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
