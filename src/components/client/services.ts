import { Film, Banknote, Zap, Key } from 'lucide-react';
import type { OnboardingSlide } from '../../types';

export const SERVICE_AVANTAGES: Record<string, string[]> = {
  'Netflix': ['Contenu illimité en HD/4K', 'Films et séries originaux', 'Profils multiples', 'Téléchargement hors ligne'],
  'Spotify': ['Musique sans publicité', '100M+ de chansons', 'Mode hors ligne', 'Qualité audio premium'],
  'Disney+': ['Marvel, Star Wars, Pixar', 'Contenu famille premium', '4K HDR disponible', 'Profils pour enfants'],
  'Prime Video': ['Films et séries Amazon', 'Livraison gratuite incluse', 'Streaming 4K', 'Contenus exclusifs'],
  'YouTube Premium': ['Sans publicité', 'Lecture en arrière-plan', 'YouTube Music inclus', 'Téléchargement vidéos'],
  'Apple Music': ['100M+ de chansons', 'Audio spatial', 'Paroles en temps réel', 'Radio en direct']
};

export const SERVICE_LOGOS: Record<string, string> = {
  'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'Spotify': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
  'Disney+': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
  'Prime Video': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
  'YouTube Premium': 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
  'Apple Music': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg'
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  { 
    icon: Film, 
    title: 'Tous vos services préférés', 
    description: 'Accédez à Netflix, Spotify, Disney+ et bien plus encore à prix réduit', 
    color: 'from-purple-500 to-indigo-600' 
  },
  { 
    icon: Banknote, 
    title: 'Prix imbattables', 
    description: 'Économisez jusqu\'à 70% en accedant à un abonnement partagé premium', 
    color: 'from-purple-500 to-indigo-600' 
  },
  { 
    icon: Zap, 
    title: 'Activation instantanée', 
    description: 'Recevez vos identifiants juste apres le paiement et commencez à profiter immédiatement', 
    color: 'from-purple-500 to-indigo-600' 
  },
  { 
    icon: Key, 
    title: 'Paiement 100% sécurisé', 
    description: 'Mobile Money avec Airtel et MTN - Simple, rapide et sécurisé', 
    color: 'from-purple-500 to-indigo-600' 
  }
];