import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

/**
 * Componente de input acessível e responsivo
 * 
 * @param label - Label oculta para acessibilidade (usada quando há placeholder)
 * @param error - Mensagem de erro a ser exibida
 */
export function Input({ label, error, className = '', ...props }: InputProps) {
  const inputId = props.id || `input-${props.name || 'default'}`

  return (
    <div className="w-full mb-3">
      {label && (
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          h-10 w-full rounded-md border bg-white px-3 text-zinc-900 
          placeholder:text-zinc-400 
          transition-all duration-200
          focus:border-blue-500 focus:ring-2 focus:ring-blue-300 
          outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-300' : 'border-zinc-300'}
          ${className}
        `.trim()}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
