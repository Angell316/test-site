'use client'

import { use } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import AnimeListButton from '@/components/AnimeListButton'
import CommentsSection from '@/components/CommentsSection'
import { featuredAnime, popularAnime, getAllAnime } from '@/app/data/animeData'
import { 
  Play, 
  Star, 
  Calendar, 
  Eye, 
  Share2, 
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AnimeDetailPage({ params }) {
  const resolvedParams = use(Promise.resolve(params))
  const allAnime = getAllAnime()
  const anime = allAnime.find((a) => a.id.toString() === resolvedParams.id)

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

  const relatedAnime = allAnime
    .filter((a) => a.id !== anime.id && a.genre.some((g) => anime.genre.includes(g)))
    .slice(0, 6)

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/95 to-dark-900 z-10"></div>
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            className="object-cover opacity-20 blur-sm"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container-custom px-6 lg:px-12 py-16">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-crimson-primary/20 animate-fadeInUp">
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-8 animate-fadeInUp animation-delay-200">
              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                  {anime.title}
                </h1>
                {anime.titleEn && (
                  <p className="text-xl text-gray-400">{anime.titleEn}</p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-white">{anime.rating}</span>
                </div>
                {anime.year && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{anime.year}</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>{anime.episodes} эпизодов</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{anime.duration}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {anime.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 rounded-lg glass-effect text-gray-300 font-medium hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Status */}
              {anime.status && (
                <div className="inline-block px-4 py-2 rounded-lg bg-crimson-primary bg-opacity-20 border border-crimson-primary border-opacity-30">
                  <span className="text-crimson-light font-semibold">{anime.status}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-lg text-gray-300 leading-relaxed">
                {anime.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                <button className="flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-semibold text-lg shadow-crimson-glow hover:shadow-crimson-glow-lg transition-all duration-300 hover:scale-105">
                  <Play className="w-6 h-6 fill-white" />
                  <span>Смотреть</span>
                </button>
                <AnimeListButton animeId={anime.id} />
                <button className="flex items-center justify-center px-4 py-4 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 text-white transition-all duration-300 hover:scale-105">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom px-6 lg:px-12">
          <CommentsSection animeId={anime.id} />
        </div>
      </section>

      {/* Related Anime */}
      {relatedAnime.length > 0 && (
        <section className="section-padding bg-dark-900">
          <div className="container-custom px-6 lg:px-12">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                    Похожее аниме
                  </h2>
                  <p className="text-gray-400 mt-1">
                    Вам может понравиться
                  </p>
                </div>
              </div>
              <Link
                href="/anime"
                className="hidden md:flex items-center space-x-2 px-6 py-3 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-300 group"
              >
                <span className="text-white font-medium">Смотреть всё</span>
                <ChevronRight className="w-5 h-5 text-crimson-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {relatedAnime.map((relatedItem, index) => (
                <div
                  key={relatedItem.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
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

