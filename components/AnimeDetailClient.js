'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnimeCard from './AnimeCard'
import AnimeListButton from './AnimeListButton'
import CommentsSection from './CommentsSection'
import VideoPlayer from './VideoPlayer'
import { motion, AnimatePresence } from 'framer-motion'
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
  Globe,
  X,
  Tv
} from 'lucide-react'

export default function AnimeDetailClient({ anime, relatedAnime }) {
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedScreenshot, setSelectedScreenshot] = useState(null)

  return (
    <>
      {/* Hero Section with Modern Design */}
      <section className="relative pt-16 overflow-hidden">
        {/* Background with Parallax Effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/90 to-dark-900 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-transparent to-dark-900 z-10"></div>
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            className="object-cover opacity-30 blur-md scale-105"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-20 container-custom px-6 lg:px-12 py-12 md:py-20">
          <div className="grid lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr] gap-8 lg:gap-16 items-start">
            {/* Poster with Modern Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto lg:mx-0 w-full max-w-sm lg:max-w-none"
            >
              <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-crimson-primary/20 border border-white/10 group">
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Quick Stats Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-5 rounded-2xl bg-dark-800/50 backdrop-blur-xl border border-white/5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold text-white">{anime.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <p className="text-xs text-gray-400">Рейтинг</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <span className="text-2xl font-bold text-white">{anime.episodes || '-'}</span>
                    </div>
                    <p className="text-xs text-gray-400">Эпизодов</p>
                  </div>
                  {anime.year && (
                    <div className="text-center">
                      <div className="mb-1">
                        <span className="text-lg font-bold text-white">{anime.year}</span>
                      </div>
                      <p className="text-xs text-gray-400">Год</p>
                    </div>
                  )}
                  {anime.kind && (
                    <div className="text-center">
                      <div className="mb-1">
                        <span className="text-lg font-bold text-white capitalize">{anime.kind}</span>
                      </div>
                      <p className="text-xs text-gray-400">Тип</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Info with Smooth Animations */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 lg:space-y-8"
            >
              {/* Title with Animation */}
              <div className="space-y-3">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white leading-tight"
                >
                  {anime.title}
                </motion.h1>
                {anime.titleEn && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-gray-400"
                  >
                    {anime.titleEn}
                  </motion.p>
                )}
              </div>

              {/* Status & Quality Badges */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2"
              >
                {anime.status && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-crimson-primary to-crimson-dark text-white text-sm font-bold shadow-lg shadow-crimson-primary/30">
                    {anime.status}
                  </span>
                )}
                {anime.quality && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white text-sm font-semibold">
                    {anime.quality}
                  </span>
                )}
                {anime.translate && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white text-sm font-semibold">
                    {anime.translate}
                  </span>
                )}
              </motion.div>

              {/* Compact Meta Info */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-4 text-sm text-gray-300"
              >
                {anime.duration && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{anime.duration} мин</span>
                  </div>
                )}
                {anime.kind && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                    <Tv className="w-4 h-4 text-gray-400" />
                    <span className="capitalize">{anime.kind}</span>
                  </div>
                )}
                {anime.countries?.length > 0 && (
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{anime.countries.join(', ')}</span>
                  </div>
                )}
              </motion.div>

              {/* Genres with Modern Pills */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-2"
              >
                {anime.genre && anime.genre.length > 0 ? (
                  anime.genre.map((genre, index) => (
                    <motion.span
                      key={genre}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 hover:border-crimson-primary/50 hover:text-white transition-all cursor-pointer"
                    >
                      {genre}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Жанры не указаны</span>
                )}
              </motion.div>

              {/* Additional Info */}
              {anime.studios?.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start space-x-2 text-sm"
                >
                  <span className="text-gray-400 font-medium">Студия:</span>
                  <span className="text-gray-300">{anime.studios.join(', ')}</span>
                </motion.div>
              )}

              {/* Description with Smooth Fade */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                  {anime.description}
                </p>
              </motion.div>

              {/* Modern Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <motion.button 
                  onClick={() => setShowPlayer(!showPlayer)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-semibold shadow-lg shadow-crimson-primary/30 hover:shadow-xl hover:shadow-crimson-primary/40 transition-all duration-300"
                >
                  {showPlayer ? (
                    <>
                      <X className="w-5 h-5" />
                      <span>Скрыть плеер</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white" />
                      <span>Смотреть</span>
                    </>
                  )}
                </motion.button>
                
                <AnimeListButton animeId={anime.id} />
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center px-4 py-3 md:py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-crimson-primary/50 text-white transition-all duration-300"
                  title="Поделиться"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Video Player Section */}
      <AnimatePresence>
        {showPlayer && anime.playerLink && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-dark-800/80 backdrop-blur-xl border-y border-white/5 overflow-hidden"
          >
            <div className="container-custom px-6 lg:px-12 py-8 md:py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <VideoPlayer 
                  playerLink={anime.playerLink}
                  title={anime.title}
                  onClose={() => setShowPlayer(false)}
                />
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Modern Screenshots Gallery */}
      {anime.screenshots && anime.screenshots.length > 0 && (
        <section className="py-16 md:py-24 bg-dark-900">
          <div className="container-custom px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-8 md:mb-12">
                Скриншоты
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {anime.screenshots.slice(0, 8).map((screenshot, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedScreenshot(screenshot)}
                    className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-crimson-primary/50 cursor-pointer group"
                  >
                    <Image
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {index + 1} / {anime.screenshots.length}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Lightbox for Screenshots */}
      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedScreenshot(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedScreenshot}
                alt="Screenshot"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Comments Section */}
      <section className="py-16 md:py-24 bg-dark-800/50">
        <div className="container-custom px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CommentsSection animeId={anime.id} />
          </motion.div>
        </div>
      </section>

      {/* Modern Related Anime Section */}
      {relatedAnime.length > 0 && (
        <section className="py-16 md:py-24 bg-dark-900">
          <div className="container-custom px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-12"
            >
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="p-2.5 md:p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-lg shadow-crimson-primary/30">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white">
                    Похожее аниме
                  </h2>
                  <p className="text-sm md:text-base text-gray-400 mt-0.5">
                    Вам может понравиться
                  </p>
                </div>
              </div>
              <Link
                href="/anime"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-crimson-primary/50 transition-all duration-300 group self-start sm:self-auto"
              >
                <span className="text-white font-medium text-sm">Смотреть всё</span>
                <ChevronRight className="w-4 h-4 text-crimson-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {relatedAnime.map((relatedItem, index) => (
                <motion.div
                  key={relatedItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AnimeCard anime={relatedItem} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

