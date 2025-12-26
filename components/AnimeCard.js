'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play, Star, Calendar, Eye, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
        className="relative overflow-hidden rounded-2xl bg-dark-800/50 backdrop-blur-xl border border-white/5 hover:border-crimson-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-crimson-primary/20"
      >
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-dark-700 to-dark-800">
          {!imageError ? (
            <>
              <Image
                src={anime.image}
                alt={anime.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                onError={() => setImageError(true)}
              />
              {/* Gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800">
              <Play className="w-16 h-16 text-crimson-primary/30" />
            </div>
          )}

          {/* Top badges container */}
          <div className="absolute top-3 inset-x-3 flex items-start justify-between z-10">
            {/* Status badge */}
            {anime.status && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-crimson-primary to-crimson-dark backdrop-blur-xl shadow-lg"
              >
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  {anime.status}
                </span>
              </motion.div>
            )}

            {/* Rating badge */}
            {anime.rating > 0 && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center space-x-1 bg-dark-900/90 backdrop-blur-xl px-2.5 py-1.5 rounded-full shadow-lg border border-white/10"
              >
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">
                  {anime.rating.toFixed(1)}
                </span>
              </motion.div>
            )}
          </div>

          {/* Play button overlay with better animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center bg-dark-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="bg-gradient-to-r from-crimson-primary to-crimson-dark rounded-full p-4 shadow-2xl shadow-crimson-primary/50"
            >
              <Play className="w-8 h-8 text-white fill-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Info Section with glass effect */}
        <div className="relative p-4 space-y-2.5 bg-gradient-to-b from-dark-800/80 to-dark-900/80 backdrop-blur-xl">
          {/* Title with better typography */}
          <div className="space-y-1">
            <h3 className="text-sm md:text-base font-bold text-white line-clamp-1 group-hover:text-crimson-light transition-colors duration-300">
              {anime.title}
            </h3>
            {anime.titleEn && (
              <p className="text-xs text-gray-500 line-clamp-1 font-medium">
                {anime.titleEn}
              </p>
            )}
          </div>

          {/* Meta info with icons */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-gray-400">
            {anime.year && (
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-white/5">
                <Calendar className="w-3 h-3" />
                <span className="font-semibold">{anime.year}</span>
              </div>
            )}
            {anime.episodes && (
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-white/5">
                <Eye className="w-3 h-3" />
                <span className="font-semibold">{anime.episodes} эп.</span>
              </div>
            )}
          </div>

          {/* Genres with hover effect */}
          {anime.genre && anime.genre.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {anime.genre.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-semibold bg-white/5 backdrop-blur-xl rounded-lg text-gray-400 border border-white/5 hover:border-crimson-primary/50 hover:text-crimson-light transition-all duration-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Subtle bottom glow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-crimson-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </motion.div>
    </Link>
  )
}
