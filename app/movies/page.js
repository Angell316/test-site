import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import { animeMovies } from '@/app/data/animeData'
import { Film, Search, Filter } from 'lucide-react'

export default function MoviesPage() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="container-custom">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                Аниме-фильмы
              </h1>
              <p className="text-gray-400 mt-2">
                Найдено {animeMovies.length} фильмов
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск фильмов..."
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all"
              />
            </div>
            <button className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl glass-effect hover:bg-white hover:bg-opacity-10 transition-all">
              <Filter className="w-5 h-5 text-crimson-primary" />
              <span className="text-white font-medium">Фильтры</span>
            </button>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {animeMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AnimeCard anime={movie} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

