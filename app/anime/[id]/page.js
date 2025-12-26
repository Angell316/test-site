import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeDetailClient from '@/components/AnimeDetailClient'
import { getAnimeById, getSimilarAnime, normalizeAnime } from '@/lib/animeDatabase'
import Link from 'next/link'

export default function AnimeDetailPage({ params }) {
  const rawAnime = getAnimeById(params.id)
  const anime = rawAnime ? normalizeAnime(rawAnime) : null

  if (!anime) {
    return (
      <main className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Header />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Аниме не найдено</h1>
          <Link href="/anime" className="text-crimson-primary hover:text-crimson-light">
            Вернуться к каталогу
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const relatedAnime = getSimilarAnime(anime.id, 6)

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      <AnimeDetailClient anime={anime} relatedAnime={relatedAnime} />
      <Footer />
    </main>
  )
}
