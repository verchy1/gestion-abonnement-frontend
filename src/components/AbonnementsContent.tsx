import type { FC } from "react";
import {
  Plus,
  DollarSign,
  Trash2,
  Users,
  Mail,
  AlertTriangle,
  UserCog,
  TrendingUp,
} from "lucide-react";

// Types simplifiés pour la démo
interface Profil {
  _id: string;
  nom: string;
}

interface Abonnement {
  _id: string;
  service: string;
  prix: number;
  slots: number;
  utilises: number;
  proprio: string;
  vendeurId?: string;
  emailService?: string;
  prixFournisseur?: number;
  profils?: Profil[];
  credentials?: {
    email: string;
    password: string;
  };
}

interface Props {
  abonnements: Abonnement[];
  setShowModal: (value: string | null) => void;
  supprimerItem: (type: string, id: string) => Promise<void>;
  loading: boolean;
  isLoadingData: boolean;
  onGererProfils: (abonnement: Abonnement) => void;
}

const AbonnementsContent: FC<Props> = ({
  abonnements,
  setShowModal,
  supprimerItem,
  loading,
  isLoadingData,
  onGererProfils,
}) => {
  if (isLoadingData) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalSlots = abonnements.reduce((acc, abo) => acc + (abo.slots || 0), 0);
  const totalUtilises = abonnements.reduce((acc, abo) => acc + (abo.utilises || 0), 0);

  // 🆕 Calcul du revenu total (prix de vente)
  const revenuTotal = abonnements.reduce(
    (acc, abo) => acc + ((abo.prix || 0) * (abo.utilises || 0)),
    0
  );

  // 🆕 NOUVEAU : Calcul du coût total fournisseur
  // Le coût fournisseur est payé UNE FOIS par abonnement, pas par utilisateur
  const coutFournisseurTotal = abonnements.reduce(
    (acc, abo) => {
      // On paie le prix fournisseur une seule fois, peu importe le nombre d'utilisateurs
      const prixFourn = abo.prixFournisseur || 0;
      return acc + prixFourn;
    },
    0
  );

  // 🆕 NOUVEAU : Calcul du bénéfice net
  const beneficeNet = revenuTotal - coutFournisseurTotal;

  const overallPercent = totalSlots ? Math.round((totalUtilises / totalSlots) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Gestion des Abonnements
            </h2>
            <p className="text-gray-600">
              Administrez vos services et suivez leur utilisation en temps réel
            </p>
          </div>

          <button
            onClick={() => setShowModal("abonnement")}
            className="flex items-center space-x-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            aria-label="Créer un abonnement"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Créer un abonnement</span>
          </button>
        </div>

        {abonnements.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            {/* Revenus totaux */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Revenus totaux
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {revenuTotal.toLocaleString()} FCFA
                </p>
              </div>
            </div>

            {/* 🆕 NOUVEAU : Coût fournisseur */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <DollarSign className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Coût fournisseur
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {coutFournisseurTotal.toLocaleString()} FCFA
                </p>
              </div>
            </div>

            {/* 🆕 NOUVEAU : Bénéfice net */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="text-emerald-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Bénéfice net
                </p>
                <p className="text-lg font-bold text-emerald-600">
                  {beneficeNet.toLocaleString()} FCFA
                </p>
              </div>
            </div>

            {/* Places totales */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Taux global</p>
                <p className="text-lg font-bold text-gray-900">
                  {totalUtilises}/{totalSlots} ({overallPercent}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {abonnements.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="text-gray-400" size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun abonnement</h3>
            <p className="text-gray-500 mb-6">
              Créez un abonnement pour commencer à gérer vos services.
            </p>

            <button
              onClick={() => setShowModal("abonnement")}
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-semibold"
            >
              <Plus size={20} />
              <span>Créer un abonnement</span>
            </button>
          </div>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {abonnements.map((a) => {
            const percent = a.slots ? Math.round(((a.utilises || 0) / a.slots) * 100) : 0;
            const percentColor =
              percent >= 90 ? "text-red-600" : percent >= 60 ? "text-yellow-600" : "text-emerald-600";

            // 🆕 NOUVEAU : Calcul du bénéfice par abonnement
            // 🆕 Correct : Calcul du bénéfice par abonnement
            const revenuAbonnement = (a.prix || 0) * (a.utilises || 0);

            // Le coût fournisseur est payé UNE seule fois
            const coutAbonnement = a.prixFournisseur || 0;

            const beneficeAbonnement = revenuAbonnement - coutAbonnement;


            return (
              <div
                key={a._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
              >
                {/* Header */}
                <div className="relative bg-linear-to-br from-indigo-700 via-indigo-600 to-indigo-800 p-6 text-white">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
                  </div>

                  <div className="relative flex justify-between items-start">
                    <h3 className="text-xl font-bold tracking-wide">{a.service}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${percent >= 90
                          ? "bg-red-500/20 text-red-300 border-red-400/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                        }`}
                    >
                      {percent}%
                    </span>
                  </div>

                  <div className="relative mt-3 space-y-1">
                    <p className="text-indigo-200 text-sm">Prix: {a.prix} FCFA</p>
                    {a.prixFournisseur !== undefined && (
                      <p className="text-indigo-300 text-xs">Coût: {a.prixFournisseur} FCFA</p>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Slots */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 font-medium">Places utilisées</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {a.utilises}/{a.slots}
                        </p>
                      </div>

                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Users size={24} className={percentColor} />
                      </div>
                    </div>
                  </div>

                  {/* 🆕 NOUVEAU : Bénéfice de cet abonnement */}
                  {a.prixFournisseur !== undefined && a.utilises > 0 && (
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-emerald-700 mb-1 font-medium">Bénéfice</p>
                          <p className="text-xl font-bold text-emerald-600">
                            {beneficeAbonnement.toLocaleString()} FCFA
                          </p>
                        </div>
                        <TrendingUp size={20} className="text-emerald-600" />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {a.emailService && (
                    <div className="flex items-center space-x-2 text-sm text-gray-700 border p-3 rounded-xl bg-gray-50">
                      <Mail size={16} className="text-gray-500" />
                      <span className="truncate">{a.emailService}</span>
                    </div>
                  )}

                  {/* Alerte */}
                  {percent >= 90 && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">Abonnement plein !</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 flex space-x-2">
                  <button
                    onClick={() => onGererProfils(a)}
                    className="flex items-center justify-center flex-1 space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2.5 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-200 font-medium"
                  >
                    <UserCog size={16} />
                    <span>Profils</span>
                  </button>

                  <button
                    onClick={() => supprimerItem("abonnement", a._id as string)}
                    disabled={loading}
                    className="flex items-center justify-center flex-1 space-x-2 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 py-2.5 rounded-xl border border-gray-200 hover:border-red-200 transition-all duration-200 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AbonnementsContent;