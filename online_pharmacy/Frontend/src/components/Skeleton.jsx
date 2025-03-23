export const MedicineSkeleton = () => (
    <div className="animate-pulse bg-gray-100 rounded-lg p-4">
      <div className="h-40 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
  
  export const OrderSkeleton = () => (
    <div className="animate-pulse bg-gray-100 rounded-lg p-6 mb-6">
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-8 bg-gray-200 rounded-full"></div>
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );