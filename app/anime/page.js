'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import SearchSuggestions from '@/components/SearchSuggestions'
import { filterAnime, getAllGenres, getAllYears, getAllTypes, normalizeAnime } from '@/lib/animeDatabase'
import { getSuggestions } from '@/lib/trigramSearch'
import { getAllAnime } from '@/lib/animeDatabase'
import { Filter, Grid, Search, X, ChevronDown, Loader2, SlidersHorizontal } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function AnimePage() {
  const router = useRouter()
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  
  // Фильтры
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedContentType, setSelectedContentType] = useState('') // 'movie', 'series', или ''
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  
  // Умные подсказки
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allAnimeData, setAllAnimeData] = useState([])
  
  // Данные для фильтров
  const [genres, setGenres] = useState([])
  const [years, setYears] = useState([])
  const [types, setTypes] = useState([])
  
  const observerTarget = useRef(null)
  const searchRef = useRef(null)

  // Загрузка данных для фильтров и всего каталога для подсказок
  useEffect(() => {
    setGenres(getAllGenres())
    setYears(getAllYears())
    setTypes(getAllTypes())
    
    // Загружаем все аниме для подсказок (кешируем)
    try {
      const allData = getAllAnime()
      setAllAnimeData(allData.map(normalizeAnime))
    } catch (error) {
      console.error('Error loading anime data:', error)
      setAllAnimeData([])
    }
  }, [])

  // Функция загрузки аниме
  const loadAnime = useCallback(async (pageNum, reset = false) => {
    if (loading) return
    
    setLoading(true)
    
    // Имитация задержки для плавности
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const result = filterAnime({
      query: searchQuery,
      genre: selectedGenre,
      year: selectedYear,
      type: selectedType,
      status: selectedStatus,
      contentType: selectedContentType,
      minRating,
      sortBy,
      page: pageNum,
      limit: 24
    })
    
    setAnime(prev => reset ? result.items : [...prev, ...result.items])
    setTotal(result.total)
    setHasMore(result.hasMore)
    setLoading(false)
  }, [searchQuery, selectedGenre, selectedYear, selectedType, selectedStatus, selectedContentType, minRating, sortBy, loading])

  // Первоначальная загрузка
  useEffect(() => {
    setPage(1)
    loadAnime(1, true)
  }, [searchQuery, selectedGenre, selectedYear, selectedType, selectedStatus, selectedContentType, minRating, sortBy])

  // Intersection Observer для lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          loadAnime(nextPage, false)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, page, loadAnime])

  // Обработка поиска с задержкой (debounce) и генерация подсказок
  useEffect(() => {
    // Генерируем подсказки в реальном времени
    if (searchInput.length >= 3) {
      const getSearchableTexts = (anime) => [
        anime.title,
        anime.titleEn,
        anime.titleOriginal
      ].filter(Boolean)
      
      const searchSuggestions = getSuggestions(
        searchInput,
        allAnimeData,
        getSearchableTexts,
        5
      )
      setSuggestions(searchSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
    
    // Задержка перед реальным поиском
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setShowSuggestions(false) // Скрываем подсказки когда начинается поиск
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput, allAnimeData])
  
  // Обработка клика вне области подсказок
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Обработка выбора подсказки
  const handleSuggestionSelect = (selectedAnime) => {
    setShowSuggestions(false)
    setSearchInput('')
    setSearchQuery('')
    router.push(`/anime/${selectedAnime.id}`)
  }

  // Сброс фильтров
  const resetFilters = () => {
    setSearchInput('')
    setSearchQuery('')
    setSelectedGenre('')
    setSelectedYear('')
    setSelectedType('')
    setSelectedStatus('')
    setSelectedContentType('')
    setMinRating(0)
    setSortBy('rating')
  }

  // Проверка активных фильтров
  const hasActiveFilters = searchQuery || selectedGenre || selectedYear || 
                          selectedType || selectedStatus || selectedContentType || minRating > 0

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'ongoing', label: 'Выходит' },
    { value: 'released', label: 'Завершён' },
    { value: 'anons', label: 'Анонсирован' }
  ]

  const sortOptions = [
    { value: 'rating', label: 'По рейтингу' },
    { value: 'popularity', label: 'По популярности' },
    { value: 'year', label: 'По году' },
    { value: 'title', label: 'По названию' },
    { value: 'recent', label: 'Недавно добавленные' }
  ]

  const typeLabels = {
    'tv': 'TV Сериал',
    'movie': 'Фильм',
    'ova': 'OVA',
    'ona': 'ONA',
    'special': 'Спешл',
    'music': 'Клип'
  }

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-8 px-6 lg:px-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                  Каталог аниме
                </h1>
                <p className="text-gray-400 mt-2">
                  {loading && page === 1 ? 'Загрузка...' : `Найдено ${total} тайтлов`}
                </p>
              </div>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-3 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all"
            >
              <SlidersHorizontal className="w-5 h-5 text-crimson-primary" />
              <span className="text-white font-medium">Фильтры</span>
            </button>
          </div>

          {/* Search Bar with Smart Suggestions */}
          <div className="relative mb-6" ref={searchRef}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                if (searchInput.length >= 3 && suggestions.length > 0) {
                  setShowSuggestions(true)
                }
              }}
              placeholder="Поиск по названию аниме... (умный поиск с опечатками)"
              className="w-full pl-12 pr-12 py-4 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('')
                  setShowSuggestions(false)
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all z-10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
            
            {/* Smart Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <SearchSuggestions
                suggestions={suggestions}
                onSelect={handleSuggestionSelect}
                searchQuery={searchInput}
              />
            )}
          </div>

          {/* Filters Panel */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-4`}>
            {/* Sort and Quick Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-dark-800">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Content Type Filter - Фильмы/Сериалы */}
              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="px-4 py-2 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary cursor-pointer"
              >
                <option value="" className="bg-dark-800">Все</option>
                <option value="movie" className="bg-dark-800">🎬 Фильмы</option>
                <option value="series" className="bg-dark-800">📺 Сериалы</option>
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary cursor-pointer"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-dark-800">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Type */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary cursor-pointer"
              >
                <option value="" className="bg-dark-800">Все типы</option>
                {types.map(type => (
                  <option key={type} value={type} className="bg-dark-800">
                    {typeLabels[type] || type}
                  </option>
                ))}
              </select>

              {/* Year */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary cursor-pointer"
              >
                <option value="" className="bg-dark-800">Все годы</option>
                {years.slice(0, 20).map(year => (
                  <option key={year} value={year} className="bg-dark-800">
                    {year}
                  </option>
                ))}
              </select>

              {/* Min Rating */}
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="px-4 py-2 rounded-lg glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary cursor-pointer"
              >
                <option value="0" className="bg-dark-800">Любой рейтинг</option>
                <option value="7" className="bg-dark-800">7.0+</option>
                <option value="8" className="bg-dark-800">8.0+</option>
                <option value="9" className="bg-dark-800">9.0+</option>
              </select>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-crimson-primary hover:bg-crimson-dark text-white transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Сбросить</span>
                </button>
              )}
            </div>

            {/* Genres */}
            <div className="space-y-2">
              <button
                onClick={() => setSelectedGenre('')}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Жанры {selectedGenre && `(${selectedGenre})`}
              </button>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 20).map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedGenre === genre
                        ? 'bg-crimson-primary text-white'
                        : 'glass-effect text-gray-300 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anime Grid */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="container-custom">
          {anime.length === 0 && !loading ? (
            <div className="text-center py-20">
              <Grid className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Ничего не найдено</h3>
              <p className="text-gray-400 mb-6">Попробуйте изменить параметры поиска</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 rounded-xl bg-crimson-primary hover:bg-crimson-dark text-white font-semibold transition-all"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {anime.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${(index % 24) * 30}ms` }}
                  >
                    <AnimeCard anime={item} />
                  </div>
                ))}
              </div>

              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-crimson-primary animate-spin" />
                  <span className="ml-3 text-white font-medium">Загрузка...</span>
                </div>
              )}

              {/* Intersection Observer Target */}
              {hasMore && !loading && (
                <div ref={observerTarget} className="h-20 flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Прокрутите для загрузки</div>
                </div>
              )}

              {/* End Message */}
              {!hasMore && anime.length > 0 && (
                <div className="text-center py-12">
                  <div className="inline-block px-6 py-3 rounded-xl glass-effect">
                    <p className="text-gray-400">
                      Показано все {total} тайтлов
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
