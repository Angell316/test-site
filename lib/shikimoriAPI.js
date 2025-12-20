// Shikimori API v2 Integration
// Официальная документация: https://shikimori.one/api/doc/1.0
// Базовый URL: https://shikimori.one/api

const SHIKIMORI_BASE_URL = 'https://shikimori.one/api'
const USER_AGENT = 'AnimeVerse/1.0'

// Rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 350 // Shikimori: 5 req/sec (200ms), делаем 350ms для надёжности

async function makeShikimoriRequest(endpoint) {
  // Ensure we don't exceed rate limits
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }
  
  lastRequestTime = Date.now()
  
  try {
    const response = await fetch(`${SHIKIMORI_BASE_URL}${endpoint}`, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Shikimori API Error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Shikimori API request failed:', error)
    throw error
  }
}

// Transform Shikimori data to our format
function transformAnime(anime) {
  return {
    id: anime.id,
    title: anime.russian || anime.name || 'Без названия',
    titleEn: anime.name,
    titleJp: anime.japanese?.[0] || anime.name,
    image: anime.image?.original 
      ? `https://shikimori.one${anime.image.original}` 
      : anime.image?.preview 
        ? `https://shikimori.one${anime.image.preview}`
        : `https://shikimori.one${anime.image?.x96}`,
    rating: anime.score || 'N/A',
    year: anime.aired_on ? new Date(anime.aired_on).getFullYear() : null,
    episodes: anime.episodes || anime.episodes_aired || 0,
    duration: anime.duration ? `${anime.duration} мин` : null,
    status: anime.status === 'ongoing' ? 'Онгоинг' : 
            anime.status === 'released' ? 'Завершён' : 
            anime.status === 'anons' ? 'Анонс' : 
            anime.status || 'Неизвестно',
    genre: anime.genres?.map(g => g.russian || g.name) || [],
    description: anime.description_html 
      ? anime.description_html.replace(/<[^>]*>/g, '').substring(0, 500) 
      : anime.description || 'Описание отсутствует',
    type: anime.kind === 'tv' ? 'TV' :
          anime.kind === 'movie' ? 'Movie' :
          anime.kind === 'ova' ? 'OVA' :
          anime.kind === 'ona' ? 'ONA' :
          anime.kind === 'special' ? 'Special' :
          anime.kind || 'TV',
    studios: anime.studios?.map(s => s.name) || [],
    score: anime.score || null,
    rank: anime.ranked || null,
    popularity: anime.popularity || null,
    source: 'shikimori'
  }
}

/**
 * Get popular/top anime
 * @param {string} order - 'popularity', 'ranked', 'name', 'aired_on', 'episodes', 'status'
 * @param {number} page - Page number
 * @param {number} limit - Items per page (max 50)
 */
export async function getAnimeList(order = 'popularity', page = 1, limit = 20) {
  try {
    const data = await makeShikimoriRequest(
      `/animes?order=${order}&page=${page}&limit=${limit}`
    )
    return data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch anime list:', error)
    return []
  }
}

/**
 * Get anime by ID
 */
export async function getAnimeById(id) {
  try {
    const data = await makeShikimoriRequest(`/animes/${id}`)
    return transformAnime(data)
  } catch (error) {
    console.error(`Failed to fetch anime ${id}:`, error)
    return null
  }
}

/**
 * Search anime
 */
export async function searchAnime(query, page = 1, limit = 20) {
  try {
    const data = await makeShikimoriRequest(
      `/animes?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}&order=popularity`
    )
    return data.map(transformAnime)
  } catch (error) {
    console.error('Failed to search anime:', error)
    return []
  }
}

/**
 * Get ongoing anime (currently airing)
 */
export async function getOngoingAnime(page = 1, limit = 20) {
  try {
    const data = await makeShikimoriRequest(
      `/animes?status=ongoing&order=popularity&page=${page}&limit=${limit}`
    )
    return data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch ongoing anime:', error)
    return []
  }
}

/**
 * Get announced anime
 */
export async function getAnnouncedAnime(page = 1, limit = 20) {
  try {
    const data = await makeShikimoriRequest(
      `/animes?status=anons&order=popularity&page=${page}&limit=${limit}`
    )
    return data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch announced anime:', error)
    return []
  }
}

/**
 * Get anime by genre
 */
export async function getAnimeByGenre(genreName, page = 1, limit = 20) {
  try {
    const data = await makeShikimoriRequest(
      `/animes?genre=${encodeURIComponent(genreName)}&page=${page}&limit=${limit}&order=popularity`
    )
    return data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch anime by genre:', error)
    return []
  }
}

/**
 * Get anime by kind (type)
 */
export async function getAnimeByKind(kind, page = 1, limit = 20) {
  try {
    const data = await makeShikimoriRequest(
      `/animes?kind=${kind}&page=${page}&limit=${limit}&order=popularity`
    )
    return data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch anime by kind:', error)
    return []
  }
}

/**
 * Get similar anime
 */
export async function getSimilarAnime(id) {
  try {
    const data = await makeShikimoriRequest(`/animes/${id}/similar`)
    return data.slice(0, 12).map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch similar anime:', error)
    return []
  }
}

// Популярные жанры на русском
export const GENRES = {
  'Экшен': 'action',
  'Приключения': 'adventure',
  'Комедия': 'comedy',
  'Драма': 'drama',
  'Фэнтези': 'fantasy',
  'Романтика': 'romance',
  'Сёнэн': 'shounen',
  'Сёдзё': 'shoujo',
  'Триллер': 'thriller',
  'Психологическое': 'psychological',
  'Меха': 'mecha',
  'Спорт': 'sports',
  'Музыка': 'music',
  'Ужасы': 'horror',
  'Мистика': 'mystery',
  'Научная фантастика': 'sci_fi',
  'Повседневность': 'slice_of_life',
  'Школа': 'school',
  'Сверхъестественное': 'supernatural',
  'Военное': 'military',
}

// Cache system for better performance
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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

// Prefetch popular anime on app load
export async function prefetchPopularAnime() {
  const cacheKey = 'popular_anime'
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    const popular = await getAnimeList('popularity', 1, 25)
    setCachedData(cacheKey, popular)
    return popular
  } catch (error) {
    console.error('Failed to prefetch popular anime:', error)
    return []
  }
}

