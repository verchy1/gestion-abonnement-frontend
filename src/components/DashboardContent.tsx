import { Users, DollarSign, TrendingUp, AlertCircle, Activity, Zap, Target, Crown } from 'lucide-react';
import type { Abonnement, Stats } from '../types';
import { SkeletonStatsCards } from './Skeleton';

const DashboardContent = ({ stats, abonnements, isLoadingData }: { stats: Stats; abonnements: Abonnement[]; isLoadingData: boolean }) => {
  if (isLoadingData) {
    return <SkeletonStatsCards />;
  }

  const tauxOccupation = abonnements.length > 0
    ? Math.round((abonnements.reduce((acc, a) => acc + a.utilises, 0) / abonnements.reduce((acc, a) => acc + a.slots, 0)) * 100)
    : 0;

  const statsCards = [
    {
      title: 'Utilisateurs Actifs',
      value: stats.totalUtilisateurs,
      icon: Users,
      gradient: 'from-blue-500 via-blue-600 to-cyan-600',
      iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      iconColor: 'text-blue-600',
      trend: '+12%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Revenus du Mois',
      value: `${stats.revenusMois.toLocaleString()} FCFA`,
      icon: DollarSign,
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      iconColor: 'text-emerald-600',
      trend: '+8%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Commissions',
      value: `${stats.commissionsTotal.toLocaleString()} FCFA`,
      icon: TrendingUp,
      gradient: 'from-purple-500 via-violet-600 to-purple-600',
      iconBg: 'bg-gradient-to-br from-purple-100 to-violet-100',
      iconColor: 'text-purple-600',
      trend: '+15%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Paiements en Attente',
      value: stats.paiementsEnAttente,
      icon: AlertCircle,
      gradient: 'from-rose-500 via-red-600 to-pink-600',
      iconBg: 'bg-gradient-to-br from-rose-100 to-pink-100',
      iconColor: 'text-rose-600',
      trend: stats.paiementsEnAttente > 0 ? 'Action requise' : 'À jour',
      trendColor: stats.paiementsEnAttente > 0 ? 'text-red-600' : 'text-green-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section avec titre */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="text-white" size={32} />
            <h2 className="text-3xl font-black text-white">Tableau de Bord</h2>
          </div>
          <p className="text-indigo-100 text-lg">Vue d'ensemble de votre activité en temps réel</p>
        </div>
      </div>

      {/* Stats Cards Grid - Premium Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-105"
            >
              {/* Gradient top bar with animation */}
              <div className={`h-1.5 bg-gradient-to-r ${stat.gradient} group-hover:h-2 transition-all duration-300`}></div>
              
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative p-6">
                {/* Icon with enhanced design */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`relative p-4 rounded-2xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}></div>
                    <Icon className={`${stat.iconColor} relative z-10`} size={28} strokeWidth={2.5} />
                  </div>
                  <Zap className="text-gray-300 group-hover:text-yellow-400 transition-colors duration-300" size={20} />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{stat.title}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                    <span className={`text-xs font-bold ${stat.trendColor} bg-green-50 px-2 py-1 rounded-full`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Section - Enhanced Design */}
      {stats.paiementsEnAttente > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-l-4 border-amber-400 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 bg-amber-100 rounded-xl">
                <AlertCircle className="text-amber-600" size={28} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-black text-gray-900 text-lg">Alertes Importantes</h3>
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                    {stats.paiementsEnAttente + abonnements.filter(a => a.utilises >= a.slots - 1).length}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p className="text-sm font-semibold">{stats.paiementsEnAttente} paiement(s) en attente de validation</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="text-sm font-semibold">{abonnements.filter(a => a.utilises >= a.slots - 1).length} compte(s) presque saturé(s)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Overview Section - Enhanced Design */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Abonnements */}
        <div className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-500"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Target className="text-blue-600" size={28} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Actif</span>
            </div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Total Abonnements</p>
            <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {stats.totalAbonnements}
            </p>
          </div>
        </div>

        {/* Taux d'occupation */}
        <div className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Activity className="text-green-600" size={28} strokeWidth={2.5} />
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                tauxOccupation >= 80 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
              }`}>
                {tauxOccupation >= 80 ? 'Élevé' : 'Normal'}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-2">Taux d'occupation</p>
            <div className="flex items-end space-x-2">
              <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {tauxOccupation}%
              </p>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  tauxOccupation >= 80 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                style={{ width: `${tauxOccupation}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="relative group bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Crown className="text-yellow-300" size={28} strokeWidth={2.5} />
              </div>
              <Zap className="text-yellow-300 animate-pulse" size={24} />
            </div>
            <p className="text-sm text-purple-100 font-semibold uppercase tracking-wider mb-2">Performance</p>
            <p className="text-4xl font-black text-white mb-2">Excellent</p>
            <p className="text-sm text-purple-200">Votre activité est optimale</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;