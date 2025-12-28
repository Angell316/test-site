'use client'

import { Tv, ChevronRight } from 'lucide-react'
import AnimeCard from './AnimeCard'
import Link from 'next/link'
import { getAnimeSeries } from '@/lib/animeDatabase'

export default function SeriesSection() {
  const animeSeries = getAnimeSeries(8)
  
  return (
    <section className="py-16 px-6 lg:px-12 bg-dark-800 bg-opacity-30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-glow">
              <Tv className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Аниме-сериалы
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Популярные сериалы
              </p>
            </div>
          </div>
          <Link 
            href="/series"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 transition-all group"
          >
            <span className="text-white font-medium text-sm">Все сериалы</span>
            <ChevronRight className="w-4 h-4 text-crimson-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {animeSeries.map((series, index) => (
            <div
              key={series.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AnimeCard anime={series} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

