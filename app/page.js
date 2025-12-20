'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import ContinueWatchingSection from '@/components/ContinueWatchingSection'
import OngoingSection from '@/components/OngoingSection'
import TrendingSection from '@/components/TrendingSection'
import MoviesSection from '@/components/MoviesSection'
import GenresSection from '@/components/GenresSection'
import { getPopularAnime, getOngoingAnime, getTopRatedAnime } from '@/app/data/animeData'
import { getBannerAnime } from '@/lib/enrichmentAPI'

export default function Home() {
  const [bannerAnime, setBannerAnime] = useState([])
  const [ongoingAnime, setOngoingAnime] = useState([])
  const [trendingAnime, setTrendingAnime] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Загружаем обогащённые данные для баннера (параллельно с остальными)
        const [banner, ongoing, trending] = await Promise.all([
          getBannerAnime(5), // 5 аниме для баннера с трейлерами
          getOngoingAnime(20),
          getTopRatedAnime(20)
        ])

        setBannerAnime(banner)
        setOngoingAnime(ongoing)
        setTrendingAnime(trending)
      } catch (error) {
        console.error('Failed to load anime data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-crimson-primary mx-auto mb-4"></div>
            <p className="text-white text-lg">Загрузка аниме...</p>
            <p className="text-gray-400 text-sm mt-2">Получение данных из нескольких источников...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      <HeroBanner anime={bannerAnime} />
      <ContinueWatchingSection />
      <OngoingSection anime={ongoingAnime} />
      <TrendingSection anime={trendingAnime} />
      <MoviesSection />
      <GenresSection />
      <Footer />
    </main>
  )
}
