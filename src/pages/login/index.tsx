import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { auth } from '../../services/firebaseConnection'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { isValidEmail, isNotEmpty } from '../../utils/validation'
import { ERROR_MESSAGES } from '../../utils/errorMessages'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    // Validação de campos vazios
    if (!isNotEmpty(email) || !isNotEmpty(password)) {
      setError(ERROR_MESSAGES.REQUIRED_FIELDS)
      return
    }

    // Validação de email
    if (!isValidEmail(email)) {
      setError(ERROR_MESSAGES.INVALID_EMAIL)
      return
    }

    setIsLoading(true)

    signInWithEmailAndPassword(auth, email.trim(), password)
      .then(() => {
        navigate('/admin', { replace: true })
      })
      .catch((error) => {
        console.error('Erro ao fazer login:', error)
        setError(ERROR_MESSAGES.LOGIN_ERROR)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="flex w-full min-h-screen items-center justify-center flex-col px-4 py-8">
      <Link to="/" className="mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
        <h1 className="text-white mb-7 font-bold text-4xl sm:text-5xl text-center">
          Dev
          <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
            Link
          </span>
        </h1>
      </Link>

      <main className="w-full max-w-xl">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col"
          noValidate
          aria-label="Formulário de login"
        >
          {error && (
            <div
              className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200 text-sm"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <Input
            label="Email"
            placeholder="Digite o seu email..."
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            autoComplete="email"
            required
            disabled={isLoading}
            aria-required="true"
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha..."
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(null)
            }}
            autoComplete="current-password"
            required
            disabled={isLoading}
            aria-required="true"
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Acessar
          </Button>
        </form>
      </main>
    </div>
  )
}
