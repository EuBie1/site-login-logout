import { useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'

import { auth } from '../../services/firebaseConnection'
import { signOut } from 'firebase/auth'
import { removeUserFromStorage } from '../../utils/auth'

export function Header() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await signOut(auth)
      removeUserFromStorage()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="w-full max-w-2xl mt-4 px-2 sm:px-4">
      <nav
        className="w-full bg-white h-12 sm:h-14 flex items-center justify-between rounded-md px-3 sm:px-4"
        aria-label="Navegação principal"
      >
        <div className="flex gap-3 sm:gap-4 font-medium text-sm sm:text-base">
          <Link
            to="/"
            className="hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
          >
            Home
          </Link>
          <Link
            to="/admin"
            className="hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
          >
            Links
          </Link>
          <Link
            to="/admin/social"
            className="hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
          >
            Redes sociais
          </Link>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="p-1 rounded transition-all duration-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Fazer logout"
          title="Fazer logout"
        >
          <BiLogOut size={24} color="#db2629" />
        </button>
      </nav>
    </header>
  )
}