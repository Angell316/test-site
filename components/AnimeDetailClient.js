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
  Globe,
  X,
  Tv
} from 'lucide-react'

export default function AnimeDetailClient({ anime, relatedAnime }) {
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedScreenshot, setSelectedScreenshot] = useState(null)

  return (
    <>
      {/* Modern Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/85 to-dark-900 z-10"></div>
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            className="object-cover opacity-20 blur-lg"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container-custom px-6 lg:px-12 py-12 md:py-16">
          <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-8 lg:gap-12 items-start">
            
            {/* Poster - Simple and Clean */}
            <div className="mx-auto lg:mx-0 w-full max-w-sm lg:max-w-none">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Main Info Block */}
            <div className="space-y-5 md:space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                  {anime.title}
                </h1>
                {anime.titleEn && (
                  <p className="text-base md:text-lg text-gray-400">
                    {anime.titleEn}
                  </p>
                )}
              </div>

              {/* Stats and Meta - All in one line */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {/* Rating */}
                {anime.rating > 0 && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-white">{anime.rating.toFixed(1)}</span>
                  </div>
                )}
                
                {/* Year */}
                {anime.year && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{anime.year}</span>
                  </div>
                )}
                
                {/* Episodes */}
                {anime.episodes && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{anime.episodes} эп.</span>
                  </div>
                )}
                
                {/* Type */}
                {anime.kind && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                    <Tv className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 capitalize">{anime.kind}</span>
                  </div>
                )}
                
                {/* Duration */}
                {anime.duration && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{anime.duration} мин</span>
                  </div>
                )}
              </div>

              {/* Status & Quality */}
              <div className="flex flex-wrap gap-2">
                {anime.status && (
                  <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-crimson-primary to-crimson-dark text-white text-sm font-bold">
                    {anime.status}
                  </span>
                )}
                {anime.quality && (
                  <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-semibold">
                    {anime.quality}
                  </span>
                )}
                {anime.translate && (
                  <span className="px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-semibold">
                    {anime.translate}
                  </span>
                )}
              </div>

              {/* Genres */}
              {anime.genre && anime.genre.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {anime.genre.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:border-crimson-primary/50 transition-all cursor-pointer"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Additional Info */}
              <div className="space-y-2 text-sm">
                {anime.studios?.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <span className="text-gray-400 font-medium">Студия:</span>
                    <span className="text-gray-300">{anime.studios.join(', ')}</span>
                  </div>
                )}
                {anime.countries?.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{anime.countries.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-base text-gray-300 leading-relaxed">
                {anime.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => setShowPlayer(!showPlayer)}
                  className="flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-semibold shadow-lg shadow-crimson-primary/30 hover:shadow-xl hover:shadow-crimson-primary/40 transition-all duration-300"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{showPlayer ? 'Скрыть плеер' : 'Смотреть аниме'}</span>
                </button>
                
                <AnimeListButton animeId={anime.id} />
                
                <button 
                  className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-crimson-primary/50 text-white transition-all duration-300"
                  title="Поделиться"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Section - Simple and Clear */}
      {showPlayer && anime.playerLink && (
        <section className="bg-dark-800 border-y border-white/5 py-8 md:py-12">
          <div className="container-custom px-6 lg:px-12">
            <VideoPlayer 
              playerLink={anime.playerLink}
              title={anime.title}
              onClose={() => setShowPlayer(false)}
            />
          </div>
        </section>
      )}

      {/* Screenshots Gallery - Clean and Simple */}
      {anime.screenshots && anime.screenshots.length > 0 && (
        <section className="py-12 md:py-16 bg-dark-900">
          <div className="container-custom px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 md:mb-8">
              Скриншоты
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {anime.screenshots.slice(0, 8).map((screenshot, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedScreenshot(screenshot)}
                  className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-crimson-primary/50 cursor-pointer group transition-all duration-300"
                >
                  <Image
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox for Screenshots - Simple */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 cursor-pointer"
        >
          <button
            onClick={() => setSelectedScreenshot(null)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-6xl aspect-video">
            <Image
              src={selectedScreenshot}
              alt="Screenshot"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Comments Section */}
      <section className="py-12 md:py-16 bg-dark-800/50">
        <div className="container-custom px-6 lg:px-12">
          <CommentsSection animeId={anime.id} />
        </div>
      </section>

      {/* Related Anime Section */}
      {relatedAnime.length > 0 && (
        <section className="py-12 md:py-16 bg-dark-900">
          <div className="container-custom px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Похожее аниме
                  </h2>
                  <p className="text-sm text-gray-400">Вам может понравиться</p>
                </div>
              </div>
              <Link
                href="/anime"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-crimson-primary/50 transition-all group"
              >
                <span className="text-white font-medium text-sm">Смотреть всё</span>
                <ChevronRight className="w-4 h-4 text-crimson-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {relatedAnime.map((relatedItem) => (
                <AnimeCard key={relatedItem.id} anime={relatedItem} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

