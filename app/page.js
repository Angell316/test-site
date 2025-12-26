import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import OngoingSection from '@/components/OngoingSection'
import TrendingSection from '@/components/TrendingSection'
import MoviesSection from '@/components/MoviesSection'
import GenresSection from '@/components/GenresSection'
import { getHomePageData, getOngoingAnime, getAnimeMovies } from '@/lib/animeDatabase'

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
      <GenresSection />
      <Footer />
    </main>
  )
}
