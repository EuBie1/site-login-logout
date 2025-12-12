import { useEffect, useState } from 'react'

import { Social } from '../../components/Social'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { db } from '../../services/firebaseConnection'
import {
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc,
} from 'firebase/firestore'
import type { LinkProps, SocialLinksProps } from '../../types'

export function Home() {
  const [links, setLinks] = useState<LinkProps[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLinksProps>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function loadLinks() {
      const linksRef = collection(db, 'links')
      const queryRef = query(linksRef, orderBy('created', 'asc'))

      getDocs(queryRef)
        .then((snapshot) => {
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
        })
        .catch((error) => {
          console.error('Erro ao carregar links:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    loadLinks()
  }, [])

  useEffect(() => {
    function loadSocialLinks() {
      const docRef = doc(db, 'social', 'link')

      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.exists() && snapshot.data()) {
            const data = snapshot.data()
            setSocialLinks({
              facebook: data.facebook || '',
              instagram: data.instagram || '',
              youtube: data.youtube || '',
            })
          }
        })
        .catch((error) => {
          console.error('Erro ao carregar redes sociais:', error)
        })
    }

    loadSocialLinks()
  }, [])

  const hasSocialLinks =
    socialLinks &&
    (socialLinks.facebook || socialLinks.instagram || socialLinks.youtube)

  return (
    <div className="flex flex-col w-full min-h-screen py-4 items-center justify-center px-4">
      <header className="text-center mb-8 mt-8 sm:mt-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Sujeito Programador
        </h1>
        <p className="text-gray-50 mb-5 mt-3 text-base sm:text-lg">
          Veja meus links 👇
        </p>
      </header>

      <main className="flex flex-col w-full max-w-xl text-center">
        {isLoading ? (
          <p className="text-white text-lg" aria-live="polite">
            Carregando links...
          </p>
        ) : links.length === 0 ? (
          <p className="text-gray-400 text-lg" aria-live="polite">
            Nenhum link disponível no momento.
          </p>
        ) : (
          <nav aria-label="Links principais">
            <ul className="flex flex-col gap-4">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 rounded-lg select-none transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                    style={{
                      backgroundColor: link.bg,
                      color: link.color,
                    }}
                    aria-label={`Abrir link: ${link.name}`}
                  >
                    <span className="text-base sm:text-lg font-medium">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {hasSocialLinks && (
          <footer className="flex justify-center gap-4 sm:gap-6 my-8" aria-label="Redes sociais">
            {socialLinks.facebook && (
              <Social url={socialLinks.facebook} ariaLabel="Abrir perfil do Facebook">
                <FaFacebook size={32} color="#FFF" />
              </Social>
            )}

            {socialLinks.youtube && (
              <Social url={socialLinks.youtube} ariaLabel="Abrir canal do YouTube">
                <FaYoutube size={32} color="#FFF" />
              </Social>
            )}

            {socialLinks.instagram && (
              <Social url={socialLinks.instagram} ariaLabel="Abrir perfil do Instagram">
                <FaInstagram size={32} color="#FFF" />
              </Social>
            )}
          </footer>
        )}
      </main>
    </div>
  )
}