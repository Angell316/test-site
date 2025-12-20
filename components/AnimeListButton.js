'use client'

import { useState } from 'react'
import { Eye, CheckCircle, Clock, XCircle, Heart, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useAnimeLists } from '@/contexts/AnimeListContext'

export default function AnimeListButton({ animeId }) {
  const { isAuthenticated } = useAuth()
  const { getAnimeStatus, isFavorite, addToList, removeFromList, toggleFavorite } = useAnimeLists()
  const [showMenu, setShowMenu] = useState(false)

  if (!isAuthenticated) {
    return null
  }

  const currentStatus = getAnimeStatus(animeId)
  const isFav = isFavorite(animeId)

  const lists = [
    { id: 'watching', label: 'Смотрю', icon: Eye },
    { id: 'completed', label: 'Просмотрено', icon: CheckCircle },
    { id: 'planned', label: 'Запланировано', icon: Clock },
    { id: 'dropped', label: 'Брошено', icon: XCircle },
  ]

  const currentList = lists.find(l => l.id === currentStatus)
  const CurrentIcon = currentList?.icon || Plus

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* List Status Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentStatus
                ? 'bg-crimson-primary text-white shadow-crimson-glow'
                : 'glass-effect text-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <CurrentIcon className="w-5 h-5" />
            <span>{currentList?.label || 'Добавить в список'}</span>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-full mt-2 left-0 w-64 glass-effect rounded-xl p-2 shadow-lg z-10 animate-fadeInUp">
              {lists.map((list) => {
                const Icon = list.icon
                const isActive = currentStatus === list.id
                return (
                  <button
                    key={list.id}
                    onClick={() => {
                      if (isActive) {
                        removeFromList(animeId, list.id)
                      } else {
                        addToList(animeId, list.id)
                      }
                      setShowMenu(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-crimson-primary text-white'
                        : 'text-gray-300 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{list.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(animeId)}
          className={`p-3 rounded-xl transition-all ${
            isFav
              ? 'bg-crimson-primary text-white shadow-crimson-glow'
              : 'glass-effect text-gray-400 hover:bg-white hover:bg-opacity-10 hover:text-crimson-primary'
          }`}
          aria-label="Избранное"
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
        </button>
      </div>
    </div>
  )
}

