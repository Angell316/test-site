'use client'

import { 
  getAnimeList,
  getPopularAnime as getKodikPopular,
  getOngoingAnime as getKodikOngoing,
  getLatestUpdates,
  searchAnime as searchKodikAnime,
  getAnimeByShikimoriId,
  getAnimeByKinopoiskId,
  getCachedData,
  setCachedData 
} from '@/lib/kodikAPI'

import { enrichAnimeData, enrichAnimeList } from '@/lib/enrichmentAPI'

// Получить все аниме (комбинация Kodik API данных и кастомных) - С ОБОГАЩЕНИЕМ
export const getAllAnime = async () => {
  try {
    // Проверяем кэш
    const cacheKey = 'all_anime_data_enriched'
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
    
    // ОБОГАЩАЕМ ДАННЫЕ из разных источников
    console.log('Enriching anime data from multiple sources...')
    const enrichedAnime = await enrichAnimeList(uniqueAnime, 20) // Обогащаем первые 20
    
    // Кэшируем результат
    setCachedData(cacheKey, enrichedAnime)
    
    // Добавляем кастомные аниме из localStorage
    return addCustomAnime(enrichedAnime)
  } catch (error) {
    console.error('Failed to fetch anime:', error)
    return getCustomAnime() // Fallback to custom anime only
  }
}

// Получить популярные аниме - С ОБОГАЩЕНИЕМ
export const getPopularAnime = async (limit = 50) => {
  try {
    const cacheKey = `popular_anime_enriched_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getKodikPopular(limit)
    
    // ОБОГАЩАЕМ первые аниме
    const enriched = await enrichAnimeList(anime, Math.min(limit, 20))
    
    setCachedData(cacheKey, enriched)
    return enriched
  } catch (error) {
    console.error('Failed to fetch popular anime:', error)
    return []
  }
}

// Получить онгоинги - С ОБОГАЩЕНИЕМ
export const getOngoingAnime = async (limit = 50) => {
  try {
    const cacheKey = `ongoing_anime_enriched_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getKodikOngoing(limit)
    
    // ОБОГАЩАЕМ первые аниме
    const enriched = await enrichAnimeList(anime, Math.min(limit, 15))
    
    setCachedData(cacheKey, enriched)
    return enriched
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

// Получить топ аниме (по рейтингу) - С ОБОГАЩЕНИЕМ
export const getTopRatedAnime = async (limit = 50) => {
  try {
    const cacheKey = `top_rated_anime_enriched_${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const anime = await getKodikPopular(limit)
    
    // ОБОГАЩАЕМ первые аниме
    const enriched = await enrichAnimeList(anime, Math.min(limit, 15))
    
    setCachedData(cacheKey, enriched)
    return enriched
  } catch (error) {
    console.error('Failed to fetch top rated anime:', error)
    return []
  }
}

// Поиск аниме
export const searchAnime = async (query, limit = 50) => {
  try {
    if (!query || query.trim().length < 2) return []
    
    const results = await searchKodikAnime(query, { limit })
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
    id: `custom_${Date.now()}`,
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

// Получить аниме по ID - С ПОЛНЫМ ОБОГАЩЕНИЕМ
export async function getAnimeById(id) {
  // Сначала проверяем в кастомных
  const customAnime = getCustomAnime()
  const custom = customAnime.find(anime => anime.id === id || anime.id === String(id))
  if (custom) return custom
  
  // Если не найдено в кастомных, ищем в API данных
  try {
    // Пытаемся загрузить по Shikimori ID или Kinopoisk ID
    let apiAnime = null
    
    if (!id.toString().startsWith('custom_')) {
      // Пробуем как Shikimori ID
      apiAnime = await getAnimeByShikimoriId(id)
      
      // Если не найдено, пробуем как Kinopoisk ID
      if (!apiAnime) {
        apiAnime = await getAnimeByKinopoiskId(id)
      }
    }
    
    // Если всё ещё не найдено, ищем в общем списке
    if (!apiAnime) {
      const allAnime = await getAllAnime()
      apiAnime = allAnime.find(anime => 
        anime.id === id || 
        anime.id === String(id) ||
        anime.shikimori_id === id ||
        anime.shikimori_id === String(id) ||
        anime.kinopoisk_id === id ||
        anime.kinopoisk_id === String(id)
      )
    }
    
    // ОБОГАЩАЕМ ПОЛНОСТЬЮ это аниме для детальной страницы
    if (apiAnime && !apiAnime.enriched) {
      console.log(`Enriching anime ${apiAnime.title} with additional data...`)
      apiAnime = await enrichAnimeData(apiAnime)
    }
    
    return apiAnime || null
  } catch (error) {
    console.error('Failed to fetch anime by ID:', error)
    return null
  }
}

// Инициализация при загрузке приложения
export async function initializeAnimeData() {
  try {
    // Предзагрузка популярных аниме и онгоингов (с обогащением)
    await Promise.all([
      getPopularAnime(50),
      getOngoingAnime(30),
      getLatestUpdates(30)
    ])
    console.log('Anime data initialized successfully from Kodik + enrichment APIs')
  } catch (error) {
    console.error('Failed to initialize anime data:', error)
  }
}
