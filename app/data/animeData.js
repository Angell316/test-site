'use client'

import { 
  getAnimeList,
  getPopularAnime as getKodikPopular,
  getOngoingAnime as getKodikOngoing,
  getLatestUpdates,
  searchAnime as searchKodikAnime,
  getCachedData,
  setCachedData 
} from '@/lib/kodikAPI'

// Получить все аниме (комбинация Kodik API данных и кастомных)
export const getAllAnime = async () => {
  try {
    // Проверяем кэш
    const cacheKey = 'all_anime_data'
    const cached = getCachedData(cacheKey)
    if (cached) {
      return addCustomAnime(cached)
    }

    // Получаем аниме из Kodik (последние обновления + популярные)
    const [latest, popular] = await Promise.all([
      getLatestUpdates(50),
      getKodikPopular(50)
    ])
    
    // Объединяем и удаляем дубликаты по ID
    const allAnime = [...latest, ...popular]
    const uniqueAnime = Array.from(
      new Map(allAnime.map(anime => [anime.id, anime])).values()
    )
    
    // Кэшируем результат
    setCachedData(cacheKey, uniqueAnime)
    
    // Добавляем кастомные аниме из localStorage
    return addCustomAnime(uniqueAnime)
  } catch (error) {
    console.error('Failed to fetch anime:', error)
    return getCustomAnime() // Fallback to custom anime only
  }
}

// Получить популярные аниме
export const getPopularAnime = async (limit = 50) => {
  try {
    const cacheKey = `popular_anime_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getKodikPopular(limit)
    setCachedData(cacheKey, anime)
    return anime
  } catch (error) {
    console.error('Failed to fetch popular anime:', error)
    return []
  }
}

// Получить онгоинги
export const getOngoingAnime = async (limit = 50) => {
  try {
    const cacheKey = `ongoing_anime_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getKodikOngoing(limit)
    setCachedData(cacheKey, anime)
    return anime
  } catch (error) {
    console.error('Failed to fetch ongoing anime:', error)
    return []
  }
}

// Получить последние обновления
export const getUpcomingAnimeList = async (limit = 50) => {
  try {
    const cacheKey = `latest_anime_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getLatestUpdates(limit)
    setCachedData(cacheKey, anime)
    return anime
  } catch (error) {
    console.error('Failed to fetch latest anime:', error)
    return []
  }
}

// Получить топ аниме (по рейтингу)
export const getTopRatedAnime = async (limit = 50) => {
  try {
    const cacheKey = `top_rated_anime_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getKodikPopular(limit) // Популярные обычно и топовые
    setCachedData(cacheKey, anime)
    return anime
  } catch (error) {
    console.error('Failed to fetch top rated anime:', error)
    return []
  }
}

// Поиск аниме
export const searchAnime = async (query, limit = 50) => {
  try {
    if (!query || query.trim().length < 2) return []
    
    const results = await searchKodikAnime(query, limit)
    return results
  } catch (error) {
    console.error('Failed to search anime:', error)
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
    isCustom: true,
    source: 'custom'
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

export async function getAnimeById(id) {
  // Сначала проверяем в кастомных
  const customAnime = getCustomAnime()
  const custom = customAnime.find(anime => anime.id === id || anime.id === String(id))
  if (custom) return custom
  
  // Если не найдено в кастомных, ищем в API данных
  try {
    const allAnime = await getAllAnime()
    const found = allAnime.find(anime => 
      anime.id === id || 
      anime.id === String(id) ||
      anime.shikimori_id === id ||
      anime.shikimori_id === String(id)
    )
    return found || null
  } catch (error) {
    console.error('Failed to fetch anime by ID:', error)
    return null
  }
}

// Инициализация при загрузке приложения
export async function initializeAnimeData() {
  try {
    // Предзагрузка популярных аниме и онгоингов
    await Promise.all([
      getPopularAnime(50),
      getOngoingAnime(30),
      getLatestUpdates(30)
    ])
    console.log('Anime data initialized successfully from Kodik')
  } catch (error) {
    console.error('Failed to initialize anime data:', error)
  }
}
