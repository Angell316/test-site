'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnimeCard from './AnimeCard'
import AnimeListButton from './AnimeListButton'
import CommentsSection from './CommentsSection'
import VideoPlayer from './VideoPlayer'
import { 
  Play, 
  Star, 
  Calendar, 
  Eye, 
  Share2, 
  Clock,
  TrendingUp,
  ChevronRight,
  Film,
  Globe
} from 'lucide-react'

export default function AnimeDetailClient({ anime, relatedAnime }) {
  const [showPlayer, setShowPlayer] = useState(false)

  return (
    <>
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
                  <span className="text-2xl font-bold text-white">{anime.rating?.toFixed(1) || 'N/A'}</span>
                  {anime.votes > 0 && (
                    <span className="text-sm text-gray-400">({anime.votes} голосов)</span>
                  )}
                </div>
                {anime.year && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{anime.year}</span>
                  </div>
                )}
                {anime.kind && (
                  <div className="flex items-center space-x-2">
                    <Film className="w-5 h-5" />
                    <span className="capitalize">{anime.kind}</span>
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
                    <span>{anime.duration} мин</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {anime.genre && anime.genre.length > 0 ? (
                  anime.genre.map((genre) => (
                    <span
                      key={genre}
                      className="px-4 py-2 rounded-lg glass-effect text-gray-300 font-medium hover:bg-white hover:bg-opacity-10 transition-all cursor-pointer"
                    >
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Жанры не указаны</span>
                )}
              </div>

              {/* Status & Quality */}
              <div className="flex flex-wrap gap-3">
                {anime.status && (
                  <div className="inline-block px-4 py-2 rounded-lg bg-crimson-primary bg-opacity-20 border border-crimson-primary border-opacity-30">
                    <span className="text-crimson-light font-semibold">{anime.status}</span>
                  </div>
                )}
                {anime.quality && (
                  <div className="inline-block px-4 py-2 rounded-lg glass-effect">
                    <span className="text-white font-semibold">{anime.quality}</span>
                  </div>
                )}
                {anime.translate && (
                  <div className="inline-block px-4 py-2 rounded-lg glass-effect">
                    <span className="text-white font-semibold">{anime.translate}</span>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              {(anime.studios?.length > 0 || anime.countries?.length > 0) && (
                <div className="space-y-2 text-gray-300">
                  {anime.studios?.length > 0 && (
                    <p><span className="text-gray-400">Студия:</span> {anime.studios.join(', ')}</p>
                  )}
                  {anime.countries?.length > 0 && (
                    <p className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span>{anime.countries.join(', ')}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-lg text-gray-300 leading-relaxed">
                {anime.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => setShowPlayer(!showPlayer)}
                  className="flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-semibold text-lg shadow-crimson-glow hover:shadow-crimson-glow-lg transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-6 h-6 fill-white" />
                  <span>{showPlayer ? 'Скрыть плеер' : 'Смотреть'}</span>
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

      {/* Video Player Section */}
      {showPlayer && anime.playerLink && (
        <section className="section-padding bg-dark-800">
          <div className="container-custom px-6 lg:px-12">
            <VideoPlayer 
              playerLink={anime.playerLink}
              title={anime.title}
              onClose={() => setShowPlayer(false)}
            />
          </div>
        </section>
      )}

      {/* Screenshots Gallery */}
      {anime.screenshots && anime.screenshots.length > 0 && (
        <section className="section-padding bg-dark-900">
          <div className="container-custom px-6 lg:px-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
              Скриншоты
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {anime.screenshots.slice(0, 8).map((screenshot, index) => (
                <div 
                  key={index} 
                  className="relative aspect-video rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <Image
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
    </>
  )
}

