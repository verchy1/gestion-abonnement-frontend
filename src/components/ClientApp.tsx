import { useState, useEffect } from 'react';
import { Banknote, Users, CheckCircle, CreditCard, Phone, Mail, User, ShoppingCart, AlertCircle, Shield, Lock, Clock, ArrowRight, Check, Download, Film, Zap, Key } from 'lucide-react';

// Avantages par service
const SERVICE_AVANTAGES: Record<string, string[]> = {
    'Netflix': [
        'Contenu illimité en HD/4K',
        'Films et séries originaux',
        'Profils multiples',
        'Téléchargement hors ligne'
    ],
    'Spotify': [
        'Musique sans publicité',
        '100M+ de chansons',
        'Mode hors ligne',
        'Qualité audio premium'
    ],
    'Disney+': [
        'Marvel, Star Wars, Pixar',
        'Contenu famille premium',
        '4K HDR disponible',
        'Profils pour enfants'
    ],
    'Prime Video': [
        'Films et séries Amazon',
        'Livraison gratuite incluse',
        'Streaming 4K',
        'Contenus exclusifs'
    ],
    'YouTube Premium': [
        'Sans publicité',
        'Lecture en arrière-plan',
        'YouTube Music inclus',
        'Téléchargement vidéos'
    ],
    'Apple Music': [
        '100M+ de chansons',
        'Audio spatial',
        'Paroles en temps réel',
        'Radio en direct'
    ]
};

// Logos des services
const SERVICE_LOGOS: Record<string, string> = {
    'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    'Spotify': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    'Disney+': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
    'Prime Video': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
    'YouTube Premium': 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    'Apple Music': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg'
};

interface Abonnement {
    _id: string;
    service: string;
    prix: number;
    slots: number;
    utilises: number;
    emailService: string;
    actif: boolean;
}

// 🧪 DONNÉES DE TEST
const MOCK_ABONNEMENTS: Abonnement[] = [
    {
        _id: '1',
        service: 'Netflix',
        prix: 2500,
        slots: 4,
        utilises: 2,
        emailService: 'netflix@test.com',
        actif: true
    },
    {
        _id: '2',
        service: 'Spotify',
        prix: 1800,
        slots: 5,
        utilises: 4,
        emailService: 'spotify@test.com',
        actif: true
    },
    {
        _id: '3',
        service: 'Disney+',
        prix: 2200,
        slots: 4,
        utilises: 4,
        emailService: 'disney@test.com',
        actif: true
    },
    {
        _id: '4',
        service: 'Prime Video',
        prix: 1500,
        slots: 3,
        utilises: 1,
        emailService: 'prime@test.com',
        actif: true
    },
    {
        _id: '5',
        service: 'YouTube Premium',
        prix: 2000,
        slots: 5,
        utilises: 0,
        emailService: 'youtube@test.com',
        actif: true
    }
];

const ClientApp = ({ onSwitchToAdmin }: { onSwitchToAdmin: () => void }) => {
    const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
    const [selectedAbo, setSelectedAbo] = useState<Abonnement | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'onboarding' | 'browse' | 'form' | 'payment' | 'success'>('onboarding');
    const [onboardingStep, setOnboardingStep] = useState(0);

    const [formData, setFormData] = useState({
        nom: '',
        telephone: '',
        email: '',
        methodePaiement: 'Mobile Money'
    });

    const [error, setError] = useState('');
    const [numeroCommande, setNumeroCommande] = useState('');

    // Slides d'onboarding
    const onboardingSlides = [
        {
            icon: <Film size={48} color='white' />,
            title: 'Tous vos services préférés',
            description: 'Accédez à Netflix, Spotify, Disney+ et bien plus encore à prix réduit',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            icon: <Banknote size={48} color='white' />,
            title: 'Prix imbattables',
            description: 'Économisez jusqu\'à 70% en partageant un abonnement premium',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            icon: <Zap size={48} color='white' />,
            title: 'Activation instantanée',
            description: 'Recevez vos identifiants sous 24h et commencez à profiter immédiatement',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            icon: <Key size={48} color='white' />,
            title: 'Paiement 100% sécurisé',
            description: 'Mobile Money avec Airtel et MTN - Simple, rapide et sécurisé',
            color: 'from-purple-500 to-indigo-600'
        }
    ];

    const currentSlide = onboardingSlides[onboardingStep];

    const nextOnboardingStep = () => {
        if (onboardingStep < onboardingSlides.length - 1) {
            setOnboardingStep(onboardingStep + 1);
        } else {
            setStep('browse');
            localStorage.setItem("onboardingSeen", "true"); // <-- ICI
            chargerAbonnements();
        }
    };

    const skipOnboarding = () => {
        localStorage.setItem("onboardingSeen", "true"); // <-- ICI AUSSI
        setStep('browse');
        chargerAbonnements();
    };

    // sauvegarde de la session du onboarding
    useEffect(() => {
        const dejaVu = localStorage.getItem("onboardingSeen");

        if (dejaVu === "true") {
            setStep("browse");
            chargerAbonnements();
        }
    }, []);


    const chargerAbonnements = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setAbonnements(MOCK_ABONNEMENTS.filter(a => a.actif));
        setLoading(false);
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

        setLoading(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 1200));

        const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        setNumeroCommande(`SM${randomId}`);

        setLoading(false);
        setStep('payment');
    };

    const handleConfirmPayment = async () => {
        setLoading(true);
        setError('');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setStep('success');
    };

    const telechargerRecu = () => {
        console.log("Done")
    };

    const placesDisponibles = (abo: Abonnement) => abo.slots - abo.utilises;



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Onboarding moderne */}
            {step === 'onboarding' && (
                <div className="min-h-screen flex flex-col bg-white">
                    {/* Header avec bouton Skip */}
                    <div className="p-4 sm:p-6 flex justify-between items-center">
                        <div className="w-16 sm:w-24"></div>
                        <button
                            onClick={skipOnboarding}
                            className="text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors"
                        >
                            Passer
                        </button>
                    </div>

                    {/* Contenu principal */}
                    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-8 sm:pb-12">
                        {/* Icône animée */}
                        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${currentSlide.color} flex items-center justify-center mb-6 sm:mb-8 shadow-2xl animate-bounce`}>
                            {currentSlide.icon}
                        </div>

                        {/* Titre et description */}
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-3 sm:mb-4 max-w-sm px-4">
                            {currentSlide.title}
                        </h1>
                        <p className="text-gray-600 text-center text-base sm:text-lg max-w-md leading-relaxed px-4">
                            {currentSlide.description}
                        </p>
                    </div>

                    {/* Footer avec indicateurs et bouton */}
                    <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                        {/* Indicateurs de progression */}
                        <div className="flex justify-center space-x-2">
                            {onboardingSlides.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === onboardingStep
                                        ? 'w-8 bg-indigo-600'
                                        : 'w-2 bg-gray-300'
                                        }`}
                                ></div>
                            ))}
                        </div>

                        {/* Bouton */}
                        <div className='flex items-center justify-center'>
                            <button
                                onClick={nextOnboardingStep}
                                className={`w-full max-w-md bg-gradient-to-r ${currentSlide.color} text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
                            >
                                {onboardingStep < onboardingSlides.length - 1 ? 'Suivant' : 'Commencer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step !== 'onboarding' && (
                <>
                    {/* Header Premium */}
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="bg-gradient-to-br from-indigo-400 to-purple-300 p-2 sm:p-2.5 rounded-xl shadow-lg">
                                        <ShoppingCart size={20} className="sm:w-7 sm:h-7" />
                                    </div>

                                    <div>
                                        <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Subs
                                        </h1>
                                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium hidden sm:block">Votre plateforme d'abonnements</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onSwitchToAdmin}
                                    className="flex items-center justify-center space-x-1 sm:space-x-2 bg-indigo-600 hover:bg-indigo-700 px-3 sm:px-4 py-2 rounded-full text-white text-xs sm:text-sm font-semibold transition-all"
                                >
                                    <User size={14} className="sm:w-4 sm:h-4" />
                                    <span className='hidden sm:inline'>Espace Admin</span>
                                    <span className='sm:hidden'>Admin</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
                        {/* Progress Steps */}
                        {step !== 'browse' && (
                            <div className="mb-6 sm:mb-8 overflow-x-auto">
                                <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max px-4">
                                    {[
                                        { id: 'form', label: 'Informations', icon: User },
                                        { id: 'payment', label: 'Paiement', icon: CreditCard },
                                        { id: 'success', label: 'Confirmation', icon: CheckCircle }
                                    ].map((s, i) => {
                                        const isActive = s.id === step;
                                        const isPast = ['form', 'payment', 'success'].indexOf(step) > i;
                                        return (
                                            <div key={s.id} className="flex items-center">
                                                <div className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg' :
                                                    isPast ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    <s.icon size={14} />
                                                    <span className="text-xs sm:text-sm font-semibold hidden sm:inline">{s.label}</span>
                                                </div>
                                                {i < 2 && (
                                                    <ArrowRight className={`mx-1 sm:mx-2 ${isPast ? 'text-emerald-500' : 'text-gray-300'}`} size={16} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Étape 1: Browse */}
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
                                        {abonnements.map(abo => {
                                            const places = placesDisponibles(abo);
                                            const isAvailable = places > 0;
                                            const pourcentage = Math.round((abo.utilises / abo.slots) * 100);

                                            return (
                                                <div
                                                    key={abo._id}
                                                    className={`group bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 ${isAvailable ? 'hover:-translate-y-1' : 'opacity-75'
                                                        }`}
                                                >
                                                    <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-6 text-white overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white opacity-10 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20"></div>
                                                        <div className="relative">
                                                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl p-1.5 sm:p-2 shadow-lg flex items-center justify-center">
                                                                        <img
                                                                            src={SERVICE_LOGOS[abo.service] || 'https://via.placeholder.com/40'}
                                                                            alt={abo.service}
                                                                            className="w-full h-full object-contain"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                                const parent = e.currentTarget.parentElement;
                                                                                if (parent) {
                                                                                    parent.innerHTML = `<div class="text-indigo-600 font-bold text-lg sm:text-xl">${abo.service[0]}</div>`;
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-lg sm:text-2xl font-bold">{abo.service}</h3>
                                                                </div>
                                                                {isAvailable && (
                                                                    <span className="bg-emerald-400 text-emerald-900 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full">
                                                                        DISPO
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-baseline space-x-1">
                                                                <span className="text-2xl sm:text-4xl font-bold">{abo.prix.toLocaleString()}</span>
                                                                <span className="text-indigo-200 text-xs sm:text-sm">FCFA</span>
                                                            </div>
                                                            <p className="text-indigo-200 text-xs sm:text-sm mt-1">par mois</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 border border-gray-200">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-xs sm:text-sm font-semibold text-gray-700">Disponibilité</span>
                                                                <span className="text-[10px] sm:text-xs font-bold text-gray-500">{pourcentage}% occupé</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-2 sm:mb-3">
                                                                <div
                                                                    className={`h-2 sm:h-2.5 rounded-full transition-all ${pourcentage >= 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                                        pourcentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                                                            'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                                                        }`}
                                                                    style={{ width: `${pourcentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-1 sm:space-x-2">
                                                                    <Users className="text-indigo-600" size={16} />
                                                                    <span className="text-xs sm:text-sm text-gray-600">Places</span>
                                                                </div>
                                                                <span className={`text-sm sm:text-base font-bold ${places > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                                    {places} / {abo.slots}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                                                            {(SERVICE_AVANTAGES[abo.service] || [
                                                                'Accès complet au service',
                                                                'Support client 24/7',
                                                                'Qualité premium',
                                                                'Sans engagement'
                                                            ]).map((avantage, idx) => (
                                                                <div key={idx} className="flex items-center space-x-2">
                                                                    <Check size={14} className="text-emerald-500 shrink-0 sm:w-4 sm:h-4" />
                                                                    <span className="text-xs sm:text-sm">{avantage}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {!isAvailable ? (
                                                            <button
                                                                disabled
                                                                className="w-full bg-gray-200 text-gray-500 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold cursor-not-allowed"
                                                            >
                                                                Complet
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleSelectAbonnement(abo)}
                                                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg group-hover:scale-105"
                                                            >
                                                                Souscrire maintenant
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Étape 2: Formulaire */}
                        {step === 'form' && selectedAbo && (
                            <div className="max-w-3xl mx-auto">
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
                                        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Informations du souscripteur</h2>
                                        <p className="text-indigo-100 text-sm sm:text-base">Complétez le formulaire pour finaliser votre abonnement</p>
                                    </div>

                                    <div className="p-4 sm:p-8">
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-indigo-200">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Abonnement sélectionné</p>
                                                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{selectedAbo.service}</p>
                                                </div>
                                                <div className="sm:text-right">
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Prix</p>
                                                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{selectedAbo.prix.toLocaleString()} <span className="text-base sm:text-lg">FCFA</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 flex items-center text-sm">
                                                <AlertCircle size={18} className="mr-2 shrink-0" />
                                                <span className="font-medium">{error}</span>
                                            </div>
                                        )}

                                        <div className="space-y-4 sm:space-y-6">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Nom complet <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <User className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" size={18} />
                                                    <input type="text" placeholder="Jean Dupont" className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 text-sm sm:text-base" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Numéro de téléphone <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" size={18} />
                                                    <input type="tel" placeholder="+242 06 123 45 67" className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 text-sm sm:text-base" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} required />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Email (optionnel)</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400" size={18} />
                                                    <input type="email" placeholder="jean.dupont@email.com" className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 text-sm sm:text-base" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Mode de paiement</label>
                                                <select className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 font-medium text-sm sm:text-base" value={formData.methodePaiement} onChange={(e) => setFormData({ ...formData, methodePaiement: e.target.value })}>
                                                    <option value="Mobile Money">📱 Mobile Money (Airtel / MTN)</option>
                                                    <option value="Cash">💵 Paiement en espèces</option>
                                                    <option value="Virement">🏦 Virement bancaire</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 sm:pt-8">
                                            <button onClick={() => { setStep('browse'); setError(''); }} className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all text-sm sm:text-base">Retour</button>
                                            <button onClick={handleSubmitCommande} disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3.5 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base">{loading ? 'Traitement...' : 'Continuer vers le paiement'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Étape 3: Paiement */}
                        {step === 'payment' && selectedAbo && (
                            <div className="max-w-3xl mx-auto">
                                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
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
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-indigo-200">
                                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Service</p>
                                                    <p className="text-base sm:text-lg font-bold text-gray-900">{selectedAbo.service}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Montant</p>
                                                    <p className="text-lg sm:text-2xl font-bold text-indigo-600">{selectedAbo.prix.toLocaleString()} <span className="text-sm">FCFA</span></p>
                                                </div>
                                            </div>
                                            <div className="pt-3 sm:pt-4 border-t border-indigo-200 text-xs sm:text-sm">
                                                <p className="text-gray-700 mb-1"><strong>Téléphone:</strong> {formData.telephone}</p>
                                                <p className="text-gray-700"><strong>Mode:</strong> {formData.methodePaiement}</p>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 flex items-center text-sm">
                                                <AlertCircle size={18} className="mr-2 shrink-0" />
                                                <span className="font-medium">{error}</span>
                                            </div>
                                        )}

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
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-indigo-200">
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
                                                        onClick={handleConfirmPayment}
                                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
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

                        {/* Étape 4: Succès */}
                        {step === 'success' && (
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 sm:p-8 text-center text-white">
                                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce">
                                            <CheckCircle className="text-emerald-600" size={32} />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Paiement confirmé !</h2>
                                        <p className="text-emerald-100 text-sm sm:text-base">Votre abonnement est en cours de traitement</p>
                                    </div>

                                    <div className="p-4 sm:p-8">
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-indigo-200">
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
                                                    <p className="text-xs sm:text-sm text-gray-600">Notre équipe vérifie votre paiement</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-2 sm:space-x-3 bg-purple-50 p-3 sm:p-4 rounded-xl">
                                                <div className="bg-purple-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold shrink-0">
                                                    2
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Envoi des identifiants</h4>
                                                    <p className="text-xs sm:text-sm text-gray-600">Vous recevrez vos accès par SMS et Email sous 24h</p>
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
                                                onClick={telechargerRecu}
                                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl mb-4 sm:mb-6"
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

                    {/* Footer */}
                    <footer className="bg-white shadow py-2 sm:py-3 mt-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center">
                                <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500">© {new Date().getFullYear()} Subs. Powered by OVFA - Tous droits réservés.</p>
                            </div>
                        </div>
                    </footer>
                </>
            )}
        </div>
    );
};

export default ClientApp;