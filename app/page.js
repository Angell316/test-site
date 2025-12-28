import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import OngoingSection from '@/components/OngoingSection'
import TrendingSection from '@/components/TrendingSection'
import MoviesSection from '@/components/MoviesSection'
import SeriesSection from '@/components/SeriesSection'
import GenresSection from '@/components/GenresSection'
import { getHomePageData, getOngoingAnime } from '@/lib/animeDatabase'

// Статическая генерация главной страницы
export const revalidate = 3600 // Ревалидация каждый час

// Метаданные для SEO
export const metadata = {
  title: 'AnimeVerse - Смотреть аниме онлайн',
  description: 'Большая коллекция аниме онлайн. Фильмы, сериалы, онгоинги - всё в одном месте!',
}

export default function Home() {
  const homeData = getHomePageData()
  
  // Получаем реальные данные из базы
  const bannerAnime = homeData.featured.slice(0, 5)
  const ongoingAnime = getOngoingAnime(10)
  const trendingAnime = homeData.trending.slice(0, 10)

  return (
    <main className="min-h-screen">
      <Header />
      <HeroBanner anime={bannerAnime} />
      <OngoingSection anime={ongoingAnime} />
      <TrendingSection anime={trendingAnime} />
      <MoviesSection />
      <SeriesSection />
      <GenresSection />
      <Footer />
    </main>
  )
}
