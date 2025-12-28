import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <main className="min-h-screen bg-dark-900">
      <Header />
      
      <div className="container-custom px-6 lg:px-12 pt-32 pb-24">
        {/* Hero Section Skeleton */}
        <div className="mb-12">
          <div className="h-96 bg-white/10 rounded-2xl animate-pulse"></div>
        </div>

        {/* Loading Message */}
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-crimson-primary animate-spin mx-auto mb-4" />
            <p className="text-white text-xl font-medium">Загрузка аниме...</p>
            <p className="text-gray-400 text-sm mt-2">Подождите немного</p>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="h-8 bg-white/10 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-white/5 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-white/5 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-white/5 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
          <div>
            <div className="h-64 bg-white/10 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

