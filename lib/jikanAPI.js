// Jikan API v4 Integration
// Официальная документация: https://docs.api.jikan.moe/

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4'

// Rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second between requests (Jikan limit: 60 req/min)

async function makeJikanRequest(endpoint) {
  // Ensure we don't exceed rate limits
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }
  
  lastRequestTime = Date.now()
  
  try {
    const response = await fetch(`${JIKAN_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`Jikan API Error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Jikan API request failed:', error)
    throw error
  }
}

// Transform Jikan data to our format
function transformAnime(anime) {
  return {
    id: anime.mal_id,
    title: anime.title || anime.title_japanese || 'Без названия',
    titleEn: anime.title_english || anime.title,
    titleJp: anime.title_japanese || anime.title,
    image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || anime.images?.webp?.large_image_url,
    rating: anime.score ? anime.score.toFixed(1) : 'N/A',
    year: anime.year || anime.aired?.prop?.from?.year || null,
    episodes: anime.episodes || anime.episodes_aired || null,
    duration: anime.duration || null,
    status: anime.status === 'Currently Airing' ? 'Онгоинг' : 
            anime.status === 'Finished Airing' ? 'Завершён' : 
            anime.status === 'Not yet aired' ? 'Анонс' : 
            anime.status || 'Неизвестно',
    genre: anime.genres?.map(g => g.name) || [],
    description: anime.synopsis || 'Описание отсутствует',
    trailer: anime.trailer?.youtube_id ? `https://www.youtube.com/watch?v=${anime.trailer.youtube_id}` : null,
    studios: anime.studios?.map(s => s.name) || [],
    type: anime.type || 'TV',
    source: anime.source || null,
    premiered: anime.season && anime.year ? `${anime.season} ${anime.year}` : null,
    broadcast: anime.broadcast?.string || null,
    score: anime.score || null,
    scored_by: anime.scored_by || null,
    rank: anime.rank || null,
    popularity: anime.popularity || null,
    members: anime.members || null,
    favorites: anime.favorites || null,
    themes: anime.themes?.map(t => t.name) || [],
    demographics: anime.demographics?.map(d => d.name) || [],
  }
}

// API Functions

/**
 * Get top anime
 * @param {string} type - 'airing', 'upcoming', 'bypopularity', 'favorite'
 * @param {number} page - Page number
 * @param {number} limit - Items per page (max 25)
 */
export async function getTopAnime(type = 'bypopularity', page = 1, limit = 25) {
  try {
    const data = await makeJikanRequest(`/top/anime?filter=${type}&page=${page}&limit=${limit}`)
    return data.data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch top anime:', error)
    return []
  }
}

/**
 * Get anime by ID
 */
export async function getAnimeById(id) {
  try {
    const data = await makeJikanRequest(`/anime/${id}/full`)
    return transformAnime(data.data)
  } catch (error) {
    console.error(`Failed to fetch anime ${id}:`, error)
    return null
  }
}

/**
 * Search anime
 */
export async function searchAnime(query, page = 1, limit = 25) {
  try {
    const data = await makeJikanRequest(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&order_by=score&sort=desc`)
    return data.data.map(transformAnime)
  } catch (error) {
    console.error('Failed to search anime:', error)
    return []
  }
}

/**
 * Get seasonal anime
 * @param {number} year - Year (e.g., 2024)
 * @param {string} season - 'winter', 'spring', 'summer', 'fall'
 */
export async function getSeasonalAnime(year, season, page = 1) {
  try {
    const data = await makeJikanRequest(`/seasons/${year}/${season}?page=${page}`)
    return data.data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch seasonal anime:', error)
    return []
  }
}

/**
 * Get current season anime
 */
export async function getCurrentSeasonAnime(page = 1) {
  try {
    const data = await makeJikanRequest(`/seasons/now?page=${page}`)
    return data.data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch current season:', error)
    return []
  }
}

/**
 * Get upcoming anime
 */
export async function getUpcomingAnime(page = 1) {
  try {
    const data = await makeJikanRequest(`/seasons/upcoming?page=${page}`)
    return data.data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch upcoming anime:', error)
    return []
  }
}

/**
 * Get anime by genre
 */
export async function getAnimeByGenre(genreId, page = 1) {
  try {
    const data = await makeJikanRequest(`/anime?genres=${genreId}&page=${page}&order_by=score&sort=desc`)
    return data.data.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch anime by genre:', error)
    return []
  }
}

/**
 * Get random anime
 */
export async function getRandomAnime() {
  try {
    const data = await makeJikanRequest('/random/anime')
    return transformAnime(data.data)
  } catch (error) {
    console.error('Failed to fetch random anime:', error)
    return null
  }
}

/**
 * Get anime recommendations
 */
export async function getAnimeRecommendations(id) {
  try {
    const data = await makeJikanRequest(`/anime/${id}/recommendations`)
    return data.data.slice(0, 12).map(rec => ({
      id: rec.entry.mal_id,
      title: rec.entry.title,
      image: rec.entry.images?.jpg?.large_image_url || rec.entry.images?.jpg?.image_url,
      votes: rec.votes
    }))
  } catch (error) {
    console.error('Failed to fetch recommendations:', error)
    return []
  }
}

// Popular genres with IDs from MyAnimeList
export const GENRES = {
  'Экшен': 1,
  'Приключения': 2,
  'Комедия': 4,
  'Драма': 8,
  'Фэнтези': 10,
  'Романтика': 22,
  'Сёнэн': 27,
  'Сёдзё': 25,
  'Триллер': 41,
  'Психологическое': 40,
  'Меха': 18,
  'Спорт': 30,
  'Музыка': 19,
  'Ужасы': 14,
  'Мистика': 7,
  'Научная фантастика': 24,
  'Повседневность': 36,
  'Школа': 23,
  'Сверхъестественное': 37,
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
    const popular = await getTopAnime('bypopularity', 1, 25)
    setCachedData(cacheKey, popular)
    return popular
  } catch (error) {
    console.error('Failed to prefetch popular anime:', error)
    return []
  }
}

