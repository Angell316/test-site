'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Star, Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react'

export default function HeroBanner({ anime }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imageError, setImageError] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % anime.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [anime.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % anime.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + anime.length) % anime.length)
  }

  const currentAnime = anime[currentSlide]

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-dark-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {!imageError[currentAnime.id] ? (
          <Image
            src={currentAnime.image}
            alt={currentAnime.title}
            fill
            className="object-cover"
            priority
            onError={() => setImageError({ ...imageError, [currentAnime.id]: true })}
          />
        ) : (
          <div className="absolute inset-0 bg-dark-800 flex items-center justify-center">
            <Play className="w-32 h-32 text-crimson-primary opacity-30" />
          </div>
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-dark-900/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container-custom px-6 lg:px-12 flex items-end pb-16 md:pb-20">
        <div className="max-w-3xl space-y-6 animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-crimson-primary bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full">
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-sm font-semibold text-white">
              Новинка
            </span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              {currentAnime.title}
            </h1>
            {currentAnime.titleEn && (
              <p className="text-xl md:text-2xl text-gray-300">
                {currentAnime.titleEn}
              </p>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center flex-wrap gap-4 text-white">
            <div className="flex items-center space-x-2 bg-dark-800 bg-opacity-80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{currentAnime.rating}</span>
            </div>
            {currentAnime.year && (
              <div className="flex items-center space-x-2 bg-dark-800 bg-opacity-80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <Calendar className="w-4 h-4" />
                <span>{currentAnime.year}</span>
              </div>
            )}
            {currentAnime.episodes && (
              <div className="bg-dark-800 bg-opacity-80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <span>{currentAnime.episodes} эпизодов</span>
              </div>
            )}
            {currentAnime.status && (
              <div className="bg-crimson-primary bg-opacity-80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <span className="font-semibold">{currentAnime.status}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {currentAnime.genre && currentAnime.genre.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentAnime.genre.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm font-medium bg-white bg-opacity-10 backdrop-blur-sm rounded-full text-white border border-white border-opacity-20"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-lg text-gray-300 leading-relaxed line-clamp-2 md:line-clamp-3">
            {currentAnime.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={`/anime/${currentAnime.id}`}
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-crimson-primary text-white font-semibold text-lg shadow-crimson-glow hover:shadow-crimson-glow-lg transition-all duration-300 hover:scale-105"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>Смотреть</span>
            </Link>
            <Link
              href={`/anime/${currentAnime.id}`}
              className="flex items-center space-x-2 px-8 py-4 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 text-white font-semibold text-lg transition-all duration-300 hover:scale-105"
            >
              <Info className="w-5 h-5" />
              <span>Подробнее</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full glass-effect hover:bg-white hover:bg-opacity-20 transition-all duration-300 group z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:text-crimson-light" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 p-3 rounded-full glass-effect hover:bg-white hover:bg-opacity-20 transition-all duration-300 group z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:text-crimson-light" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-10">
        {anime.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-crimson-primary'
                : 'w-2 bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

