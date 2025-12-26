import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import { getTopAnime } from '@/lib/animeDatabase'
import { TrendingUp } from 'lucide-react'

export default function TopPage() {
  const sortedAnime = getTopAnime(50)

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="container-custom">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                Топ аниме
              </h1>
              <p className="text-gray-400 mt-2">
                Лучшие аниме по рейтингу
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Anime Grid */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {sortedAnime.map((anime, index) => (
              <div
                key={anime.id}
                className="relative animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Rank badge */}
                <div className="absolute -top-3 -left-3 z-10 w-10 h-10 rounded-full bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

