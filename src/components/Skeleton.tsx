// Composant Skeleton réutilisable pour les états de chargement

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="h-2 bg-gray-200 rounded-full mb-4 w-24"></div>
    <div className="flex items-center justify-between mb-4">
      <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded mb-3 w-32"></div>
    <div className="h-8 bg-gray-200 rounded mb-4 w-20"></div>
  </div>
);

export const SkeletonAbonnementCard = () => (
  <div className="bg-white card-rounded shadow-lg p-6 animate-pulse">
    <div className="bg-gray-200 h-16 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-3"></div>
    <div className="h-4 bg-gray-200 rounded mb-3 w-24"></div>
    <div className="h-2 bg-gray-200 rounded-full mb-4"></div>
    <div className="h-10 bg-gray-200 rounded-lg"></div>
  </div>
);

export const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-12"></div>
    </td>
  </tr>
);

export const SkeletonMobileCard = () => (
  <div className="p-4 border-b border-gray-200 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-28"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-6 w-6 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export const SkeletonStatsCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonAbonnementCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <SkeletonAbonnementCard key={i} />
    ))}
  </div>
);

export const SkeletonTable = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="animate-pulse">
            <th className="px-6 py-4 text-left"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="px-6 py-4 text-left"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="px-6 py-4 text-left"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="px-6 py-4 text-left"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="px-6 py-4 text-left"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="px-6 py-4 text-left"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="px-6 py-4 text-left"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
    
    <div className="lg:hidden divide-y divide-gray-200">
      {[...Array(5)].map((_, i) => (
        <SkeletonMobileCard key={i} />
      ))}
    </div>
  </div>
);
