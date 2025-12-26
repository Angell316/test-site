// Импорт утилит для работы с реальной базой данных
import { 
  getHomePageData, 
  getAllGenres, 
  getAnimeMovies,
  normalizeAnime
} from '@/lib/animeDatabase'

// Функция для получения всех аниме (включая кастомные)
export const getAllAnime = () => {
  const customAnime = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('custom_anime') || '[]')
    : []
  
  const homeData = getHomePageData()
  const allFromDb = [...homeData.featured, ...homeData.popular, ...homeData.trending]
  
  return [...allFromDb, ...customAnime]
}

// Получение реальных данных из базы - загружаем всегда одинаково
const homeData = getHomePageData()

export const featuredAnime = homeData.featured || []
export const popularAnime = homeData.popular || []
export const animeMovies = getAnimeMovies(8) || []
export const genres = getAllGenres() || []
