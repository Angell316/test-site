import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Grid, Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      
      {/* Page Header Skeleton */}
      <section className="pt-32 pb-8 px-6 lg:px-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow animate-pulse">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="h-12 w-64 bg-white/10 rounded-lg animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-white/5 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="relative mb-6">
            <div className="w-full h-14 rounded-xl bg-white/10 animate-pulse"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 w-32 bg-white/10 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="pb-24 px-6 lg:px-12">
        <div className="container-custom">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-crimson-primary animate-spin mx-auto mb-4" />
              <p className="text-white text-lg font-medium">Загрузка каталога...</p>
              <p className="text-gray-400 text-sm mt-2">Это может занять несколько секунд</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

