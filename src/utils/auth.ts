/**
 * Utilitários para autenticação
 */

import { User } from 'firebase/auth'

export interface UserData {
  uid: string
  email: string | null
}

/**
 * Converte um usuário do Firebase para o formato do sistema
 */
export function formatUserData(user: User | null): UserData | null {
  if (!user) return null

  return {
    uid: user.uid,
    email: user.email,
  }
}

/**
 * Salva dados do usuário no localStorage
 */
export function saveUserToStorage(userData: UserData): void {
  localStorage.setItem('@reactlinks', JSON.stringify(userData))
}

/**
 * Remove dados do usuário do localStorage
 */
export function removeUserFromStorage(): void {
  localStorage.removeItem('@reactlinks')
}

/**
 * Obtém dados do usuário do localStorage
 */
export function getUserFromStorage(): UserData | null {
  const stored = localStorage.getItem('@reactlinks')
  if (!stored) return null

  try {
    return JSON.parse(stored) as UserData
  } catch {
    return null
  }
}

