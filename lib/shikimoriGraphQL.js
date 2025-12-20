// Shikimori GraphQL API Integration
// GraphQL эндпоинт: https://shikimori.one/api/graphql
// Документация: https://shikimori.one/api/doc/graphql

const SHIKIMORI_GRAPHQL_URL = 'https://shikimori.one/api/graphql'
const SHIKIMORI_BASE_URL = 'https://shikimori.one'
const USER_AGENT = 'AnimeVerse/1.0'

// Rate limiting helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 250 // Shikimori: 5 req/sec (200ms), делаем 250ms для надёжности

async function makeGraphQLRequest(query, variables = {}) {
  // Ensure we don't exceed rate limits
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
  }
  
  lastRequestTime = Date.now()
  
  try {
    const response = await fetch(SHIKIMORI_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    })
    
    if (!response.ok) {
      throw new Error(`Shikimori GraphQL Error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors)
      throw new Error(`GraphQL Error: ${data.errors[0]?.message}`)
    }
    
    return data.data
  } catch (error) {
    console.error('Shikimori GraphQL request failed:', error)
    throw error
  }
}

// Transform anime data to our format
function transformAnime(anime) {
  // Получаем лучшее качество постера
  const poster = anime.poster?.mainUrl || anime.poster?.originalUrl || anime.poster?.main2xUrl
  
  return {
    id: parseInt(anime.id),
    title: anime.russian || anime.name || 'Без названия',
    titleEn: anime.name,
    titleJp: anime.japanese,
    // ВЫСОКОЕ КАЧЕСТВО: используем full URL из GraphQL
    image: poster ? `${SHIKIMORI_BASE_URL}${poster}` : null,
    // Дополнительные изображения
    screenshots: anime.screenshots?.map(s => `${SHIKIMORI_BASE_URL}${s.originalUrl}`) || [],
    poster2x: anime.poster?.main2xUrl ? `${SHIKIMORI_BASE_URL}${anime.poster.main2xUrl}` : null,
    rating: anime.score || 'N/A',
    year: anime.airedOn?.year || null,
    episodes: anime.episodes || anime.episodesAired || 0,
    duration: anime.duration ? `${anime.duration} мин` : null,
    status: anime.status === 'ongoing' ? 'Онгоинг' : 
            anime.status === 'released' ? 'Завершён' : 
            anime.status === 'anons' ? 'Анонс' : 
            anime.status || 'Неизвестно',
    genre: anime.genres?.map(g => g.russian || g.name) || [],
    description: anime.descriptionHtml 
      ? anime.descriptionHtml.replace(/<[^>]*>/g, '').substring(0, 500) 
      : anime.description || 'Описание отсутствует',
    type: anime.kind === 'tv' ? 'TV' :
          anime.kind === 'movie' ? 'Movie' :
          anime.kind === 'ova' ? 'OVA' :
          anime.kind === 'ona' ? 'ONA' :
          anime.kind === 'special' ? 'Special' :
          anime.kind || 'TV',
    studios: anime.studios?.map(s => s.name) || [],
    score: parseFloat(anime.score) || null,
    userRating: anime.userRate?.score || null,
    source: 'shikimori-graphql'
  }
}

/**
 * Get anime list with filters
 */
export async function getAnimeList(order = 'popularity', page = 1, limit = 20, filters = {}) {
  const query = `
    query ($page: Int, $limit: Int, $order: OrderEnum, $kind: AnimeKindString, $status: AnimeStatusString, $search: String) {
      animes(
        page: $page
        limit: $limit
        order: $order
        kind: $kind
        status: $status
        search: $search
      ) {
        id
        name
        russian
        japanese
        score
        kind
        status
        episodes
        episodesAired
        duration
        airedOn {
          year
        }
        poster {
          id
          originalUrl
          mainUrl
          main2xUrl
        }
        genres {
          id
          name
          russian
        }
        studios {
          id
          name
        }
        description
        descriptionHtml
      }
    }
  `
  
  try {
    const data = await makeGraphQLRequest(query, {
      page,
      limit,
      order,
      ...filters
    })
    
    return data.animes.map(transformAnime)
  } catch (error) {
    console.error('Failed to fetch anime list:', error)
    return []
  }
}

/**
 * Get anime by ID with full details
 */
export async function getAnimeById(id) {
  const query = `
    query ($ids: String!) {
      animes(ids: $ids, limit: 1) {
        id
        name
        russian
        japanese
        score
        kind
        status
        episodes
        episodesAired
        duration
        airedOn {
          year
          month
          day
        }
        releasedOn {
          year
          month
          day
        }
        poster {
          id
          originalUrl
          mainUrl
          main2xUrl
        }
        screenshots {
          id
          originalUrl
          x166Url
          x332Url
        }
        genres {
          id
          name
          russian
        }
        studios {
          id
          name
        }
        description
        descriptionHtml
        userRate {
          id
          score
        }
      }
    }
  `
  
  try {
    const data = await makeGraphQLRequest(query, { ids: id.toString() })
    return data.animes && data.animes[0] ? transformAnime(data.animes[0]) : null
  } catch (error) {
    console.error(`Failed to fetch anime ${id}:`, error)
    return null
  }
}

/**
 * Search anime
 */
export async function searchAnime(searchQuery, page = 1, limit = 20) {
  return await getAnimeList('popularity', page, limit, { search: searchQuery })
}

/**
 * Get ongoing anime
 */
export async function getOngoingAnime(page = 1, limit = 20) {
  return await getAnimeList('popularity', page, limit, { status: 'ongoing' })
}

/**
 * Get announced anime
 */
export async function getAnnouncedAnime(page = 1, limit = 20) {
  return await getAnimeList('popularity', page, limit, { status: 'anons' })
}

/**
 * Get anime by kind (type)
 */
export async function getAnimeByKind(kind, page = 1, limit = 20) {
  return await getAnimeList('popularity', page, limit, { kind })
}

/**
 * Get similar anime
 */
export async function getSimilarAnime(id) {
  const query = `
    query ($ids: String!) {
      animes(ids: $ids, limit: 1) {
        id
        related {
          id
          anime {
            id
            name
            russian
            japanese
            score
            kind
            status
            episodes
            poster {
              id
              originalUrl
              mainUrl
              main2xUrl
            }
            genres {
              id
              name
              russian
            }
          }
        }
      }
    }
  `
  
  try {
    const data = await makeGraphQLRequest(query, { ids: id.toString() })
    
    if (data.animes && data.animes[0] && data.animes[0].related) {
      return data.animes[0].related
        .filter(r => r.anime)
        .map(r => transformAnime(r.anime))
        .slice(0, 12)
    }
    
    return []
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

// Cache system
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

// Prefetch popular anime
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

