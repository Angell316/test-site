// Kodik API Integration
// Документация: https://bd.kodik.biz/api/info

const KODIK_API_BASE = 'https://kodikapi.com'
const KODIK_API_TOKEN = '082375dbed6b23d19d3e43ba83e6c534'

// Rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 500 // 0.5 second between requests

async function makeKodikRequest(endpoint, params = {}) {
  // Ensure we don't exceed rate limits
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }
  
  lastRequestTime = Date.now()
  
  // Add token to params
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
  const shikimoriId = item.shikimori_id || item.kinopoisk_id || item.imdb_id
  
  return {
    id: shikimoriId || `kodik_${item.id}`,
    kodikId: item.id,
    title: item.title || item.title_orig || 'Без названия',
    titleEn: item.title_orig || item.title,
    titleJp: item.other_title || item.title,
    image: item.screenshots?.[0] || item.material_data?.poster_url || 'https://via.placeholder.com/300x400?text=No+Image',
    rating: item.shikimori_rating || item.kinopoisk_rating || item.imdb_rating || 'N/A',
    year: item.year || null,
    episodes: item.episodes_count || item.last_episode || null,
    duration: item.duration ? `${item.duration} мин` : null,
    status: item.ongoing ? 'Онгоинг' : 'Завершён',
    genre: item.material_data?.genres || [],
    description: item.material_data?.description || item.material_data?.anime_description || 'Описание отсутствует',
    trailer: item.material_data?.trailer_url || null,
    studios: item.material_data?.anime_studios || [],
    type: item.type || 'anime-serial',
    
    // Kodik specific data
    link: item.link, // Ссылка на плеер
    translation: item.translation?.title || 'Оригинал',
    translationId: item.translation?.id || null,
    translationType: item.translation?.type || null,
    quality: item.quality || 'HD',
    camrip: item.camrip || false,
    lgbt: item.lgbt || false,
    blocked_countries: item.blocked_countries || [],
    
    // Material data
    worldart_link: item.material_data?.worldart_link || null,
    shikimori_id: item.shikimori_id || null,
    imdb_id: item.imdb_id || null,
    kinopoisk_id: item.kinopoisk_id || null,
    
    // Additional metadata
    seasons_count: item.seasons_count || null,
    episodes_data: item.episodes || {},
    
    // Source marker
    source: 'kodik'
  }
}

/**
 * Get anime list with various filters
 * @param {Object} options - Filter options
 * @param {string} options.types - Content type (anime-serial, anime)
 * @param {number} options.limit - Items per page (max 100)
 * @param {number} options.page - Page number
 * @param {string} options.sort - Sort by (updated_at, created_at, year, rating, etc)
 * @param {string} options.order - Order (asc, desc)
 * @param {string} options.genres - Comma-separated genre IDs
 * @param {string} options.year - Year or year range (e.g., "2023" or "2020-2023")
 * @param {boolean} options.with_material_data - Include material data (descriptions, etc)
 */
export async function getAnimeList(options = {}) {
  try {
    const defaultOptions = {
      types: 'anime-serial,anime',
      limit: 100,
      with_material_data: true,
      sort: 'updated_at',
      order: 'desc',
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
 * Search anime by title
 * @param {string} query - Search query
 * @param {number} limit - Results limit
 * @param {number} page - Page number
 */
export async function searchAnime(query, limit = 50, page = 1) {
  try {
    const data = await makeKodikRequest('/search', {
      title: query,
      types: 'anime-serial,anime',
      limit: limit,
      page: page,
      with_material_data: true
    })
    
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
 * Get popular anime (sorted by rating)
 */
export async function getPopularAnime(limit = 50) {
  return getAnimeList({
    limit: limit,
    sort: 'shikimori_rating',
    order: 'desc',
    with_material_data: true
  })
}

/**
 * Get ongoing anime
 */
export async function getOngoingAnime(limit = 50) {
  const currentYear = new Date().getFullYear()
  return getAnimeList({
    limit: limit,
    year: `${currentYear}`,
    sort: 'updated_at',
    order: 'desc',
    with_material_data: true
  })
}

/**
 * Get anime by genre
 * Kodik genre IDs (standard):
 * 17 - Боевик, 18 - Приключения, 19 - Комедия, 20 - Драма
 * 21 - Фантастика, 22 - Фэнтези, 23 - Романтика, и т.д.
 */
export async function getAnimeByGenre(genreId, limit = 50) {
  return getAnimeList({
    limit: limit,
    genres: genreId,
    sort: 'shikimori_rating',
    order: 'desc',
    with_material_data: true
  })
}

/**
 * Get anime by year
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
 * Get anime by Shikimori ID
 */
export async function getAnimeByShikimoriId(shikimoriId) {
  try {
    const data = await makeKodikRequest('/search', {
      shikimori_id: shikimoriId,
      types: 'anime-serial,anime',
      with_material_data: true
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
 * Get all available translations for an anime
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
 * Generate Kodik player iframe URL
 * @param {string} link - Kodik link from API response
 * @param {Object} options - Player options
 */
export function getPlayerUrl(link, options = {}) {
  const defaultOptions = {
    // Опции плеера
    autoplay: 0,
    only_player: 0, // Только плеер без дополнительных элементов
    season: options.season || null,
    episode: options.episode || null,
    ...options
  }
  
  const params = new URLSearchParams()
  Object.keys(defaultOptions).forEach(key => {
    if (defaultOptions[key] !== null) {
      params.append(key, defaultOptions[key])
    }
  })
  
  return `${link}?${params.toString()}`
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

// Get latest updated anime
export async function getLatestUpdates(limit = 50) {
  return getAnimeList({
    limit: limit,
    sort: 'updated_at',
    order: 'desc',
    with_material_data: true
  })
}

// Kodik genres map (для фильтрации)
export const KODIK_GENRES = {
  'Боевик': '17',
  'Приключения': '18',
  'Комедия': '19',
  'Драма': '20',
  'Фантастика': '21',
  'Фэнтези': '22',
  'Романтика': '23',
  'Ужасы': '24',
  'Триллер': '25',
  'Детектив': '26',
  'История': '27',
  'Военный': '28',
  'Музыка': '29',
  'Спорт': '30',
  'Школа': '31',
  'Повседневность': '32',
}

export default {
  getAnimeList,
  searchAnime,
  getPopularAnime,
  getOngoingAnime,
  getAnimeByGenre,
  getAnimeByYear,
  getAnimeByShikimoriId,
  getAnimeTranslations,
  getPlayerUrl,
  getLatestUpdates,
  prefetchPopularAnime,
  getCachedData,
  setCachedData,
  KODIK_GENRES
}

