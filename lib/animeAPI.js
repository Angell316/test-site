// Utility for integrating with external anime APIs
// Supports: Jikan API (MyAnimeList), AniList API

/**
 * Jikan API (MyAnimeList unofficial API)
 * Free, no authentication required
 * Base URL: https://api.jikan.moe/v4
 */

export class JikanAPI {
  static BASE_URL = 'https://api.jikan.moe/v4'

  /**
   * Search anime by query
   * @param {string} query - Search term
   * @param {number} page - Page number (default: 1)
   * @returns {Promise<Array>} - Array of anime
   */
  static async searchAnime(query, page = 1) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=25`
      )
      const data = await response.json()
      return this.transformJikanData(data.data)
    } catch (error) {
      console.error('Jikan API Error:', error)
      return []
    }
  }

  /**
   * Get anime by ID
   * @param {number} id - MAL anime ID
   * @returns {Promise<Object>} - Anime object
   */
  static async getAnimeById(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/anime/${id}/full`)
      const data = await response.json()
      return this.transformJikanAnime(data.data)
    } catch (error) {
      console.error('Jikan API Error:', error)
      return null
    }
  }

  /**
   * Get top anime
   * @param {string} type - Type: 'airing', 'upcoming', 'bypopularity', 'favorite'
   * @param {number} page - Page number
   * @returns {Promise<Array>} - Array of anime
   */
  static async getTopAnime(type = 'bypopularity', page = 1) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/top/anime?filter=${type}&page=${page}`
      )
      const data = await response.json()
      return this.transformJikanData(data.data)
    } catch (error) {
      console.error('Jikan API Error:', error)
      return []
    }
  }

  /**
   * Get seasonal anime
   * @param {number} year - Year
   * @param {string} season - Season: 'winter', 'spring', 'summer', 'fall'
   * @returns {Promise<Array>} - Array of anime
   */
  static async getSeasonalAnime(year, season) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/seasons/${year}/${season}`
      )
      const data = await response.json()
      return this.transformJikanData(data.data)
    } catch (error) {
      console.error('Jikan API Error:', error)
      return []
    }
  }

  /**
   * Transform Jikan API response to our format
   */
  static transformJikanData(animeArray) {
    return animeArray.map(anime => this.transformJikanAnime(anime))
  }

  static transformJikanAnime(anime) {
    return {
      id: `mal-${anime.mal_id}`,
      malId: anime.mal_id,
      title: anime.title,
      titleEn: anime.title_english || anime.title,
      image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      rating: anime.score || 'N/A',
      year: anime.year || anime.aired?.prop?.from?.year,
      episodes: anime.episodes,
      duration: anime.duration,
      status: anime.status === 'Currently Airing' ? 'Онгоинг' : 
              anime.status === 'Finished Airing' ? 'Завершён' : 
              anime.status === 'Not yet aired' ? 'Анонс' : anime.status,
      genre: anime.genres?.map(g => g.name) || [],
      description: anime.synopsis || 'Описание отсутствует',
      source: 'jikan'
    }
  }
}

/**
 * AniList API (GraphQL)
 * Free, requires GraphQL queries
 * Base URL: https://graphql.anilist.co
 */

export class AniListAPI {
  static BASE_URL = 'https://graphql.anilist.co'

  /**
   * Execute GraphQL query
   */
  static async query(query, variables = {}) {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables })
      })
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('AniList API Error:', error)
      return null
    }
  }

  /**
   * Search anime
   */
  static async searchAnime(searchTerm, page = 1, perPage = 25) {
    const query = `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              extraLarge
            }
            averageScore
            seasonYear
            episodes
            duration
            status
            genres
            description
          }
        }
      }
    `
    const data = await this.query(query, { search: searchTerm, page, perPage })
    return data?.Page?.media.map(anime => this.transformAniListAnime(anime)) || []
  }

  /**
   * Get anime by ID
   */
  static async getAnimeById(id) {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            extraLarge
          }
          averageScore
          seasonYear
          episodes
          duration
          status
          genres
          description
        }
      }
    `
    const data = await this.query(query, { id })
    return data?.Media ? this.transformAniListAnime(data.Media) : null
  }

  /**
   * Get trending anime
   */
  static async getTrendingAnime(page = 1, perPage = 25) {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(sort: TRENDING_DESC, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              extraLarge
            }
            averageScore
            seasonYear
            episodes
            duration
            status
            genres
            description
          }
        }
      }
    `
    const data = await this.query(query, { page, perPage })
    return data?.Page?.media.map(anime => this.transformAniListAnime(anime)) || []
  }

  /**
   * Transform AniList response to our format
   */
  static transformAniListAnime(anime) {
    return {
      id: `anilist-${anime.id}`,
      anilistId: anime.id,
      title: anime.title.romaji,
      titleEn: anime.title.english || anime.title.romaji,
      image: anime.coverImage.extraLarge || anime.coverImage.large,
      rating: anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A',
      year: anime.seasonYear,
      episodes: anime.episodes,
      duration: anime.duration ? `${anime.duration} мин` : null,
      status: anime.status === 'RELEASING' ? 'Онгоинг' : 
              anime.status === 'FINISHED' ? 'Завершён' : 
              anime.status === 'NOT_YET_RELEASED' ? 'Анонс' : anime.status,
      genre: anime.genres || [],
      description: anime.description?.replace(/<[^>]*>/g, '') || 'Описание отсутствует',
      source: 'anilist'
    }
  }
}

/**
 * Unified API wrapper - use this in your app
 */
export class AnimeAPI {
  static provider = 'jikan' // or 'anilist'

  static setProvider(provider) {
    this.provider = provider
  }

  static async search(query, page = 1) {
    if (this.provider === 'anilist') {
      return await AniListAPI.searchAnime(query, page)
    }
    return await JikanAPI.searchAnime(query, page)
  }

  static async getById(id) {
    if (this.provider === 'anilist') {
      return await AniListAPI.getAnimeById(id)
    }
    return await JikanAPI.getAnimeById(id)
  }

  static async getTrending(page = 1) {
    if (this.provider === 'anilist') {
      return await AniListAPI.getTrendingAnime(page)
    }
    return await JikanAPI.getTopAnime('bypopularity', page)
  }

  static async getTop(type = 'bypopularity', page = 1) {
    if (this.provider === 'jikan') {
      return await JikanAPI.getTopAnime(type, page)
    }
    // AniList doesn't have exact equivalents, use trending
    return await AniListAPI.getTrendingAnime(page)
  }

  static async getSeasonal(year, season) {
    if (this.provider === 'jikan') {
      return await JikanAPI.getSeasonalAnime(year, season)
    }
    // AniList seasonal query would go here
    return []
  }
}

// Example usage:
// import { AnimeAPI, JikanAPI, AniListAPI } from '@/lib/animeAPI'
//
// // Use unified API (default: Jikan)
// const results = await AnimeAPI.search('Naruto')
//
// // Switch to AniList
// AnimeAPI.setProvider('anilist')
// const results = await AnimeAPI.search('Naruto')
//
// // Or use directly
// const jikanResults = await JikanAPI.searchAnime('Naruto')
// const anilistResults = await AniListAPI.searchAnime('Naruto')

