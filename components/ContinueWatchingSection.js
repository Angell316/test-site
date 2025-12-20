'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Clock, ChevronRight } from 'lucide-react'
import { WatchHistoryManager } from '@/lib/notifications'

export default function ContinueWatchingSection() {
  const [continueWatching, setContinueWatching] = useState([])

  useEffect(() => {
    const items = WatchHistoryManager.getContinueWatching()
    setContinueWatching(items)
  }, [])

  if (continueWatching.length === 0) return null

  return (
    <section className="py-12 px-4 md:px-6 lg:px-12 bg-dark-900">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                Продолжить просмотр
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                Вернитесь к просмотру
              </p>
            </div>
          </div>
          <Link
            href="/profile?tab=history"
            className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all group"
          >
            <span className="text-white text-sm font-medium">История</span>
            <ChevronRight className="w-4 h-4 text-crimson-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Continue Watching Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {continueWatching.map((item, index) => (
            <Link
              key={item.animeId}
              href={`/anime/${item.animeId}`}
              className="group glass-effect rounded-xl overflow-hidden hover:bg-white hover:bg-opacity-5 transition-all animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4 p-3">
                {/* Thumbnail */}
                <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-dark-700">
                  <Image
                    src={item.animeImage}
                    alt={item.animeTitle}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="96px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-900 bg-opacity-0 group-hover:bg-opacity-60 transition-all">
                    <div className="bg-crimson-primary rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-white font-bold line-clamp-2 mb-2 group-hover:text-crimson-light transition-colors">
                      {item.animeTitle}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Серия {item.episode}</span>
                      {item.totalEpisodes && (
                        <span className="text-gray-500">/ {item.totalEpisodes}</span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-crimson-primary to-crimson-light rounded-full transition-all"
                        style={{
                          width: `${item.totalEpisodes ? (item.episode / item.totalEpisodes) * 100 : 0}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.totalEpisodes 
                        ? `${Math.round((item.episode / item.totalEpisodes) * 100)}% завершено`
                        : 'В процессе'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

