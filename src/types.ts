// Types partagés pour l'application
export interface Abonnement {
  _id: string;
  service: string;
  prix: number;
  slots: number;
  utilises: number;
  proprio: string;
  vendeurId?: string;
  emailService?: string;
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
  abonnements?: { service: string; dateFin: string; emailService?: string }[];
}

export interface Stats {
  totalUtilisateurs: number;
  totalAbonnements: number;
  revenusMois: number;
  commissionsTotal: number;
  paiementsEnAttente: number;
}

export const API_URL = 'https://gestion-abonnement-backend.onrender.com/api';