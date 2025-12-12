import { useState, type FormEvent, useEffect } from 'react'

import { Header } from '../../components/Header'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { db } from '../../services/firebaseConnection'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { isValidUrl } from '../../utils/validation'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/errorMessages'

export function Networks() {
  const [facebook, setFacebook] = useState('')
  const [instagram, setInstagram] = useState('')
  const [youtube, setYoutube] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    function loadLinks() {
      const docRef = doc(db, 'social', 'link')
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.exists() && snapshot.data()) {
            const data = snapshot.data()
            setFacebook(data.facebook || '')
            setInstagram(data.instagram || '')
            setYoutube(data.youtube || '')
          }
        })
        .catch((error) => {
          console.error('Erro ao carregar redes sociais:', error)
        })
        .finally(() => {
          setIsLoadingData(false)
        })
    }

    loadLinks()
  }, [])

  function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validação de URLs (se preenchidas, devem ser válidas)
    const urls = [
      { name: 'Facebook', value: facebook },
      { name: 'Instagram', value: instagram },
      { name: 'YouTube', value: youtube },
    ]

    for (const url of urls) {
      if (url.value.trim() && !isValidUrl(url.value.trim())) {
        setError(`${ERROR_MESSAGES.INVALID_URL} (${url.name})`)
        return
      }
    }

    setIsLoading(true)

    setDoc(
      doc(db, 'social', 'link'),
      {
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
      },
      { merge: true }
    )
      .then(() => {
        setSuccess(SUCCESS_MESSAGES.SAVE_SUCCESS)
        setTimeout(() => setSuccess(null), 3000)
      })
      .catch((error) => {
        console.error('Erro ao salvar:', error)
        setError(ERROR_MESSAGES.SAVE_ERROR)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center flex-col min-h-screen pb-7 px-2 sm:px-4">
        <Header />
        <p className="text-white text-lg mt-8" aria-live="polite">
          Carregando...
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2 sm:px-4">
      <Header />

      <main className="w-full max-w-xl">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mt-8 mb-6 text-center">
          Minhas redes sociais
        </h1>

        <form
          className="flex flex-col"
          onSubmit={handleRegister}
          noValidate
          aria-label="Formulário de redes sociais"
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

          {success && (
            <div
              className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-200 text-sm"
              role="alert"
              aria-live="polite"
            >
              {success}
            </div>
          )}

          <label htmlFor="facebook-url" className="text-white font-medium mt-2 mb-2">
            Link do Facebook
          </label>
          <Input
            id="facebook-url"
            label="Link do Facebook"
            type="url"
            placeholder="Digite a URL do Facebook..."
            value={facebook}
            onChange={(e) => {
              setFacebook(e.target.value)
              setError(null)
            }}
            disabled={isLoading}
            error={
              facebook.trim() && !isValidUrl(facebook.trim())
                ? ERROR_MESSAGES.INVALID_URL
                : undefined
            }
          />

          <label htmlFor="instagram-url" className="text-white font-medium mt-2 mb-2">
            Link do Instagram
          </label>
          <Input
            id="instagram-url"
            label="Link do Instagram"
            type="url"
            placeholder="Digite a URL do Instagram..."
            value={instagram}
            onChange={(e) => {
              setInstagram(e.target.value)
              setError(null)
            }}
            disabled={isLoading}
            error={
              instagram.trim() && !isValidUrl(instagram.trim())
                ? ERROR_MESSAGES.INVALID_URL
                : undefined
            }
          />

          <label htmlFor="youtube-url" className="text-white font-medium mt-2 mb-2">
            Link do YouTube
          </label>
          <Input
            id="youtube-url"
            label="Link do YouTube"
            type="url"
            placeholder="Digite a URL do YouTube..."
            value={youtube}
            onChange={(e) => {
              setYoutube(e.target.value)
              setError(null)
            }}
            disabled={isLoading}
            error={
              youtube.trim() && !isValidUrl(youtube.trim())
                ? ERROR_MESSAGES.INVALID_URL
                : undefined
            }
          />

          <Button type="submit" isLoading={isLoading} className="w-full mb-7">
            Salvar links
          </Button>
        </form>
      </main>
    </div>
  )
}