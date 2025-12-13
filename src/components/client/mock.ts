import type { Abonnement } from '../../types';

export const MOCK_ABONNEMENTS: Abonnement[] = [
  { 
    _id: '1', 
    service: 'Netflix', 
    prix: 2500, 
    slots: 4, 
    utilises: 2, 
    proprio: 'Admin', 
    emailService: 'netflix@test.com',
    prixFournisseur: 1800,
    vendeurId: 'v1',
    profils: [],
    credentials: {
      email: 'netflix@test.com',
      password: 'password123'
    },
    actif: true 
  },
  { 
    _id: '2', 
    service: 'Spotify', 
    prix: 1800, 
    slots: 5, 
    utilises: 4, 
    proprio: 'Admin',
    emailService: 'spotify@test.com',
    prixFournisseur: 1500,
    vendeurId: 'v2',
    profils: [],
    credentials: {
      email: 'spotify@test.com',
      password: 'password123'
    },
    actif: true 
  },
  { 
    _id: '3', 
    service: 'Disney+', 
    prix: 2200, 
    slots: 4, 
    utilises: 4,
    proprio: 'Admin',
    emailService: 'disney@test.com',
    prixFournisseur: 1700,
    vendeurId: 'v3',
    profils: [],
    credentials: {
      email: 'disney@test.com',
      password: 'password123'
    },
    actif: true 
  },
  { 
    _id: '4', 
    service: 'Prime Video', 
    prix: 1500, 
    slots: 3, 
    utilises: 1,
    proprio: 'Admin', 
    emailService: 'prime@test.com',
    prixFournisseur: 1200,
    vendeurId: 'v4',
    profils: [],
    credentials: {
      email: 'prime@test.com',
      password: 'password123'
    },
    actif: true 
  },
  { 
    _id: '5', 
    service: 'YouTube Premium', 
    prix: 2000, 
    slots: 5, 
    utilises: 0,
    proprio: 'Admin', 
    emailService: 'youtube@test.com',
    prixFournisseur: 1500,
    vendeurId: 'v5',
    profils: [],
    credentials: {
      email: 'youtube@test.com',
      password: 'password123'
    },
    actif: true 
  },
  { 
    _id: '6', 
    service: 'Apple Music', 
    prix: 2000, 
    slots: 5, 
    utilises: 0,
    proprio: 'Admin', 
    emailService: 'applemusic@test.com',
    prixFournisseur: 1500,
    vendeurId: 'v5',
    profils: [],
    credentials: {
      email: 'youtube@test.com',
      password: 'password123'
    },
    actif: true 
  }
];
