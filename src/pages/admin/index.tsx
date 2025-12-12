import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'

import { Header } from '../../components/Header'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { FiTrash } from 'react-icons/fi'
import { db } from '../../services/firebaseConnection'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore'
import { isNotEmpty, isValidUrl } from '../../utils/validation'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/errorMessages'
import type { LinkProps } from '../../types'

export function Admin() {
  const [nameInput, setNameInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [textColorInput, setTextColorInput] = useState('#f1f1f1')
  const [backgroundColorInput, setBackgroundColorInput] = useState('#121212')
  const [links, setLinks] = useState<LinkProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const linksRef = collection(db, 'links')
    const queryRef = query(linksRef, orderBy('created', 'asc'))

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        const lista: LinkProps[] = []

        snapshot.forEach((doc) => {
          const data = doc.data()
          lista.push({
            id: doc.id,
            name: data.name,
            url: data.url,
            bg: data.bg,
            color: data.color,
          })
        })

        setLinks(lista)
      },
      (error) => {
        console.error('Erro ao carregar links:', error)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validação
    if (!isNotEmpty(nameInput) || !isNotEmpty(urlInput)) {
      setError(ERROR_MESSAGES.REQUIRED_FIELDS)
      return
    }

    if (!isValidUrl(urlInput)) {
      setError(ERROR_MESSAGES.INVALID_URL)
      return
    }

    setIsLoading(true)

    addDoc(collection(db, 'links'), {
      name: nameInput.trim(),
      url: urlInput.trim(),
      bg: backgroundColorInput,
      color: textColorInput,
      created: new Date(),
    })
      .then(() => {
        setNameInput('')
        setUrlInput('')
        setSuccess(SUCCESS_MESSAGES.SAVE_SUCCESS)
        setTimeout(() => setSuccess(null), 3000)
      })
      .catch((error) => {
        console.error('Erro ao cadastrar:', error)
        setError(ERROR_MESSAGES.SAVE_ERROR)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  async function handleDeleteLink(id: string) {
    if (!confirm('Tem certeza que deseja excluir este link?')) {
      return
    }

    try {
      const docRef = doc(db, 'links', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Erro ao excluir link:', error)
      setError(ERROR_MESSAGES.DELETE_ERROR)
    }
  }

  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2 sm:px-4">
      <Header />

      <main className="w-full max-w-xl">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6 mt-8 text-center">
          Gerenciar Links
        </h1>

        <form
          className="flex flex-col mb-6"
          onSubmit={handleRegister}
          noValidate
          aria-label="Formulário de cadastro de links"
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

          <label htmlFor="link-name" className="text-white font-medium mt-2 mb-2">
            Nome do Link
          </label>
          <Input
            id="link-name"
            label="Nome do Link"
            placeholder="Digite o nome do link..."
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value)
              setError(null)
            }}
            required
            disabled={isLoading}
            aria-required="true"
          />

          <label htmlFor="link-url" className="text-white font-medium mt-2 mb-2">
            URL do Link
          </label>
          <Input
            id="link-url"
            label="URL do Link"
            type="url"
            placeholder="Digite a URL..."
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value)
              setError(null)
            }}
            required
            disabled={isLoading}
            aria-required="true"
          />

          <section className="flex flex-col sm:flex-row my-4 gap-4 sm:gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label
                htmlFor="text-color"
                className="text-white font-medium text-sm sm:text-base"
              >
                Cor do texto
              </label>
              <input
                id="text-color"
                type="color"
                value={textColorInput}
                onChange={(e) => setTextColorInput(e.target.value)}
                className="h-12 w-20 sm:h-12 sm:w-20 cursor-pointer rounded border-2 border-zinc-300"
                aria-label="Selecionar cor do texto"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label
                htmlFor="bg-color"
                className="text-white font-medium text-sm sm:text-base"
              >
                Cor de fundo
              </label>
              <input
                id="bg-color"
                type="color"
                value={backgroundColorInput}
                onChange={(e) => setBackgroundColorInput(e.target.value)}
                className="h-12 w-20 sm:h-12 sm:w-20 cursor-pointer rounded border-2 border-zinc-300"
                aria-label="Selecionar cor de fundo"
              />
            </div>
          </section>

          {isNotEmpty(nameInput) && (
            <div className="flex items-center justify-start flex-col mb-7 p-3 border-gray-100/25 border rounded-md">
              <label className="text-white font-medium mb-3 text-sm sm:text-base">
                Pré-visualização:
              </label>
              <article
                className="w-full flex flex-col items-center justify-center rounded px-4 py-3"
                style={{ backgroundColor: backgroundColorInput }}
                aria-label="Pré-visualização do link"
              >
                <p className="font-medium text-base sm:text-lg" style={{ color: textColorInput }}>
                  {nameInput}
                </p>
              </article>
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full mb-7">
            Cadastrar
          </Button>
        </form>

        <section aria-label="Lista de links cadastrados">
          <h2 className="font-bold text-white mb-4 text-xl sm:text-2xl text-center">
            Meus links
          </h2>

          {links.length === 0 ? (
            <p className="text-gray-400 text-center" aria-live="polite">
              Nenhum link cadastrado ainda.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link.id}>
                  <article
                    className="flex items-center justify-between w-full rounded py-3 px-3 sm:px-4 mb-2 select-none transition-all duration-200"
                    style={{ backgroundColor: link.bg, color: link.color }}
                  >
                    <p className="text-sm sm:text-base font-medium flex-1 truncate mr-2">
                      {link.name}
                    </p>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 rounded transition-all duration-200 hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label={`Excluir link: ${link.name}`}
                      title="Excluir link"
                    >
                      <FiTrash size={18} color={link.color} />
                    </button>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}