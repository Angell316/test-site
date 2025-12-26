'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Star, Clock } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-crimson-primary/30 transition-all duration-500"
      >
        {/* Full Image Container with Fixed Aspect Ratio */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-dark-700 to-dark-900">
          {!imageError ? (
            <Image
              src={anime.image}
              alt={anime.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-900">
              <Play className="w-20 h-20 text-crimson-primary/20" />
            </div>
          )}

          {/* Permanent Bottom Gradient with Basic Info */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-900 via-dark-900/95 to-transparent pt-20 pb-4 px-4">
            {/* Title - Always Visible */}
            <h3 className="text-base font-bold text-white line-clamp-2 leading-tight mb-2 drop-shadow-lg">
              {anime.title}
            </h3>

            {/* Rating - Always Visible */}
            {anime.rating > 0 && (
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-lg">
                  {anime.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Hover Overlay with Additional Info */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/90 to-dark-900/60 backdrop-blur-sm"
              >
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                    className="bg-gradient-to-r from-crimson-primary to-crimson-dark rounded-full p-5 shadow-2xl shadow-crimson-primary/60"
                  >
                    <Play className="w-10 h-10 text-white fill-white" />
                  </motion.div>
                </div>

                {/* Additional Info on Hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-2 leading-tight mb-1">
                      {anime.title}
                    </h3>
                    {anime.titleEn && (
                      <p className="text-xs text-gray-300 line-clamp-1 font-medium">
                        {anime.titleEn}
                      </p>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    {/* Rating */}
                    {anime.rating > 0 && (
                      <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-white">{anime.rating.toFixed(1)}</span>
                      </div>
                    )}

                    {/* Year */}
                    {anime.year && (
                      <div className="px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20">
                        <span className="font-semibold text-white">{anime.year}</span>
                      </div>
                    )}

                    {/* Episodes */}
                    {anime.episodes && (
                      <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20">
                        <Clock className="w-3.5 h-3.5 text-gray-300" />
                        <span className="font-semibold text-white">{anime.episodes} эп.</span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  {anime.genre && anime.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {anime.genre.slice(0, 3).map((genre, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-2.5 py-1 text-xs font-semibold bg-crimson-primary/20 backdrop-blur-xl rounded-lg text-crimson-light border border-crimson-primary/30"
                        >
                          {genre}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle Border */}
          <div className="absolute inset-0 border-2 border-white/5 group-hover:border-crimson-primary/50 rounded-2xl transition-colors duration-500 pointer-events-none"></div>
        </div>
      </motion.div>
    </Link>
  )
}
