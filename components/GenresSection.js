'use client'

import { Grid, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { GENRES } from '@/lib/jikanAPI'

export default function GenresSection() {
  const genreList = Object.keys(GENRES)

  return (
    <section className="section-padding bg-dark-800">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex items-center space-x-4 mb-12">
          <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
            <Grid className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Жанры
            </h2>
            <p className="text-gray-400 mt-1">
              Найди аниме по своему вкусу
            </p>
          </div>
        </div>

        {/* Genres Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {genreList.map((genre, index) => (
            <Link
              key={genre}
              href={`/anime?genre=${encodeURIComponent(genre)}`}
              className="group relative overflow-hidden p-6 rounded-2xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover-lift animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white group-hover:text-crimson-primary transition-colors">
                  {genre}
                </h3>
                <ArrowRight className="w-5 h-5 text-crimson-primary mt-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
              </div>
              
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-crimson-primary opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-20 transition-opacity"></div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center space-y-6 p-12 rounded-3xl glass-effect">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
              <Grid className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                Не знаешь, что посмотреть?
              </h3>
              <p className="text-gray-400 max-w-md">
                Воспользуйся нашими подборками или выбери жанр по настроению
              </p>
            </div>
            <Link
              href="/anime"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-semibold shadow-crimson-glow hover:shadow-crimson-glow-lg transition-all duration-300 hover:scale-105"
            >
              Исследовать каталог
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

