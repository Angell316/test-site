// Jikan API v4 для дополнительной информации (трейлеры, скриншоты)
// Официальная документация: https://docs.api.jikan.moe/

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4'

// Rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let lastJikanRequest = 0
const MIN_JIKAN_INTERVAL = 1000 // 1 секунда (лимит Jikan: 60 req/min)

async function makeJikanRequest(endpoint) {
  const now = Date.now()
  const timeSinceLastRequest = now - lastJikanRequest
  if (timeSinceLastRequest < MIN_JIKAN_INTERVAL) {
    await delay(MIN_JIKAN_INTERVAL - timeSinceLastRequest)
  }
  
  lastJikanRequest = Date.now()
  
  try {
    const response = await fetch(`${JIKAN_BASE_URL}${endpoint}`)
    if (!response.ok) {
      if (response.status === 429) {
        // Rate limit exceeded, wait and retry
        await delay(2000)
        return makeJikanRequest(endpoint)
      }
      throw new Error(`Jikan API Error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Jikan API request failed:', error)
    return null
  }
}

/**
 * Получить дополнительную информацию по MAL ID
 */
export async function getJikanAnimeById(malId) {
  try {
    const data = await makeJikanRequest(`/anime/${malId}/full`)
    if (!data || !data.data) return null
    
    const anime = data.data
    
    return {
      // Трейлеры
      trailer: anime.trailer?.youtube_id ? {
        youtube_id: anime.trailer.youtube_id,
        url: `https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`,
        embed_url: anime.trailer.embed_url,
        images: {
          image_url: anime.trailer.images?.image_url,
          small_image_url: anime.trailer.images?.small_image_url,
          medium_image_url: anime.trailer.images?.medium_image_url,
          large_image_url: anime.trailer.images?.large_image_url,
          maximum_image_url: anime.trailer.images?.maximum_image_url
        }
      } : null,
      
      // Изображения
      images: {
        jpg: anime.images?.jpg,
        webp: anime.images?.webp
      },
      
      // Дополнительная информация
      title_english: anime.title_english,
      title_japanese: anime.title_japanese,
      title_synonyms: anime.title_synonyms || [],
      synopsis: anime.synopsis,
      background: anime.background,
      
      // Рейтинги и популярность
      score: anime.score,
      scored_by: anime.scored_by,
      rank: anime.rank,
      popularity: anime.popularity,
      members: anime.members,
      favorites: anime.favorites,
      
      // Темы и демография
      themes: anime.themes?.map(t => t.name) || [],
      demographics: anime.demographics?.map(d => d.name) || [],
      
      // Связанные
      relations: anime.relations || []
    }
  } catch (error) {
    console.error('Failed to fetch Jikan anime:', error)
    return null
  }
}

/**
 * Получить изображения аниме (постеры и скриншоты)
 */
export async function getJikanAnimePictures(malId) {
  try {
    const data = await makeJikanRequest(`/anime/${malId}/pictures`)
    if (!data || !data.data) return []
    
    return data.data.map(pic => ({
      image_url: pic.jpg?.image_url,
      large_image_url: pic.jpg?.large_image_url,
      small_image_url: pic.jpg?.small_image_url
    }))
  } catch (error) {
    console.error('Failed to fetch Jikan pictures:', error)
    return []
  }
}

/**
 * Поиск аниме по названию (для получения MAL ID)
 */
export async function searchJikanAnime(query) {
  try {
    const data = await makeJikanRequest(`/anime?q=${encodeURIComponent(query)}&limit=5`)
    if (!data || !data.data) return []
    
    return data.data.map(anime => ({
      mal_id: anime.mal_id,
      title: anime.title,
      title_english: anime.title_english,
      title_japanese: anime.title_japanese,
      images: anime.images,
      score: anime.score
    }))
  } catch (error) {
    console.error('Failed to search Jikan anime:', error)
    return []
  }
}

export default {
  getJikanAnimeById,
  getJikanAnimePictures,
  searchJikanAnime
}

