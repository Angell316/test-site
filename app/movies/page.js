'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import { Film } from 'lucide-react'
import { getTopAnime } from '@/lib/jikanAPI'

export default function MoviesPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true)
        // Загружаем топ аниме и фильтруем только фильмы
        const allAnime = await getTopAnime('bypopularity', 1, 25)
        const moviesList = allAnime.filter(anime => anime.type === 'Movie')
        setMovies(moviesList)
      } catch (error) {
        console.error('Failed to load movies:', error)
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-crimson-primary mx-auto mb-4"></div>
            <p className="text-white text-lg">Загрузка фильмов...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="container-custom">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                Аниме-фильмы
              </h1>
              <p className="text-gray-400 mt-2">
                Найдено {movies.length} фильмов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="container-custom">
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AnimeCard anime={movie} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Фильмы не найдены</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

