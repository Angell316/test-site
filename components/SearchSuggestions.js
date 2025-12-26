'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp } from 'lucide-react'
import Image from 'next/image'

/**
 * Компонент умных подсказок для поиска
 * Показывает релевантные результаты во время ввода
 */
export default function SearchSuggestions({ 
  suggestions, 
  onSelect, 
  isLoading,
  searchQuery 
}) {
  if (!suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 z-50"
      >
        <div className="glass-effect rounded-xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-2 border-b border-white/10 bg-dark-800/50">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <TrendingUp className="w-3 h-3" />
              <span>Результаты по запросу &quot;{searchQuery}&quot;</span>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {suggestions.map((anime, index) => (
              <motion.button
                key={anime.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(anime)}
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/5 transition-all duration-200 group"
              >
                {/* Anime Image */}
                {anime.image && (
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700">
                    <Image
                      src={anime.image}
                      alt={anime.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="48px"
                    />
                  </div>
                )}

                {/* Anime Info */}
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white group-hover:text-crimson-light transition-colors line-clamp-1">
                    {anime.title}
                  </div>
                  {anime.titleEn && (
                    <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                      {anime.titleEn}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    {anime.year && (
                      <span className="text-xs text-gray-500">{anime.year}</span>
                    )}
                    {anime.rating && anime.rating > 0 && (
                      <>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-yellow-500">★ {anime.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="text-gray-600 group-hover:text-crimson-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          {suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-white/10 bg-dark-800/50 text-center">
              <span className="text-xs text-gray-400">
                Найдено {suggestions.length} {suggestions.length === 1 ? 'результат' : 'результатов'}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

