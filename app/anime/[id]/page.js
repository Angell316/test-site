'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import AnimeListButton from '@/components/AnimeListButton'
import CommentsSection from '@/components/CommentsSection'
import { getAllAnime, getAnimeById } from '@/app/data/animeData'
import { getAnimeById as getShikimoriAnimeById, getSimilarAnime } from '@/lib/shikimoriGraphQL'
import { 
  Play, 
  Star, 
  Calendar, 
  Eye, 
  Share2, 
  Clock,
  TrendingUp,
  ChevronRight,
  Info,
  Film,
  Heart
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AnimeDetailPage() {
  const params = useParams()
  const [anime, setAnime] = useState(null)
  const [relatedAnime, setRelatedAnime] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnime() {
      if (!params?.id) return
      
      try {
        setLoading(true)
        
        // Сначала проверяем локальные данные
        const localAnime = getAnimeById(params.id)
        
        if (localAnime) {
          setAnime(localAnime)
          // Загружаем похожие из общего каталога
          const allAnime = await getAllAnime()
          const related = allAnime
            .filter(a => a.id !== localAnime.id && localAnime.genre && a.genre && a.genre.some(g => localAnime.genre.includes(g)))
            .slice(0, 6)
          setRelatedAnime(related)
        } else {
          // Загружаем из API
          const apiAnime = await getShikimoriAnimeById(params.id)
          setAnime(apiAnime)
          
          // Загружаем похожие
          const similar = await getSimilarAnime(params.id)
          setRelatedAnime(similar)
        }
      } catch (error) {
        console.error('Failed to load anime:', error)
        setAnime(null)
      } finally {
        setLoading(false)
      }
    }

    loadAnime()
  }, [params?.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-crimson-primary mx-auto mb-4"></div>
            <p className="text-white text-lg">Загрузка аниме...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!anime) {
    return (
      <main className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Header />
        <div className="text-center py-32">
          <h1 className="text-4xl font-bold text-white mb-4">Аниме не найдено</h1>
          <Link href="/anime" className="text-crimson-primary hover:text-crimson-light text-lg">
            Вернуться к каталогу
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-16 overflow-hidden">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/80 to-dark-900 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-transparent to-dark-900 z-10"></div>
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container-custom px-4 md:px-6 lg:px-12 py-12 md:py-16">
          <div className="grid lg:grid-cols-[350px_1fr] gap-8 md:gap-12">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-crimson-primary/30 animate-fadeInUp group">
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <button className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-crimson-primary text-white font-semibold hover:bg-crimson-light transition-all">
                      <Play className="w-5 h-5 fill-white" />
                      <span>Смотреть трейлер</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-1 space-y-6 animate-fadeInUp animation-delay-200">
              {/* Title & Rating */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                    {anime.title}
                  </h1>
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-xl glass-effect flex-shrink-0">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-bold text-white">{anime.rating}</span>
                  </div>
                </div>
                {anime.titleEn && (
                  <p className="text-lg md:text-xl text-gray-400">{anime.titleEn}</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {anime.year && (
                  <div className="glass-effect rounded-xl p-3 text-center hover:bg-white hover:bg-opacity-5 transition-all">
                    <Calendar className="w-5 h-5 text-crimson-primary mx-auto mb-1" />
                    <p className="text-xs text-gray-400 mb-0.5">Год</p>
                    <p className="text-sm font-bold text-white">{anime.year}</p>
                  </div>
                )}
                {anime.episodes && (
                  <div className="glass-effect rounded-xl p-3 text-center hover:bg-white hover:bg-opacity-5 transition-all">
                    <Eye className="w-5 h-5 text-crimson-primary mx-auto mb-1" />
                    <p className="text-xs text-gray-400 mb-0.5">Эпизодов</p>
                    <p className="text-sm font-bold text-white">{anime.episodes}</p>
                  </div>
                )}
                {anime.duration && (
                  <div className="glass-effect rounded-xl p-3 text-center hover:bg-white hover:bg-opacity-5 transition-all">
                    <Clock className="w-5 h-5 text-crimson-primary mx-auto mb-1" />
                    <p className="text-xs text-gray-400 mb-0.5">Длительность</p>
                    <p className="text-sm font-bold text-white">{anime.duration}</p>
                  </div>
                )}
                {anime.status && (
                  <div className="glass-effect rounded-xl p-3 text-center hover:bg-white hover:bg-opacity-5 transition-all">
                    <Film className="w-5 h-5 text-crimson-primary mx-auto mb-1" />
                    <p className="text-xs text-gray-400 mb-0.5">Статус</p>
                    <p className="text-sm font-bold text-white">{anime.status}</p>
                  </div>
                )}
              </div>

              {/* Genres */}
              {anime.genre && anime.genre.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {anime.genre.map((genre) => (
                    <Link
                      key={genre}
                      href={`/anime?genre=${genre}`}
                      className="px-3 py-1.5 rounded-lg glass-effect text-sm font-medium text-gray-300 hover:bg-crimson-primary hover:bg-opacity-20 hover:text-crimson-light border border-transparent hover:border-crimson-primary hover:border-opacity-30 transition-all"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              )}

              {/* Description */}
              {anime.description && (
                <div className="glass-effect rounded-xl p-4">
                  <p className="text-gray-300 leading-relaxed">{anime.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-semibold shadow-crimson-glow hover:shadow-crimson-glow-lg transition-all duration-300 hover:scale-105">
                  <Play className="w-5 h-5 fill-white" />
                  <span>Смотреть</span>
                </button>
                <AnimeListButton animeId={anime.id} />
                <button className="flex items-center justify-center px-4 py-3 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 text-white transition-all duration-300 hover:scale-105 group">
                  <Heart className="w-5 h-5 group-hover:text-crimson-primary group-hover:fill-crimson-primary transition-all" />
                </button>
                <button className="flex items-center justify-center px-4 py-3 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 text-white transition-all duration-300 hover:scale-105 group">
                  <Share2 className="w-5 h-5 group-hover:text-crimson-primary transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-12 bg-dark-800">
        <div className="container-custom px-4 md:px-6 lg:px-12">
          <CommentsSection animeId={anime.id} />
        </div>
      </section>

      {/* Related Anime */}
      {relatedAnime.length > 0 && (
        <section className="py-12 bg-dark-900">
          <div className="container-custom px-4 md:px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Похожее аниме
                  </h2>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Вам может понравиться
                  </p>
                </div>
              </div>
              <Link
                href="/anime"
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-300 group"
              >
                <span className="text-white text-sm font-medium">Смотреть всё</span>
                <ChevronRight className="w-4 h-4 text-crimson-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
              {relatedAnime.map((relatedItem, index) => (
                <div
                  key={relatedItem.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AnimeCard anime={relatedItem} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
