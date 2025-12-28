'use client'

import { Grid, ArrowRight, Sparkles, Compass } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function GenresSection({ genres = [] }) {
  // Проверка на наличие данных
  if (!genres || genres.length === 0) {
    return null
  }

  return (
    <section className="relative py-20 md:py-28 bg-dark-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600 rounded-full blur-[140px] opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-crimson-primary rounded-full blur-[120px] opacity-25"></div>
      </div>

      <div className="relative container-custom px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center space-x-4 md:space-x-6 mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            viewport={{ once: true }}
            className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-crimson-primary to-crimson-dark shadow-2xl shadow-blue-600/30"
          >
            <Compass className="w-7 h-7 md:w-8 md:h-8 text-white" />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-crimson-primary blur-xl opacity-50"
            ></motion.div>
          </motion.div>
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
              Жанры
            </h2>
            <p className="text-gray-400 mt-2 text-sm md:text-base font-medium">
              Найди аниме по своему вкусу
            </p>
          </div>
        </motion.div>

        {/* Genres Grid with stagger */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {genres.map((genre, index) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/anime?genre=${encodeURIComponent(genre)}`}
                className="group relative overflow-hidden block p-5 md:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-crimson-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative z-10">
                  <h3 className="text-base md:text-lg font-bold text-white group-hover:text-crimson-light transition-colors">
                    {genre}
                  </h3>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="flex items-center space-x-1 mt-2"
                  >
                    <span className="text-xs text-crimson-primary font-semibold">Смотреть</span>
                    <ArrowRight className="w-4 h-4 text-crimson-primary" />
                  </motion.div>
                </div>
                
                {/* Decorative gradient */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-crimson-primary to-transparent opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-opacity duration-500"></div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-24"
        >
          <div className="relative overflow-hidden p-12 md:p-16 rounded-3xl bg-gradient-to-br from-dark-900/80 to-dark-800/80 backdrop-blur-xl border border-white/10">
            {/* Background decoration inside CTA */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-primary rounded-full blur-[100px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative text-center space-y-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block p-5 rounded-3xl bg-gradient-to-br from-crimson-primary via-crimson-dark to-blue-600 shadow-2xl shadow-crimson-primary/30"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <div className="space-y-3 max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white">
                  Не знаешь, что посмотреть?
                </h3>
                <p className="text-gray-400 text-base md:text-lg font-medium">
                  Воспользуйся нашими подборками или выбери жанр по настроению
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/anime"
                  className="inline-flex items-center space-x-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-crimson-primary via-crimson-dark to-blue-600 text-white font-bold text-lg shadow-2xl shadow-crimson-primary/40 hover:shadow-crimson-primary/60 transition-all duration-300"
                >
                  <span>Исследовать каталог</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

