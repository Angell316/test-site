import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeDetailClient from '@/components/AnimeDetailClient'
import { getAnimeById, getSimilarAnime, normalizeAnime, getTopAnime, getPopularAnime } from '@/lib/animeDatabase'
import Link from 'next/link'

// Генерация статических параметров для популярных страниц (пререндеринг)
// Это ускорит загрузку топ-500 аниме
export async function generateStaticParams() {
  try {
    // Получаем топ-500 популярных аниме для пререндеринга
    const topAnime = getTopAnime(250)
    const popularAnime = getPopularAnime(250)
    
    // Объединяем и убираем дубликаты
    const combined = [...topAnime, ...popularAnime]
    const uniqueIds = new Set(combined.map(anime => anime.id))
    
    console.log(`📦 Пререндеринг ${uniqueIds.size} страниц аниме...`)
    
    return Array.from(uniqueIds).map(id => ({
      id: String(id)
    }))
  } catch (error) {
    console.error('❌ Ошибка генерации статических параметров:', error)
    return []
  }
}

// Разрешить динамические параметры для не-пререндеренных страниц
export const dynamicParams = true

// ISR: ревалидация каждые 24 часа
export const revalidate = 86400

// Генерация метаданных для SEO
export async function generateMetadata({ params }) {
  const rawAnime = getAnimeById(params.id)
  const anime = rawAnime ? normalizeAnime(rawAnime) : null
  
  if (!anime) {
    return {
      title: 'Аниме не найдено | AnimeVerse',
    }
  }
  
  return {
    title: `${anime.title} | AnimeVerse`,
    description: anime.description || `Смотреть ${anime.title} онлайн`,
  }
}

export default function AnimeDetailPage({ params }) {
  const rawAnime = getAnimeById(params.id)
  const anime = rawAnime ? normalizeAnime(rawAnime) : null

  if (!anime) {
    return (
      <main className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Header />
        <div className="text-center pt-32">
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
