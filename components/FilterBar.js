'use client'

import { useState } from 'react'
import { Filter, X, Calendar, Star, Tv, ChevronDown } from 'lucide-react'

export default function FilterBar({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    status: '',
    sort: 'rating'
  })

  const genres = [
    'Все жанры', 'Экшен', 'Приключения', 'Комедия', 'Драма', 'Фэнтези', 
    'Романтика', 'Триллер', 'Психологическое', 'Меха', 'Спорт', 'Музыка'
  ]

  const years = ['Все года', '2024', '2023', '2022', '2021', '2020', '2019', '2018']
  const statuses = ['Все статусы', 'Онгоинг', 'Завершён', 'Анонс']
  const sortOptions = [
    { value: 'rating', label: 'По рейтингу' },
    { value: 'year', label: 'По году' },
    { value: 'title', label: 'По алфавиту' },
    { value: 'popularity', label: 'По популярности' }
  ]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const clearFilters = () => {
    const resetFilters = {
      genre: '',
      year: '',
      rating: '',
      status: '',
      sort: 'rating'
    }
    setFilters(resetFilters)
    if (onFilterChange) {
      onFilterChange(resetFilters)
    }
  }

  const hasActiveFilters = filters.genre || filters.year || filters.rating || filters.status

  return (
    <div className="mb-8">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl glass-effect hover:bg-white hover:bg-opacity-5 transition-all group"
      >
        <Filter className="w-5 h-5 group-hover:text-crimson-primary transition-colors" />
        <span className="font-semibold">Фильтры</span>
        {hasActiveFilters && (
          <span className="px-2 py-0.5 bg-crimson-primary rounded-full text-xs font-bold">
            {Object.values(filters).filter(v => v && v !== 'rating').length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-4 glass-effect rounded-xl p-6 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Жанр
              </label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all cursor-pointer"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre === 'Все жанры' ? '' : genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Год</span>
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year === 'Все года' ? '' : year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-1">
                <Tv className="w-4 h-4" />
                <span>Статус</span>
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all cursor-pointer"
              >
                {statuses.map((status) => (
                  <option key={status} value={status === 'Все статусы' ? '' : status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>Сортировка</span>
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-crimson-primary bg-opacity-10 hover:bg-opacity-20 text-crimson-primary hover:text-crimson-light transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-semibold">Сбросить фильтры</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

