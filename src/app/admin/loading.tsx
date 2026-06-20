export default function AdminLoading() {
  return (
    <div className="p-8 max-w-6xl animate-pulse">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-7 w-40 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-9 w-40 bg-gray-200 rounded-xl" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="h-3 w-16 bg-gray-100 rounded mb-3" />
            <div className="h-8 w-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-10 bg-gray-50 border-b border-gray-100" />
        <div className="divide-y divide-gray-50">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-48 bg-gray-200 rounded" />
                <div className="h-3 w-28 bg-gray-100 rounded" />
              </div>
              <div className="h-5 w-20 bg-gray-100 rounded-md" />
              <div className="h-5 w-20 bg-gray-100 rounded-full" />
              <div className="h-3.5 w-24 bg-gray-100 rounded" />
              <div className="h-3.5 w-16 bg-gray-100 rounded" />
              <div className="flex gap-1.5 ml-auto">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="h-7 w-14 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
