import type { FC } from "react";
import {
  Plus,
  DollarSign,
  Trash2,
  Users,
  Mail,
  AlertTriangle,
} from "lucide-react";
import type { Abonnement } from "../types";
import { SkeletonAbonnementCards } from "./Skeleton";

interface Props {
  abonnements: Abonnement[];
  setShowModal: (value: string | null) => void;
  supprimerItem: (type: string, id: string) => Promise<void>;
  loading: boolean;
  isLoadingData: boolean;
}

const AbonnementsContent: FC<Props> = ({
  abonnements,
  setShowModal,
  supprimerItem,
  loading,
  isLoadingData,
}) => {
  if (isLoadingData) {
    return <SkeletonAbonnementCards />;
  }

  // Statistiques (gardez des valeurs sûres)
  const totalSlots = abonnements.reduce((acc, abo) => acc + (abo.slots || 0), 0);
  const totalUtilises = abonnements.reduce((acc, abo) => acc + (abo.utilises || 0), 0);
  const revenuTotal = abonnements.reduce((acc, abo) => acc + (abo.prix || 0), 0);

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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
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

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Places totales</p>
                <p className="text-lg font-bold text-gray-900">
                  {totalUtilises}/{totalSlots}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <span className="text-purple-600 text-sm font-semibold">{overallPercent}%</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Taux global</p>
                <p className="text-lg font-bold text-gray-900">{overallPercent}%</p>
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
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        percent >= 90
                          ? "bg-red-500/20 text-red-300 border-red-400/30"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                      }`}
                    >
                      {percent}%
                    </span>
                  </div>

                  <p className="text-indigo-200 mt-2">{a.prix} FCFA</p>
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

                  {/* Email */}
                  <div className="flex items-center space-x-2 text-sm text-gray-700 border p-3 rounded-xl bg-gray-50">
                    <Mail size={16} className="text-gray-500" />
                    <span className="truncate">{a.emailService}</span>
                  </div>

                  {/* Alerte */}
                  {percent >= 90 && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-medium">Cet abonnement est presque plein !</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 pb-5 flex space-x-2">
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AbonnementsContent;
