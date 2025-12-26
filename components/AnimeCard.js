'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Star } from 'lucide-react'
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
        className="relative overflow-hidden rounded-2xl border border-white/5 hover:border-crimson-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-crimson-primary/20"
      >
        {/* Full Image Container with Fixed Aspect Ratio - Increased height */}
        <div className="relative aspect-[2/3.5] overflow-hidden bg-gradient-to-br from-dark-700 to-dark-800">
          {!imageError ? (
            <Image
              src={anime.image}
              alt={anime.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              priority={false}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800">
              <Play className="w-16 h-16 text-crimson-primary/30" />
            </div>
          )}

          {/* Permanent Bottom Gradient with Main Info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/95 to-transparent pt-8">
            <div className="space-y-2.5">
              {/* Title - Always Visible */}
              <h3 className="text-base md:text-lg font-bold text-white line-clamp-2 leading-tight drop-shadow-lg">
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
          </div>

          {/* Hover Overlay with Additional Info */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-10"
              >
                {/* Play Button */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gradient-to-r from-crimson-primary to-crimson-dark rounded-full p-5 shadow-2xl shadow-crimson-primary/50 mb-6"
                >
                  <Play className="w-10 h-10 text-white fill-white" />
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.1 }}
                  className="w-full space-y-3 text-center"
                >
                  {/* Russian Title - Show on hover */}
                  <h4 className="text-base md:text-lg font-bold text-white line-clamp-2 px-2 drop-shadow-lg">
                    {anime.title}
                  </h4>
                  
                  {/* English Title */}
                  {anime.titleEn && (
                    <p className="text-sm text-gray-400 line-clamp-2 px-2">
                      {anime.titleEn}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                    {anime.year && (
                      <span className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xl font-semibold">
                        {anime.year}
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xl font-semibold">
                        {anime.episodes} эп.
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  {anime.genre && anime.genre.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 px-2">
                      {anime.genre.slice(0, 3).map((genre, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className="px-2.5 py-1 text-xs font-medium bg-white/10 backdrop-blur-xl rounded-lg text-gray-300 border border-white/10"
                        >
                          {genre}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Link>
  )
}
