export default function NewProjectLoading() {
  return (
    <div className="p-8 max-w-3xl animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex gap-1 mb-8 bg-gray-100 p-1.5 rounded-2xl">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex-1 h-9 bg-gray-200 rounded-xl" />
          ))}
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <div className="h-3 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-11 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100">
          <div className="h-11 w-36 bg-gray-100 rounded-xl" />
          <div className="h-11 w-40 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
