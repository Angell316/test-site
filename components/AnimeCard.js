'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Star, Calendar, Eye, Clock, Info } from 'lucide-react'
import { useState } from 'react'

export default function AnimeCard({ anime }) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group relative block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl bg-dark-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-crimson-primary/20 h-full aspect-[2/3]">
        {/* Full Image Background */}
        <div className="absolute inset-0 overflow-hidden bg-dark-700">
          {!imageError ? (
            <Image
              src={anime.image}
              alt={anime.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-700">
              <Play className="w-16 h-16 text-crimson-primary opacity-30" />
            </div>
          )}
        </div>

        {/* Gradient Overlay - Always visible at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent opacity-70 group-hover:opacity-0 transition-opacity duration-300" />

        {/* Top Badges - Always visible */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          {/* Status badge */}
          {anime.status && (
            <div className="px-3 py-1.5 rounded-lg bg-crimson-primary/90 backdrop-blur-md shadow-lg">
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                {anime.status}
              </span>
            </div>
          )}
          
          {/* Rating badge */}
          <div className="flex items-center space-x-1.5 bg-dark-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-white">
              {anime.rating}
            </span>
          </div>
        </div>

        {/* Bottom Info - Always visible (compact) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-base font-bold text-white line-clamp-2 mb-1 drop-shadow-lg">
            {anime.title}
          </h3>
          {anime.titleEn && (
            <p className="text-sm text-gray-300 line-clamp-1 drop-shadow-md">
              {anime.titleEn}
            </p>
          )}
        </div>

        {/* Hover Overlay - Full info on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/95 to-dark-900/80 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between p-5 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top section with icon */}
          <div className="flex justify-end">
            <div className="bg-crimson-primary rounded-full p-3 shadow-crimson-glow transform scale-100 group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>

          {/* Bottom section with detailed info */}
          <div className="space-y-3">
            {/* Title */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white line-clamp-2">
                {anime.title}
              </h3>
              {anime.titleEn && (
                <p className="text-sm text-gray-400 line-clamp-1">
                  {anime.titleEn}
                </p>
              )}
            </div>

            {/* Genres */}
            {anime.genre && anime.genre.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genre.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-xs font-semibold bg-crimson-primary/20 border border-crimson-primary/30 rounded-lg text-crimson-light backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {anime.year && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-crimson-light" />
                  <span>{anime.year}</span>
                </div>
              )}
              {anime.episodes && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Eye className="w-4 h-4 text-crimson-light" />
                  <span>{anime.episodes} эп.</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center space-x-2 text-gray-300 col-span-2">
                  <Clock className="w-4 h-4 text-crimson-light" />
                  <span>{anime.duration}</span>
                </div>
              )}
            </div>

            {/* Description preview if available */}
            {anime.description && (
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                {anime.description}
              </p>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <div className="w-full bg-crimson-primary hover:bg-crimson-light text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Info className="w-4 h-4" />
                <span>Подробнее</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
