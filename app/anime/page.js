'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import FilterBar from '@/components/FilterBar'
import { getAllAnime } from '@/app/data/animeData'
import { Grid } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AnimePage() {
  const [allAnime, setAllAnime] = useState([])
  const [filteredAnime, setFilteredAnime] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnime() {
      try {
        setLoading(true)
        const anime = await getAllAnime()
        setAllAnime(anime)
        setFilteredAnime(anime)
      } catch (error) {
        console.error('Failed to load anime:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadAnime()
  }, [])

  const handleFilterChange = (filters) => {
    let filtered = [...allAnime]

    // Filter by genre
    if (filters.genre) {
      filtered = filtered.filter(anime => 
        anime.genre && anime.genre.includes(filters.genre)
      )
    }

    // Filter by year
    if (filters.year) {
      filtered = filtered.filter(anime => 
        anime.year && anime.year.toString() === filters.year
      )
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(anime => 
        anime.status && anime.status === filters.status
      )
    }

    // Sort
    if (filters.sort) {
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'rating':
            return parseFloat(b.rating) - parseFloat(a.rating)
          case 'year':
            return (b.year || 0) - (a.year || 0)
          case 'title':
            return a.title.localeCompare(b.title, 'ru')
          case 'popularity':
            return (b.popularity || 0) - (a.popularity || 0)
          default:
            return 0
        }
      })
    }

    setFilteredAnime(filtered)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-28">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-crimson-primary mx-auto mb-4"></div>
            <p className="text-white text-lg">Загрузка каталога...</p>
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
      <section className="pt-28 pb-8 px-4 md:px-6 lg:px-12">
        <div className="container-custom">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
              <Grid className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                Каталог аниме
              </h1>
              <p className="text-gray-400 mt-1 text-sm md:text-base">
                Найдено {filteredAnime.length} из {allAnime.length} тайтлов
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar onFilterChange={handleFilterChange} />
        </div>
      </section>

      {/* Anime Grid */}
      <section className="pb-16 px-4 md:px-6 lg:px-12">
        <div className="container-custom">
          {filteredAnime.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
              {filteredAnime.map((anime, index) => (
                <div
                  key={anime.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Аниме не найдено. Попробуйте изменить фильтры.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
