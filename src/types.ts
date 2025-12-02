// Types partagés pour l'application
export interface Profil {
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

export interface Abonnement {
  _id: string;
  service: string;
  prix: number;
  slots: number;
  utilises: number;
  proprio: string;
  vendeurId?: string;
  emailService?: string;
  prixFournisseur?: number;
  profils?: Profil[]; // 🆕 NOUVEAU
  credentials?: {
    email: string;
    password: string;
  };
}

export interface Utilisateur {
  _id: string;
  nom: string;
  telephone: string;
  email?: string;
  abonnementId?: { service: string };
  dateFin: string;
  montant: number;
  paye: boolean;
}

export interface Vendeur {
  _id: string;
  nom: string;
  telephone: string;
  email?: string;
  commission: number;
  actif?: boolean;
}

export interface CartePrepayee {
  _id: string;
  code: string;
  solde: number;
  abonnements?: { service: string; dateFin: string; emailService?: string; prixFournisseur?: number }[];
}

export interface Stats {
  totalUtilisateurs: number;
  totalAbonnements: number;
  revenusMois: number;
  commissionsTotal: number;
  paiementsEnAttente: number;
}

export interface Admin {
  _id: string;
  identifiant: string;
  nom: string;
  email: string;
  telephone?: string;
  role: string;
  dateCreation: string;
}

// export const API_URL = 'http://localhost:5000/api';
export const API_URL = 'https://gestion-abonnement-backend.onrender.com/api';