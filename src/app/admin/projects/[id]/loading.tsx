export default function EditProjectLoading() {
  return (
    <div className="p-8 max-w-3xl animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-3 bg-gray-100 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="mb-6 pb-5 border-b border-gray-100 flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-3.5 w-64 bg-gray-100 rounded" />
          </div>
          <div className="h-7 w-28 bg-gray-100 rounded-lg" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-100 p-1.5 rounded-2xl">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex-1 h-9 bg-gray-200 rounded-xl" />
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-11 bg-gray-100 rounded-xl" />
            </div>
          ))}
          <div className="grid grid-cols-5 gap-3 mt-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100">
          <div className="h-11 w-36 bg-gray-100 rounded-xl" />
          <div className="h-11 w-40 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
