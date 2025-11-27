import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import type { Abonnement, Stats } from '../types';
import { SkeletonStatsCards } from './Skeleton';

const DashboardContent = ({ stats, abonnements, isLoadingData }: { stats: Stats; abonnements: Abonnement[]; isLoadingData: boolean }) => {
  if (isLoadingData) {
    return <SkeletonStatsCards />;
  }
  const statsCards = [
    {
      title: 'Utilisateurs Actifs',
      value: stats.totalUtilisateurs,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Revenus du Mois',
      value: `${stats.revenusMois.toLocaleString()} FCFA`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Commissions',
      value: `${stats.commissionsTotal.toLocaleString()} FCFA`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Paiements en Attente',
      value: stats.paiementsEnAttente,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white card-rounded shadow-lg transition-transform duration-300 overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl">
              <div className={`h-2 bg-linear-to-r ${stat.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={stat.textColor} size={24} />
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {stats.paiementsEnAttente > 0 && (
        <div className="bg-linear-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-xl shadow-md">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-500 mr-4 shrink-0" size={24} />
            <div>
              <p className="font-bold text-gray-800 mb-2">⚠️ Alertes Importantes</p>
              <p className="text-sm text-gray-700 mb-1">• {stats.paiementsEnAttente} paiement(s) en attente de validation</p>
              <p className="text-sm text-gray-700">• {abonnements.filter(a => a.utilises >= a.slots - 1).length} compte(s) presque saturé(s)</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Aperçu Rapide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Total Abonnements</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalAbonnements}</p>
          </div>
          <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Taux d'occupation</p>
            <p className="text-3xl font-bold text-green-600">{
              abonnements.length > 0
                ? Math.round((abonnements.reduce((acc, a) => acc + a.utilises, 0) / abonnements.reduce((acc, a) => acc + a.slots, 0)) * 100)
                : 0
            }%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
