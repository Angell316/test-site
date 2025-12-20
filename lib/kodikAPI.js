// Kodik API v4 Integration
// Полная документация: https://bd.kodik.biz/api/info
// API Token: 082375dbed6b23d19d3e43ba83e6c534

const KODIK_API_BASE = 'https://kodikapi.com'
const KODIK_API_TOKEN = '082375dbed6b23d19d3e43ba83e6c534'

// Rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 500 // 0.5 second

async function makeKodikRequest(endpoint, params = {}) {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }
  
  lastRequestTime = Date.now()
  
  const queryParams = new URLSearchParams({
    token: KODIK_API_TOKEN,
    ...params
  })
  
  try {
    const response = await fetch(`${KODIK_API_BASE}${endpoint}?${queryParams}`)
    if (!response.ok) {
      throw new Error(`Kodik API Error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Kodik API request failed:', error)
    throw error
  }
}

// Transform Kodik data to our format
function transformAnime(item) {
  // Используем material_data если доступно
  const materialData = item.material_data || {}
  
  return {
    id: item.shikimori_id || item.kinopoisk_id || `kodik_${item.id}`,
    kodikId: item.id,
    title: materialData.title || item.title || 'Без названия',
    titleEn: materialData.title_en || item.title_orig || item.title,
    titleJp: materialData.other_title || item.other_title || '',
    image: materialData.poster_url || 
           materialData.anime_poster_url || 
           (item.screenshots && item.screenshots[0]) || 
           'https://via.placeholder.com/300x400?text=No+Image',
    rating: materialData.shikimori_rating || 
            materialData.kinopoisk_rating || 
            materialData.imdb_rating || 
            'N/A',
    year: materialData.year || item.year || null,
    episodes: item.episodes_count || 
              materialData.episodes_total || 
              materialData.episodes_aired || 
              item.last_episode || 
              null,
    duration: materialData.duration ? `${materialData.duration} мин` : null,
    status: materialData.anime_status === 'ongoing' || materialData.all_status === 'ongoing' ? 'Онгоинг' :
            materialData.anime_status === 'released' || materialData.all_status === 'released' ? 'Завершён' :
            materialData.anime_status === 'anons' || materialData.all_status === 'anons' ? 'Анонс' :
            item.ongoing ? 'Онгоинг' : 'Завершён',
    genre: materialData.all_genres || 
           materialData.anime_genres || 
           materialData.genres || 
           [],
    description: materialData.anime_description || 
                 materialData.description || 
                 'Описание отсутствует',
    trailer: null,
    studios: materialData.anime_studios || [],
    type: item.type || 'anime-serial',
    
    // Дополнительная информация
    link: item.link,
    translation: item.translation?.title || 'Оригинал',
    translationId: item.translation?.id || null,
    translationType: item.translation?.type || null,
    quality: item.quality || 'HD',
    camrip: item.camrip || false,
    lgbt: item.lgbt || false,
    blocked_countries: item.blocked_countries || [],
    
    // IDs для поиска
    shikimori_id: item.shikimori_id || null,
    imdb_id: item.imdb_id || null,
    kinopoisk_id: item.kinopoisk_id || null,
    mdl_id: item.mdl_id || null,
    worldart_link: item.worldart_link || materialData.worldart_link || null,
    
    // Метаданные
    seasons_count: item.last_season || materialData.episodes_total || null,
    last_episode: item.last_episode || null,
    episodes_aired: materialData.episodes_aired || null,
    
    // Дополнительно из material_data
    countries: materialData.countries || [],
    actors: materialData.actors || [],
    directors: materialData.directors || [],
    rating_mpaa: materialData.rating_mpaa || null,
    minimal_age: materialData.minimal_age || null,
    
    source: 'kodik'
  }
}

/**
 * /list - Получить список аниме
 * Документация: https://kodikapi.com/list
 */
export async function getAnimeList(options = {}) {
  try {
    const defaultOptions = {
      types: 'anime-serial,anime',
      limit: 100,
      with_material_data: true,
      sort: 'updated_at',
      order: 'desc',
      camrip: false, // Фильтруем камрип
      ...options
    }
    
    const data = await makeKodikRequest('/list', defaultOptions)
    
    if (!data.results || data.results.length === 0) {
      return []
    }
    
    return data.results.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch anime list from Kodik:', error)
    return []
  }
}

/**
 * /search - Поиск аниме
 * Документация: https://kodikapi.com/search
 */
export async function searchAnime(query, options = {}) {
  try {
    if (!query || query.trim().length < 2) return []
    
    const searchOptions = {
      title: query,
      types: 'anime-serial,anime',
      limit: 50,
      with_material_data: true,
      camrip: false,
      ...options
    }
    
    const data = await makeKodikRequest('/search', searchOptions)
    
    if (!data.results || data.results.length === 0) {
      return []
    }
    
    return data.results.map(transformAnime)
  } catch (error) {
    console.error('Failed to search anime on Kodik:', error)
    return []
  }
}

/**
 * Получить популярные аниме (по рейтингу Shikimori)
 */
export async function getPopularAnime(limit = 50) {
  return getAnimeList({
    limit: limit,
    sort: 'shikimori_rating',
    order: 'desc',
    has_field: 'shikimori_id',
    with_material_data: true
  })
}

/**
 * Получить онгоинги (аниме которые сейчас выходят)
 */
export async function getOngoingAnime(limit = 50) {
  const currentYear = new Date().getFullYear()
  return getAnimeList({
    limit: limit,
    year: `${currentYear}`,
    anime_status: 'ongoing',
    sort: 'updated_at',
    order: 'desc',
    with_material_data: true
  })
}

/**
 * Получить последние обновления
 */
export async function getLatestUpdates(limit = 50) {
  return getAnimeList({
    limit: limit,
    sort: 'updated_at',
    order: 'desc',
    with_material_data: true
  })
}

/**
 * Получить аниме по жанру
 */
export async function getAnimeByGenre(genre, limit = 50) {
  return getAnimeList({
    limit: limit,
    anime_genres: genre,
    sort: 'shikimori_rating',
    order: 'desc',
    with_material_data: true
  })
}

/**
 * Получить аниме по году
 */
export async function getAnimeByYear(year, limit = 50) {
  return getAnimeList({
    limit: limit,
    year: year.toString(),
    sort: 'shikimori_rating',
    order: 'desc',
    with_material_data: true
  })
}

/**
 * Получить аниме по Shikimori ID
 */
export async function getAnimeByShikimoriId(shikimoriId) {
  try {
    const data = await makeKodikRequest('/search', {
      shikimori_id: shikimoriId,
      types: 'anime-serial,anime',
      with_material_data: true,
      with_episodes: true
    })
    
    if (!data.results || data.results.length === 0) {
      return null
    }
    
    return transformAnime(data.results[0])
  } catch (error) {
    console.error('Failed to fetch anime by Shikimori ID:', error)
    return null
  }
}

/**
 * Получить аниме по Kinopoisk ID
 */
export async function getAnimeByKinopoiskId(kinopoiskId) {
  try {
    const data = await makeKodikRequest('/search', {
      kinopoisk_id: kinopoiskId,
      types: 'anime-serial,anime',
      with_material_data: true
    })
    
    if (!data.results || data.results.length === 0) {
      return null
    }
    
    return transformAnime(data.results[0])
  } catch (error) {
    console.error('Failed to fetch anime by Kinopoisk ID:', error)
    return null
  }
}

/**
 * /translations/v2 - Получить все озвучки для аниме
 * Документация: https://kodikapi.com/translations/v2
 */
export async function getAnimeTranslations(shikimoriId) {
  try {
    const data = await makeKodikRequest('/search', {
      shikimori_id: shikimoriId,
      types: 'anime-serial,anime',
      with_material_data: true
    })
    
    if (!data.results || data.results.length === 0) {
      return []
    }
    
    return data.results.map(item => ({
      id: item.translation?.id || null,
      title: item.translation?.title || 'Оригинал',
      type: item.translation?.type || null,
      link: item.link,
      episodes: item.episodes_count || 0,
      quality: item.quality || 'HD'
    }))
  } catch (error) {
    console.error('Failed to fetch translations:', error)
    return []
  }
}

/**
 * /genres - Получить список жанров
 * Документация: https://kodikapi.com/genres
 */
export async function getGenres() {
  try {
    const data = await makeKodikRequest('/genres', {
      genres_type: 'shikimori',
      types: 'anime-serial,anime'
    })
    
    return data.results || []
  } catch (error) {
    console.error('Failed to fetch genres:', error)
    return []
  }
}

/**
 * /years - Получить список годов
 * Документация: https://kodikapi.com/years
 */
export async function getYears() {
  try {
    const data = await makeKodikRequest('/years', {
      types: 'anime-serial,anime'
    })
    
    return data.results || []
  } catch (error) {
    console.error('Failed to fetch years:', error)
    return []
  }
}

// Cache system
const cache = new Map()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export function getCachedData(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

export function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Prefetch popular anime
export async function prefetchPopularAnime() {
  const cacheKey = 'kodik_popular_anime'
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    const popular = await getPopularAnime(50)
    setCachedData(cacheKey, popular)
    return popular
  } catch (error) {
    console.error('Failed to prefetch popular anime:', error)
    return []
  }
}

export default {
  getAnimeList,
  searchAnime,
  getPopularAnime,
  getOngoingAnime,
  getLatestUpdates,
  getAnimeByGenre,
  getAnimeByYear,
  getAnimeByShikimoriId,
  getAnimeByKinopoiskId,
  getAnimeTranslations,
  getGenres,
  getYears,
  prefetchPopularAnime,
  getCachedData,
  setCachedData
}
