import { useState, useEffect } from 'react';
import { Phone, Mail, User, CheckCircle, Download, Clock, AlertCircle, Check } from 'lucide-react';
import type { Abonnement, FormData, Step } from '../../types';
import { MOCK_ABONNEMENTS } from '../../components/client/mock';
import { OnboardingScreen } from '../client/onboarding/OnboardingScreen';
import { Header } from './Header';
import { ProgressSteps } from './ProgressSteps';
import { ServiceCard } from './ServiceCard';
import { FormInput } from './FormInput';
import { Alert } from '../client/Alert';
import { API_URL } from '../../types';

interface ClientAppProps {
  onSwitchToAdmin: () => void;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  payment_url?: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

export const ClientApp = ({ onSwitchToAdmin }: ClientAppProps) => {
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [selectedAbo, setSelectedAbo] = useState<Abonnement | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>(() => sessionStorage.getItem("onboardingSeen") === "true" ? 'browse' : 'onboarding');
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    telephone: '',
    email: '',
    methodePaiement: 'MTN MONEY'
  });
  const [error, setError] = useState('');
  const [numeroCommande, setNumeroCommande] = useState('');
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  useEffect(() => {
    if (step === 'browse') {
      const loadAbonnements = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/abonnements/public`);
          if (response.ok) {
            const data = await response.json();
            setAbonnements(data);
          } else {
            setAbonnements(MOCK_ABONNEMENTS.filter(a => a.actif));
          }
        } catch (error) {
          console.log('Erreur chargement abonnements:', error);
          setAbonnements(MOCK_ABONNEMENTS.filter(a => a.actif));
        }
        setLoading(false);
      };
      loadAbonnements();
    }
  }, [step]);

  // Nettoyer l'intervalle de polling lors du démontage
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleOnboardingComplete = () => {
    sessionStorage.setItem("onboardingSeen", "true");
    setStep('browse');
  };

  const handleSelectAbonnement = (abo: Abonnement) => {
    setSelectedAbo(abo);
    setStep('form');
    setError('');
  };

  const handleSubmitCommande = async () => {
    if (!formData.nom || !formData.telephone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!selectedAbo) return;

    const placesDisponibles = selectedAbo.slots - selectedAbo.utilises;
    if (placesDisponibles <= 0) {
      setError('Plus de places disponibles pour cet abonnement');
      return;
    }

    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setNumeroCommande(`SM${randomId}`);
    setStep('payment');
  };

  // Fonction pour initier le paiement via Monetbil
  const initiatePayment = async () => {
    if (!selectedAbo) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/paiements/achat-abonnement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAbo.prix,
          methodPay: formData.methodePaiement,
          phone: formData.telephone
        })
      });

      const data: PaymentResponse = await response.json();

      if (data.success && data.paymentId) {
        startPaymentVerification(data.paymentId);
      } else {
        setError(data.message || 'Erreur lors de l\'initiation du paiement');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      setError('Erreur de connexion au service de paiement');
      setLoading(false);
    }
  };

  // Fonction pour vérifier le statut du paiement (polling)
  const startPaymentVerification = (paymentIdToCheck: string) => {
    let attemptCount = 0;
    const maxAttempts = 60; // 5 minutes (60 * 5 secondes)

    const interval = setInterval(async () => {
      attemptCount++;

      try {
        const response = await fetch(`${API_URL}/paiements/verifier-paiement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId: paymentIdToCheck,
            amount: selectedAbo?.prix
          })
        });

        const data: PaymentVerificationResponse = await response.json();

        if (data.success) {
          // Paiement réussi
          clearInterval(interval);
          setPollingInterval(null);
          await createUser();
        } else if (attemptCount >= maxAttempts) {
          // Timeout après 5 minutes
          clearInterval(interval);
          setPollingInterval(null);
          setLoading(false);
          setError('Délai de paiement expiré. Veuillez réessayer.');
        }
      } catch (error) {
        console.error('Erreur vérification:', error);
        if (attemptCount >= maxAttempts) {
          clearInterval(interval);
          setPollingInterval(null);
          setLoading(false);
          setError('Erreur lors de la vérification du paiement');
        }
      }
    }, 5000); // Vérifier toutes les 5 secondes

    setPollingInterval(interval);
  };

  // Fonction pour créer l'utilisateur après paiement réussi
  const createUser = async () => {
    if (!selectedAbo) return;

    try {
      const response = await fetch(`${API_URL}/utilisateurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Ajouter le token si nécessaire
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nom: formData.nom,
          telephone: formData.telephone,
          email: formData.email,
          abonnementId: selectedAbo._id
        })
      });

      if (response.ok) {
        setLoading(false);
        setStep('success');
      } else {
        const errorData = await response.json();
        setLoading(false);
        setError(errorData.message || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      setLoading(false);
      setError('Erreur lors de la création du compte');
    }
  };

  if (step === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} onSkip={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header onSwitchToAdmin={onSwitchToAdmin} />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {step !== 'browse' && <ProgressSteps currentStep={step} />}

        {/* Browse Step */}
        {step === 'browse' && (
          <div>
            <div className="text-center mb-8 sm:mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Nos abonnements premium
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                Choisissez parmi notre sélection d'abonnements et profitez immédiatement de vos services préférés
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {abonnements.map(abo => (
                  <ServiceCard key={abo._id} abonnement={abo} onSelect={handleSelectAbonnement} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && selectedAbo && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Informations du souscripteur</h2>
                <p className="text-indigo-100 text-sm sm:text-base">Complétez le formulaire pour finaliser votre abonnement</p>
              </div>

              <div className="p-4 sm:p-8">
                <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-indigo-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Abonnement sélectionné</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{selectedAbo.service}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Prix</p>
                      <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
                        {selectedAbo.prix.toLocaleString()} <span className="text-base sm:text-lg">FCFA</span>
                      </p>
                    </div>
                  </div>
                </div>

                {error && <Alert message={error} />}

                <div className="space-y-4 sm:space-y-6">
                  <FormInput
                    label="Nom complet"
                    icon={User}
                    required
                    type="text"
                    placeholder="Jean Dupont"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  />

                  <FormInput
                    label="Numéro de téléphone"
                    icon={Phone}
                    required
                    type="tel"
                    placeholder="+242 06 123 45 67"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />

                  <FormInput
                    label="Email (optionnel)"
                    icon={Mail}
                    type="email"
                    placeholder="jean.dupont@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                      Mode de paiement
                    </label>
                    <select
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 font-medium text-sm sm:text-base"
                      value={formData.methodePaiement}
                      onChange={(e) => setFormData({ ...formData, methodePaiement: e.target.value })}
                    >
                      <option value="MTN MONEY">📱 MTN Mobile Money</option>
                      <option value="AIRTEL MONEY">📱 Airtel Money</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8">
                  <button
                    onClick={() => { setStep('browse'); setError(''); }}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all text-sm sm:text-base"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleSubmitCommande}
                    disabled={loading}
                    className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3.5 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {loading ? 'Traitement...' : 'Continuer vers le paiement'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {step === 'payment' && selectedAbo && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                    <Phone size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold">Confirmation de paiement</h2>
                    <p className="text-indigo-100 text-xs sm:text-sm">Commande #{numeroCommande}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-8">
                <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-indigo-200">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Service</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{selectedAbo.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Montant</p>
                      <p className="text-lg sm:text-2xl font-bold text-indigo-600">
                        {selectedAbo.prix.toLocaleString()} <span className="text-sm">FCFA</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-indigo-200 text-xs sm:text-sm">
                    <p className="text-gray-700 mb-1"><strong>Téléphone:</strong> {formData.telephone}</p>
                    <p className="text-gray-700"><strong>Mode:</strong> {formData.methodePaiement}</p>
                  </div>
                </div>

                {error && <Alert message={error} />}

                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full mb-4 sm:mb-6 animate-pulse">
                      <Phone className="text-indigo-600" size={32} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Demande de paiement envoyée
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                      Veuillez vérifier votre téléphone et confirmer le paiement
                    </p>

                    <div className="bg-blue-50 rounded-xl p-4 sm:p-6 max-w-md mx-auto mb-4 sm:mb-6">
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Phone className="text-blue-600 shrink-0 mt-1" size={20} />
                        <div className="text-left">
                          <p className="font-bold text-blue-900 mb-2 text-sm sm:text-base">Sur votre téléphone :</p>
                          <ol className="text-xs sm:text-sm text-blue-800 space-y-1">
                            <li>1. Vous allez recevoir une notification USSD</li>
                            <li>2. Vérifiez le montant: <strong>{selectedAbo.prix.toLocaleString()} FCFA</strong></li>
                            <li>3. Entrez votre code PIN pour confirmer</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs sm:text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-indigo-600 border-t-transparent"></div>
                      <span>En attente de confirmation...</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-indigo-200">
                      <div className="flex items-start space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <div className="bg-indigo-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl font-bold shrink-0">
                          📱
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                            Paiement Mobile Money
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            En cliquant sur "Payer maintenant", vous allez recevoir une notification sur votre téléphone <strong>{formData.telephone}</strong> pour confirmer le paiement.
                          </p>

                          <div className="bg-white rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                            <div className="flex items-center space-x-2">
                              <Check size={16} className="text-emerald-600" />
                              <span className="text-gray-700">Montant: <strong>{selectedAbo.prix.toLocaleString()} FCFA</strong></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check size={16} className="text-emerald-600" />
                              <span className="text-gray-700">Pas de frais supplémentaires</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check size={16} className="text-emerald-600" />
                              <span className="text-gray-700">Transaction sécurisée</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-400 p-3 sm:p-4 rounded-r-xl mb-4 sm:mb-6">
                      <div className="flex items-start">
                        <AlertCircle className="text-amber-600 mr-2 sm:mr-3 shrink-0 mt-0.5" size={18} />
                        <div className="text-xs sm:text-sm text-amber-800">
                          <p className="font-bold mb-1">Informations importantes</p>
                          <ul className="list-disc list-inside space-y-0.5 sm:space-y-1">
                            <li>Assurez-vous d'avoir le solde suffisant</li>
                            <li>La notification apparaîtra dans quelques secondes</li>
                            <li>Conservez: <strong>#{numeroCommande}</strong></li>
                            <li>Identifiants envoyés après validation</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={() => setStep('form')}
                        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all text-sm sm:text-base"
                      >
                        Retour
                      </button>
                      <button
                        onClick={initiatePayment}
                        className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
                      >
                        <CheckCircle size={18} />
                        <span>Payer maintenant</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-linear-to-r from-emerald-500 to-teal-500 p-6 sm:p-8 text-center text-white">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce">
                  <CheckCircle className="text-emerald-600" size={32} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Paiement confirmé !</h2>
                <p className="text-emerald-100 text-sm sm:text-base">Votre abonnement est en cours de traitement</p>
              </div>

              <div className="p-4 sm:p-8">
                <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-indigo-200">
                  <div className="text-center mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Numéro de commande</p>
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600 font-mono">#{numeroCommande}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="text-center p-2 sm:p-3 bg-white rounded-lg">
                      <p className="text-gray-600 mb-1">Service</p>
                      <p className="font-bold text-gray-900">{selectedAbo?.service}</p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white rounded-lg">
                      <p className="text-gray-600 mb-1">Montant</p>
                      <p className="font-bold text-indigo-600">{selectedAbo?.prix.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-start space-x-2 sm:space-x-3 bg-blue-50 p-3 sm:p-4 rounded-xl">
                    <div className="bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Validation du paiement</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Notre équipe a validé votre paiement</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 sm:space-x-3 bg-purple-50 p-3 sm:p-4 rounded-xl">
                    <div className="bg-purple-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Envoi des identifiants</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Vous recevrez vos accès par SMS sous 1 min</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 sm:space-x-3 bg-emerald-50 p-3 sm:p-4 rounded-xl">
                    <div className="bg-emerald-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Profitez de votre abonnement</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Connectez-vous et profitez immédiatement</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 sm:p-4 rounded-r-xl mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-amber-800">
                    <strong>💡 Conseil:</strong> Prenez une capture d'écran de cette page et conservez votre numéro de commande pour toute assistance.
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => console.log('Téléchargement du reçu')}
                    className="inline-flex items-center space-x-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl mb-4 sm:mb-6"
                  >
                    <Download size={18} />
                    <span>Télécharger le reçu</span>
                  </button>

                  <div className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm space-y-1.5 sm:space-y-2 px-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock size={14} className="text-indigo-600 sm:w-4 sm:h-4" />
                      <span>Vos identifiants seront envoyés sous 24h maximum</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Support disponible : support@subsmanager.com | +242 06 123 45 67
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {!loading && (
        <footer className="bg-white shadow py-2 sm:py-3 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">
                © {new Date().getFullYear()} Subs. Powered by OVFA - Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ClientApp;