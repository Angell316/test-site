'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
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
        whileHover={{ y: -3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-2xl border border-white/5 hover:border-crimson-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-crimson-primary/20"
      >
        {/* Full Image Container with Fixed Aspect Ratio */}
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
              <Star className="w-16 h-16 text-crimson-primary/30" />
            </div>
          )}

          {/* Rating Badge - Top Right Corner */}
          {anime.rating > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 flex items-center space-x-1 bg-dark-900/90 backdrop-blur-xl px-2.5 py-1.5 rounded-full shadow-lg border border-white/10 z-20"
            >
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">
                {anime.rating.toFixed(1)}
              </span>
            </motion.div>
          )}

          {/* Smooth Bottom Gradient with Title - Always Visible */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 via-30% to-transparent to-70% pt-16">
            <h3 className="text-base md:text-lg font-bold text-white line-clamp-2 leading-tight drop-shadow-2xl">
              {anime.title}
            </h3>
          </div>

          {/* Hover Overlay with Additional Info */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-dark-900/85 backdrop-blur-sm flex flex-col items-center justify-center p-5 z-10"
              >
                {/* Status Badge - Center */}
                {anime.status && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-crimson-primary to-crimson-dark backdrop-blur-xl shadow-2xl shadow-crimson-primary/50 mb-4"
                  >
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      {anime.status}
                    </span>
                  </motion.div>
                )}

                {/* Additional Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.05 }}
                  className="w-full space-y-2.5 text-center"
                >
                  {/* Russian Title - Show on hover */}
                  <h4 className="text-base md:text-lg font-bold text-white line-clamp-2 px-2 drop-shadow-lg">
                    {anime.title}
                  </h4>
                  
                  {/* English Title */}
                  {anime.titleEn && (
                    <p className="text-xs text-gray-400 line-clamp-2 px-2">
                      {anime.titleEn}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    {anime.year && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xl font-semibold">
                        {anime.year}
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xl font-semibold">
                        {anime.episodes} эп.
                      </span>
                    )}
                  </div>

                  {/* Genres - Limit to 2 for better fit */}
                  {anime.genre && anime.genre.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 px-2 max-w-full">
                      {anime.genre.slice(0, 2).map((genre, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.15 + index * 0.05 }}
                          className="px-2 py-0.5 text-xs font-medium bg-white/10 backdrop-blur-xl rounded-lg text-gray-300 border border-white/10"
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
