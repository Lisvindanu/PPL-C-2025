import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const api = useMemo(() => ({
    show: (message, type = 'info', timeout = 3000) => {
      const id = ++idCounter
      setToasts((t) => [...t, { id, message, type }])
      if (timeout) setTimeout(() => dismiss(id), timeout)
      return id
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow-md text-sm ${
            t.type === 'success' ? 'bg-green-600 text-white' : t.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#D8CCBC] text-[#3A2B2A]'
          }`}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


