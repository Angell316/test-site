'use client'

import { useState, useEffect } from 'react'
import AnimeCard from './AnimeCard'
import { getPopularAnime } from '@/app/data/animeData'
import { Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedSection() {
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnime() {
      try {
        const data = await getPopularAnime(12)
        setAnime(data)
      } catch (error) {
        console.error('Failed to load featured anime:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAnime()
  }, [])

  if (loading) {
    return (
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-crimson-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-dark-900">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Избранное
              </h2>
              <p className="text-gray-400 mt-1">
                Самые популярные аниме этого сезона
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

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {anime.map((item, index) => (
            <div
              key={item.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AnimeCard anime={item} />
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden mt-8 flex justify-center">
          <Link
            href="/anime"
            className="flex items-center space-x-2 px-6 py-3 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-300 group"
          >
            <span className="text-white font-medium">Смотреть всё</span>
            <ChevronRight className="w-5 h-5 text-crimson-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}

