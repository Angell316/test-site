import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import OngoingSection from '@/components/OngoingSection'
import TrendingSection from '@/components/TrendingSection'
import MoviesSection from '@/components/MoviesSection'
import GenresSection from '@/components/GenresSection'
import { getAllAnime } from '@/app/data/animeData'

export default function Home() {
  const allAnime = getAllAnime()
  
  // Выбираем аниме для баннера (первые 5)
  const bannerAnime = allAnime.slice(0, 5)
  
  // Аниме которые выходят (с статусом "Выходит" или "Анонсирован")
  const ongoingAnime = allAnime
    .filter(a => a.status && (a.status.includes('Выходит') || a.status.includes('Анонсирован')))
    .slice(0, 10)
  
  // Популярные (с высоким рейтингом)
  const trendingAnime = allAnime
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)

  return (
    <main className="min-h-screen">
      <Header />
      <HeroBanner anime={bannerAnime} />
      <OngoingSection anime={ongoingAnime} />
      <TrendingSection anime={trendingAnime} />
      <MoviesSection />
      <GenresSection />
      <Footer />
    </main>
  )
}
