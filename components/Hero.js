'use client'

import Link from 'next/link'
import { Play, Sparkles, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-primary rounded-full blur-[128px] opacity-50 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-dark rounded-full blur-[128px] opacity-40 animate-pulse animation-delay-400"></div>
        </div>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom px-6 lg:px-12 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full animate-fadeInUp">
            <Sparkles className="w-4 h-4 text-purple-primary" />
            <span className="text-sm font-medium text-gray-300">
              Новые серии каждый день
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-tight animate-fadeInUp animation-delay-200">
            <span className="gradient-text">Смотри аниме</span>
            <br />
            <span className="text-white">без границ</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-400">
            Огромная коллекция аниме и фильмов в отличном качестве.
            Смотри любимые тайтлы онлайн прямо сейчас.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp animation-delay-600">
            <Link
              href="/anime"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-purple-primary to-purple-dark text-white font-semibold text-lg shadow-purple-glow hover:shadow-purple-glow-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <div className="flex items-center justify-center space-x-2">
                <Play className="w-5 h-5 fill-white" />
                <span>Начать просмотр</span>
              </div>
            </Link>

            <Link
              href="/top"
              className="group px-8 py-4 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-5 h-5 group-hover:text-purple-primary transition-colors" />
                <span>Топ аниме</span>
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-12 animate-fadeInUp animation-delay-600">
            <div className="glass-effect p-6 rounded-2xl hover:bg-white hover:bg-opacity-5 transition-all duration-300">
              <div className="text-4xl font-bold gradient-text">5000+</div>
              <div className="text-gray-400 mt-2">Аниме тайтлов</div>
            </div>
            <div className="glass-effect p-6 rounded-2xl hover:bg-white hover:bg-opacity-5 transition-all duration-300">
              <div className="text-4xl font-bold gradient-text">1000+</div>
              <div className="text-gray-400 mt-2">Фильмов</div>
            </div>
            <div className="glass-effect p-6 rounded-2xl hover:bg-white hover:bg-opacity-5 transition-all duration-300">
              <div className="text-4xl font-bold gradient-text">HD</div>
              <div className="text-gray-400 mt-2">Качество</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-purple-primary border-opacity-50 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-purple-primary rounded-full"></div>
        </div>
      </div>
    </section>
  )
}

