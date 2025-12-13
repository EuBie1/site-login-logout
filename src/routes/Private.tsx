import { ReactNode, useState, useEffect, ReactElement } from 'react'

import { auth } from '../services/firebaseConnection'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
import { formatUserData, saveUserToStorage } from '../utils/auth'

interface PrivateProps {
  children: ReactNode
}

/**
 * Componente que protege rotas privadas, verificando autenticação
 */
export function Private({ children }: PrivateProps): ReactElement {
  const [loading, setLoading] = useState(true)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = formatUserData(user)
        if (userData) {
          saveUserToStorage(userData)
        }
        setSigned(true)
      } else {
        setSigned(false)
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        role="status"
        aria-live="polite"
      >
        <p className="text-white text-lg">Carregando...</p>
        <span className="sr-only">Verificando autenticação...</span>
      </div>
    )
  }

  if (!signed) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}