'use client'

import AnimeCard from './AnimeCard'
import { animeMovies } from '@/app/data/animeData'
import { Film, ChevronRight, Clapperboard } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function MoviesSection() {
  // Проверка на наличие данных
  if (!animeMovies || animeMovies.length === 0) {
    return null
  }

  return (
    <section className="relative py-20 md:py-28 bg-dark-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-600 rounded-full blur-[130px] opacity-25"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-crimson-primary rounded-full blur-[110px] opacity-30"></div>
      </div>

      <div className="relative container-custom px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div className="flex items-center space-x-4 md:space-x-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
              className="relative p-4 rounded-2xl bg-gradient-to-br from-yellow-600 via-crimson-primary to-crimson-dark shadow-2xl shadow-yellow-600/30"
            >
              <Clapperboard className="w-7 h-7 md:w-8 md:h-8 text-white" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-600 to-crimson-primary blur-xl opacity-50"
              ></motion.div>
            </motion.div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                Аниме-фильмы
              </h2>
              <p className="text-gray-400 mt-2 text-sm md:text-base font-medium">
                Лучшие полнометражные аниме
              </p>
            </div>
          </div>
          <Link
            href="/movies"
            className="hidden md:flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-yellow-600/50 transition-all duration-300 group"
          >
            <span className="text-white font-semibold">Все фильмы</span>
            <ChevronRight className="w-5 h-5 text-yellow-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Cards Grid with stagger animation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {animeMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <AnimeCard anime={movie} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="md:hidden mt-10 flex justify-center"
        >
          <Link
            href="/movies"
            className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-600 via-crimson-primary to-crimson-dark text-white font-bold shadow-2xl shadow-yellow-600/30 hover:shadow-yellow-600/50 transition-all duration-300 group"
          >
            <span>Все фильмы</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

