'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Star, Calendar, Eye, Clock } from 'lucide-react'
import { useState } from 'react'

export default function AnimeCard({ anime }) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-dark-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-crimson-primary/10">
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden bg-dark-700">
          {!imageError ? (
            <Image
              src={anime.image}
              alt={anime.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-700">
              <Play className="w-12 h-12 text-crimson-primary opacity-30" />
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-dark-900 bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-white">
              {anime.rating}
            </span>
          </div>

          {/* Status badge */}
          {anime.status && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-crimson-primary bg-opacity-90 backdrop-blur-sm">
              <span className="text-xs font-semibold text-white">
                {anime.status}
              </span>
            </div>
          )}

          {/* Play button overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-dark-900 bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-crimson-primary rounded-full p-3 shadow-crimson-glow transform scale-100 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Info Section - Below Image */}
        <div className="p-3 space-y-2 bg-dark-800">
          {/* Title */}
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-crimson-light transition-colors">
              {anime.title}
            </h3>
            {anime.titleEn && (
              <p className="text-xs text-gray-500 line-clamp-1">
                {anime.titleEn}
              </p>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-gray-400">
            {anime.year && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{anime.year}</span>
              </div>
            )}
            {anime.episodes && (
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{anime.episodes} эп.</span>
              </div>
            )}
            {anime.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{anime.duration}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {anime.genre && anime.genre.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {anime.genre.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs font-medium bg-dark-700 rounded text-gray-400"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
