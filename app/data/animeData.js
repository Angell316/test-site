'use client'

import { 
  getTopAnime, 
  getCurrentSeasonAnime, 
  getUpcomingAnime,
  getCachedData,
  setCachedData 
} from '@/lib/jikanAPI'

// Получить все аниме (комбинация API данных и кастомных)
export const getAllAnime = async () => {
  try {
    // Проверяем кэш
    const cacheKey = 'all_anime_data'
    const cached = getCachedData(cacheKey)
    if (cached) {
      return addCustomAnime(cached)
    }

    // Получаем топ популярных аниме
    const popular = await getTopAnime('bypopularity', 1, 25)
    
    // Кэшируем результат
    setCachedData(cacheKey, popular)
    
    // Добавляем кастомные аниме из localStorage
    return addCustomAnime(popular)
  } catch (error) {
    console.error('Failed to fetch anime:', error)
    return getCustomAnime() // Fallback to custom anime only
  }
}

// Получить популярные аниме
export const getPopularAnime = async (limit = 20) => {
  try {
    const cacheKey = `popular_anime_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getTopAnime('bypopularity', 1, limit)
    setCachedData(cacheKey, anime)
    return anime
  } catch (error) {
    console.error('Failed to fetch popular anime:', error)
    return []
  }
}

// Получить онгоинги (текущий сезон)
export const getOngoingAnime = async (limit = 20) => {
  try {
    const cacheKey = `ongoing_anime_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getCurrentSeasonAnime(1)
    const ongoing = anime
      .filter(a => a.status === 'Онгоинг')
      .slice(0, limit)
    
    setCachedData(cacheKey, ongoing)
    return ongoing
  } catch (error) {
    console.error('Failed to fetch ongoing anime:', error)
    return []
  }
}

// Получить анонсированные аниме
export const getUpcomingAnimeList = async (limit = 20) => {
  try {
    const cacheKey = `upcoming_anime_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getUpcomingAnime(1)
    const upcoming = anime.slice(0, limit)
    
    setCachedData(cacheKey, upcoming)
    return upcoming
  } catch (error) {
    console.error('Failed to fetch upcoming anime:', error)
    return []
  }
}

// Получить топ аниме (по рейтингу)
export const getTopRatedAnime = async (limit = 20) => {
  try {
    const cacheKey = `top_rated_anime_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getTopAnime('favorite', 1, limit)
    setCachedData(cacheKey, anime)
    return anime
  } catch (error) {
    console.error('Failed to fetch top rated anime:', error)
    return []
  }
}

// Функции для работы с кастомными аниме (добавленными админами)
function getCustomAnime() {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('custom_anime')
  return data ? JSON.parse(data) : []
}

function addCustomAnime(apiAnime) {
  const customAnime = getCustomAnime()
  return [...apiAnime, ...customAnime]
}

export function saveAnime(anime) {
  if (typeof window === 'undefined') return
  
  const customAnime = getCustomAnime()
  const newAnime = {
    ...anime,
    id: `custom_${Date.now()}`, // Уникальный ID для кастомных аниме
    isCustom: true
  }
  
  customAnime.push(newAnime)
  localStorage.setItem('custom_anime', JSON.stringify(customAnime))
  return newAnime
}

export function deleteAnime(animeId) {
  if (typeof window === 'undefined') return
  
  const customAnime = getCustomAnime()
  const filtered = customAnime.filter(anime => anime.id !== animeId)
  localStorage.setItem('custom_anime', JSON.stringify(filtered))
}

export function getAnimeById(id) {
  // Сначала проверяем в кастомных
  const customAnime = getCustomAnime()
  const custom = customAnime.find(anime => anime.id === id)
  if (custom) return custom
  
  // Если не найдено, возвращаем null (данные будут загружены из API)
  return null
}

// Инициализация при загрузке приложения
export async function initializeAnimeData() {
  try {
    // Предзагрузка популярных аниме
    await getPopularAnime(25)
    await getOngoingAnime(20)
    console.log('Anime data initialized successfully')
  } catch (error) {
    console.error('Failed to initialize anime data:', error)
  }
}
