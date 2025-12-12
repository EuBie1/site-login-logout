/**
 * Utilitários para validação de formulários
 */

/**
 * Valida se um email tem formato válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida se uma URL tem formato válido
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valida se uma string não está vazia (após trim)
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Valida campos obrigatórios de um objeto
 */
export function validateRequiredFields(
  fields: Record<string, string>
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = []

  Object.entries(fields).forEach(([key, value]) => {
    if (!isNotEmpty(value)) {
      missingFields.push(key)
    }
  })

  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

