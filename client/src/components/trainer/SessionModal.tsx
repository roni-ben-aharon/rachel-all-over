interface SessionModalProps {
  onSave: () => void
  onCancel: () => void
  saving: boolean
}

export function SessionModal({ onSave, onCancel, saving }: SessionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" data-testid="end-session-modal">
      <div className="bg-white rounded-xl w-80 shadow-xl">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-medium">End session</p>
          <p className="text-xs text-gray-500 mt-1">Save today's session to history?</p>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <button
            data-testid="confirm-save-session-btn"
            onClick={onSave}
            disabled={saving}
            className="w-full py-2.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save session'}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
