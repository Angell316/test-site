'use client'

import AnimeCard from './AnimeCard'
import { animeMovies } from '@/app/data/animeData'
import { Film, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function MoviesSection() {
  return (
    <section className="section-padding bg-dark-900">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Аниме-фильмы
              </h2>
              <p className="text-gray-400 mt-1">
                Лучшие полнометражные аниме
              </p>
            </div>
          </div>
          <Link
            href="/movies"
            className="hidden md:flex items-center space-x-2 px-6 py-3 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-300 group"
          >
            <span className="text-white font-medium">Все фильмы</span>
            <ChevronRight className="w-5 h-5 text-crimson-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animeMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AnimeCard anime={movie} />
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-8 flex justify-center">
          <Link
            href="/movies"
            className="flex items-center space-x-2 px-6 py-3 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-300 group"
          >
            <span className="text-white font-medium">Все фильмы</span>
            <ChevronRight className="w-5 h-5 text-crimson-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

