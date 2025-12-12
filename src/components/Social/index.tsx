import type { ReactNode } from 'react'

interface SocialProps {
  url: string
  children: ReactNode
  ariaLabel?: string
}

/**
 * Componente para links de redes sociais com acessibilidade
 */
export function Social({ url, children, ariaLabel }: SocialProps) {
  if (!url) {
    return null
  }

  return (
    <a
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={ariaLabel || 'Abrir rede social em nova aba'}
      className="transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
    >
      {children}
    </a>
  )
}