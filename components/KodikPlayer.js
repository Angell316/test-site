'use client'

import { useState, useEffect } from 'react'
import { Play, X, Settings, Volume2, VolumeX, Maximize } from 'lucide-react'
import { getPlayerUrl, getAnimeTranslations } from '@/lib/kodikAPI'

export default function KodikPlayer({ anime, className = '' }) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [translations, setTranslations] = useState([])
  const [selectedTranslation, setSelectedTranslation] = useState(null)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadTranslations() {
      if (!anime?.shikimori_id && !anime?.link) return
      
      try {
        setLoading(true)
        
        if (anime.shikimori_id) {
          const trans = await getAnimeTranslations(anime.shikimori_id)
          setTranslations(trans)
          if (trans.length > 0) {
            setSelectedTranslation(trans[0])
          }
        } else if (anime.link) {
          // Если есть прямая ссылка на плеер
          setSelectedTranslation({
            link: anime.link,
            title: anime.translation || 'Оригинал',
            episodes: anime.episodes || 1
          })
        }
      } catch (error) {
        console.error('Failed to load translations:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isPlayerOpen) {
      loadTranslations()
    }
  }, [anime, isPlayerOpen])

  const openPlayer = () => {
    setIsPlayerOpen(true)
  }

  const closePlayer = () => {
    setIsPlayerOpen(false)
    setCurrentEpisode(1)
  }

  const changeTranslation = (translation) => {
    setSelectedTranslation(translation)
    setCurrentEpisode(1)
  }

  const getIframeUrl = () => {
    if (!selectedTranslation?.link) return null
    
    return getPlayerUrl(selectedTranslation.link, {
      episode: currentEpisode,
      autoplay: 1
    })
  }

  // Если аниме без плеера (только информация)
  if (!anime?.link && !anime?.shikimori_id) {
    return (
      <button
        disabled
        className="w-full bg-gray-600 text-gray-400 py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 cursor-not-allowed"
      >
        <Play className="w-5 h-5" />
        <span>Плеер недоступен</span>
      </button>
    )
  }

  return (
    <>
      {/* Play Button */}
      <button
        onClick={openPlayer}
        className={`bg-gradient-to-r from-crimson-primary to-crimson-dark text-white py-3 px-6 rounded-xl font-semibold hover:shadow-crimson-glow transition-all duration-300 flex items-center space-x-3 ${className}`}
      >
        <Play className="w-5 h-5 fill-current" />
        <span>Смотреть аниме</span>
      </button>

      {/* Player Modal */}
      {isPlayerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-dark-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-white font-semibold text-lg truncate">
                {anime.title}
              </h2>
              {selectedTranslation && (
                <p className="text-gray-400 text-sm">
                  {selectedTranslation.title} • Эпизод {currentEpisode}
                </p>
              )}
            </div>
            
            <button
              onClick={closePlayer}
              className="text-gray-400 hover:text-white transition-colors ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Player */}
          <div className="flex-1 flex items-center justify-center bg-black">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-crimson-primary mx-auto mb-4"></div>
                <p className="text-white">Загрузка плеера...</p>
              </div>
            ) : selectedTranslation ? (
              <iframe
                src={getIframeUrl()}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center">
                <p className="text-white text-lg mb-4">Плеер недоступен</p>
                <button
                  onClick={closePlayer}
                  className="text-crimson-primary hover:text-crimson-light"
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          {selectedTranslation && !loading && (
            <div className="bg-dark-800 border-t border-gray-700 px-4 py-4">
              <div className="container-custom mx-auto">
                {/* Translations Selector */}
                {translations.length > 1 && (
                  <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-2 block">
                      Озвучка:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {translations.map((trans, index) => (
                        <button
                          key={index}
                          onClick={() => changeTranslation(trans)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedTranslation.id === trans.id
                              ? 'bg-crimson-primary text-white'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
                          }`}
                        >
                          {trans.title}
                          {trans.quality && (
                            <span className="ml-2 text-xs opacity-70">
                              {trans.quality}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Episode Selector */}
                {selectedTranslation.episodes > 1 && (
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">
                      Эпизоды: {currentEpisode} из {selectedTranslation.episodes}
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentEpisode(Math.max(1, currentEpisode - 1))}
                        disabled={currentEpisode === 1}
                        className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Пред
                      </button>
                      
                      <div className="flex-1 overflow-x-auto">
                        <div className="flex space-x-2 py-2">
                          {Array.from({ length: Math.min(selectedTranslation.episodes, 50) }, (_, i) => i + 1).map(ep => (
                            <button
                              key={ep}
                              onClick={() => setCurrentEpisode(ep)}
                              className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentEpisode === ep
                                  ? 'bg-crimson-primary text-white'
                                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
                              }`}
                            >
                              {ep}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setCurrentEpisode(Math.min(selectedTranslation.episodes, currentEpisode + 1))}
                        disabled={currentEpisode === selectedTranslation.episodes}
                        className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        След →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

