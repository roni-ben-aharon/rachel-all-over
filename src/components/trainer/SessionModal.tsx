interface SessionModalProps {
  onSaveNew: () => void
  onOverwrite: () => void
  onCancel: () => void
  hasExisting: boolean
  saving: boolean
}

export function SessionModal({ onSaveNew, onOverwrite, onCancel, hasExisting, saving }: SessionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-80 shadow-xl">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-medium">End session</p>
          <p className="text-xs text-gray-500 mt-1">How would you like to save this session?</p>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <button
            onClick={onSaveNew}
            disabled={saving}
            className="w-full py-2.5 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            Save as new version
          </button>
          {hasExisting && (
            <button
              onClick={onOverwrite}
              disabled={saving}
              className="w-full py-2.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Edit last session
            </button>
          )}
          <button onClick={onCancel} disabled={saving} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
