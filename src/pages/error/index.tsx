import { Link } from 'react-router-dom'
import { Button } from '../../components/Button'

export function ErrorPage() {
  return (
    <div className="flex w-full min-h-screen justify-center items-center flex-col text-white px-4">
      <main className="text-center">
        <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl mb-2" aria-label="Erro 404">
          404
        </h1>
        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
          Página não encontrada
        </h2>
        <p className="italic text-base sm:text-lg mb-6 sm:mb-8 text-gray-300">
          Você caiu em uma página que não existe!
        </p>

        <Link to="/" className="inline-block">
          <Button className="w-full sm:w-auto">
            Voltar para home
          </Button>
        </Link>
      </main>
    </div>
  )
}