'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Star, Info, Sparkles, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroBanner({ anime }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imageError, setImageError] = useState({})
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % anime.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [anime.length, isAutoPlay])

  const nextSlide = () => {
    setIsAutoPlay(false)
    setCurrentSlide((prev) => (prev + 1) % anime.length)
  }

  const prevSlide = () => {
    setIsAutoPlay(false)
    setCurrentSlide((prev) => (prev - 1 + anime.length) % anime.length)
  }

  const currentAnime = anime[currentSlide]
  
  // Используем скриншоты из Kodik API, если они есть
  const backgroundImage = currentAnime.screenshots && currentAnime.screenshots.length > 0
    ? currentAnime.screenshots[0]
    : currentAnime.image

  return (
    <div className="relative w-full h-screen overflow-hidden bg-dark-900">
      {/* Animated Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {!imageError[currentAnime.id] ? (
            <>
              <Image
                src={backgroundImage}
                alt={currentAnime.title}
                fill
                className="object-cover"
                priority
                quality={90}
                onError={() => setImageError({ ...imageError, [currentAnime.id]: true })}
              />
              {/* Enhanced gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/95 to-dark-900/70"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-900"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
              <Play className="w-32 h-32 text-crimson-primary opacity-20" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Animated particles effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-crimson-primary rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-crimson-dark rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="container-custom px-6 lg:px-16 w-full">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6 md:space-y-8"
              >
                {/* Badge with animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-crimson-primary/90 to-crimson-dark/90 backdrop-blur-xl shadow-lg shadow-crimson-primary/20"
                >
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Рекомендуем
                  </span>
                </motion.div>

                {/* Title with stagger animation */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-3"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black text-white leading-[1.1] tracking-tight">
                    {currentAnime.title}
                  </h1>
                  {currentAnime.titleEn && (
                    <p className="text-xl md:text-2xl lg:text-3xl text-gray-400 font-light">
                      {currentAnime.titleEn}
                    </p>
                  )}
                </motion.div>

                {/* Compact Meta Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex items-center flex-wrap gap-3"
                >
                  {currentAnime.rating > 0 && (
                    <div className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{currentAnime.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {currentAnime.year && (
                    <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                      <span className="font-semibold text-white">{currentAnime.year}</span>
                    </div>
                  )}
                  {currentAnime.episodes && (
                    <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">
                      <span className="font-semibold text-white">{currentAnime.episodes} эп.</span>
                    </div>
                  )}
                  {currentAnime.status && (
                    <div className="px-4 py-2 rounded-full bg-crimson-primary/20 backdrop-blur-xl border border-crimson-primary/30">
                      <span className="font-bold text-crimson-light">{currentAnime.status}</span>
                    </div>
                  )}
                </motion.div>

                {/* Genres - более компактные */}
                {currentAnime.genre && currentAnime.genre.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-wrap gap-2"
                  >
                    {currentAnime.genre.slice(0, 5).map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 text-sm font-medium bg-white/5 backdrop-blur-xl rounded-lg text-gray-300 border border-white/10 hover:bg-white/10 hover:border-crimson-primary/50 transition-all duration-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </motion.div>
                )}

                {/* Description - короче */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-lg md:text-xl text-gray-300 leading-relaxed line-clamp-2 max-w-3xl"
                >
                  {currentAnime.description}
                </motion.p>

                {/* Action Buttons with hover effects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-4 pt-2"
                >
                  <Link
                    href={`/anime/${currentAnime.id}`}
                    className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-bold text-lg shadow-2xl shadow-crimson-primary/30 hover:shadow-crimson-primary/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-crimson-light to-crimson-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      <Play className="w-6 h-6 fill-white" />
                      <span>Смотреть</span>
                    </div>
                  </Link>
                  
                  <Link
                    href={`/anime/${currentAnime.id}`}
                    className="group px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      <Info className="w-5 h-5 group-hover:text-crimson-light transition-colors" />
                      <span>Подробнее</span>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Minimalist Navigation */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 pointer-events-none z-20">
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevSlide}
          className="pointer-events-auto p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          aria-label="Previous"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextSlide}
          className="pointer-events-auto p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
          aria-label="Next"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Elegant Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-20">
        {anime.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            onClick={() => {
              setCurrentSlide(index)
              setIsAutoPlay(false)
            }}
            animate={{
              width: index === currentSlide ? 48 : 6,
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut"
            }}
            className={`h-1.5 rounded-full ${
              index === currentSlide
                ? 'bg-gradient-to-r from-crimson-primary to-crimson-light'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

