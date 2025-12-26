'use client'

import AnimeCard from './AnimeCard'
import { TrendingUp, ChevronRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TrendingSection({ anime }) {
  return (
    <section className="relative py-20 md:py-28 bg-dark-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-600 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-crimson-primary rounded-full blur-[140px] opacity-20"></div>
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
              className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-600 via-crimson-primary to-crimson-dark shadow-2xl shadow-purple-600/30"
            >
              <TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-white" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600 to-crimson-primary blur-xl opacity-50"
              ></motion.div>
            </motion.div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                Популярное сейчас
              </h2>
              <p className="text-gray-400 mt-2 text-sm md:text-base font-medium">
                Самые обсуждаемые тайтлы недели
              </p>
            </div>
          </div>
          <Link
            href="/top"
            className="hidden md:flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <span className="text-white font-semibold">Весь топ</span>
            <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Cards Grid with stagger animation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {anime.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <AnimeCard anime={item} />
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
            href="/top"
            className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-crimson-primary to-crimson-dark text-white font-bold shadow-2xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 group"
          >
            <span>Весь топ</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

