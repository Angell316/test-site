// Сервис для кэширования аниме в MongoDB
import AnimeModel from '../models/Anime'
import { enrichAnimeData } from '../enrichmentAPI'
import { 
  getAnimeList,
  getPopularAnime as getKodikPopular,
  getOngoingAnime as getKodikOngoing,
} from '../kodikAPI'

const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 24 * 60 * 60 * 1000 // 24 часа

class AnimeCacheService {
  // Получить аниме по ID (с кэшированием)
  static async getById(id) {
    // Проверяем кэш
    const cached = await AnimeModel.findById(id)
    
    // Если есть в кэше и не устарело
    if (cached && !await AnimeModel.needsUpdate(id, CACHE_TTL)) {
      console.log(`✓ Cache hit: ${cached.title}`)
      return cached
    }
    
    // Загружаем свежие данные
    console.log(`⟳ Fetching fresh data for ID: ${id}`)
    const fresh = await this.fetchAndEnrichById(id)
    
    if (fresh) {
      await AnimeModel.upsert(fresh)
      return fresh
    }
    
    // Если не удалось загрузить, возвращаем старый кэш
    return cached || null
  }
  
  // Получить популярные аниме
  static async getPopular(limit = 50) {
    // Сначала пытаемся взять из кэша
    const cached = await AnimeModel.findPopular(limit)
    
    // Если в кэше достаточно свежих данных
    if (cached && cached.length >= Math.min(limit, 20)) {
      const hasRecentData = cached.some(anime => {
        const lastFetch = anime.lastFetchedAt ? new Date(anime.lastFetchedAt) : null
        if (!lastFetch) return false
        return (Date.now() - lastFetch.getTime()) < CACHE_TTL
      })
      
      if (hasRecentData) {
        console.log(`✓ Cache hit: ${cached.length} popular anime`)
        return cached.slice(0, limit)
      }
    }
    
    // Загружаем свежие данные
    console.log(`⟳ Fetching fresh popular anime...`)
    await this.fetchAndCachePopular(limit)
    
    // Возвращаем из кэша
    return await AnimeModel.findPopular(limit)
  }
  
  // Получить онгоинги
  static async getOngoing(limit = 50) {
    const cached = await AnimeModel.findOngoing(limit)
    
    if (cached && cached.length >= Math.min(limit, 15)) {
      const hasRecentData = cached.some(anime => {
        const lastFetch = anime.lastFetchedAt ? new Date(anime.lastFetchedAt) : null
        if (!lastFetch) return false
        return (Date.now() - lastFetch.getTime()) < CACHE_TTL
      })
      
      if (hasRecentData) {
        console.log(`✓ Cache hit: ${cached.length} ongoing anime`)
        return cached.slice(0, limit)
      }
    }
    
    console.log(`⟳ Fetching fresh ongoing anime...`)
    await this.fetchAndCacheOngoing(limit)
    
    return await AnimeModel.findOngoing(limit)
  }
  
  // Получить все аниме
  static async getAll(options = {}) {
    const cached = await AnimeModel.findAll(options)
    
    // Если в кэше мало данных, подгружаем
    if (cached.length < 50) {
      console.log(`⟳ Cache has only ${cached.length} anime, fetching more...`)
      await this.fetchAndCachePopular(100)
      return await AnimeModel.findAll(options)
    }
    
    console.log(`✓ Cache hit: ${cached.length} anime`)
    return cached
  }
  
  // Поиск
  static async search(query, options = {}) {
    return await AnimeModel.search(query, options)
  }
  
  // Фильтр по жанру
  static async getByGenre(genre, options = {}) {
    return await AnimeModel.findByGenre(genre, options)
  }
  
  // ========== PRIVATE METHODS ==========
  
  // Загрузить и обогатить аниме по ID
  static async fetchAndEnrichById(id) {
    try {
      // Пытаемся загрузить из Kodik
      const { getAnimeByShikimoriId } = await import('../kodikAPI')
      let kodikAnime = await getAnimeByShikimoriId(id)
      
      if (!kodikAnime) return null
      
      // Обогащаем данными из Jikan
      const enriched = await enrichAnimeData(kodikAnime)
      return enriched
    } catch (error) {
      console.error(`Failed to fetch anime ${id}:`, error)
      return null
    }
  }
  
  // Загрузить и кэшировать популярные
  static async fetchAndCachePopular(limit = 50) {
    try {
      const kodikAnime = await getKodikPopular(limit)
      
      // Обогащаем первые 20
      const toEnrich = kodikAnime.slice(0, 20)
      const remaining = kodikAnime.slice(20)
      
      console.log(`⟳ Enriching ${toEnrich.length} popular anime...`)
      
      const enriched = []
      for (const anime of toEnrich) {
        try {
          const enrichedAnime = await enrichAnimeData(anime)
          enriched.push(enrichedAnime)
          
          // Небольшая задержка
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (error) {
          console.error(`Failed to enrich ${anime.title}:`, error)
          enriched.push(anime) // Сохраняем без обогащения
        }
      }
      
      // Сохраняем в базу
      const allToSave = [...enriched, ...remaining]
      const result = await AnimeModel.bulkUpsert(allToSave)
      
      console.log(`✓ Cached ${allToSave.length} popular anime (${enriched.length} enriched)`)
      console.log(`  Modified: ${result.modifiedCount}, Inserted: ${result.upsertedCount}`)
      
      return enriched
    } catch (error) {
      console.error('Failed to fetch and cache popular anime:', error)
      return []
    }
  }
  
  // Загрузить и кэшировать онгоинги
  static async fetchAndCacheOngoing(limit = 50) {
    try {
      const kodikAnime = await getKodikOngoing(limit)
      
      // Обогащаем первые 15
      const toEnrich = kodikAnime.slice(0, 15)
      const remaining = kodikAnime.slice(15)
      
      console.log(`⟳ Enriching ${toEnrich.length} ongoing anime...`)
      
      const enriched = []
      for (const anime of toEnrich) {
        try {
          const enrichedAnime = await enrichAnimeData(anime)
          enriched.push(enrichedAnime)
          
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (error) {
          console.error(`Failed to enrich ${anime.title}:`, error)
          enriched.push(anime)
        }
      }
      
      const allToSave = [...enriched, ...remaining]
      const result = await AnimeModel.bulkUpsert(allToSave)
      
      console.log(`✓ Cached ${allToSave.length} ongoing anime (${enriched.length} enriched)`)
      console.log(`  Modified: ${result.modifiedCount}, Inserted: ${result.upsertedCount}`)
      
      return enriched
    } catch (error) {
      console.error('Failed to fetch and cache ongoing anime:', error)
      return []
    }
  }
  
  // Фоновое обновление устаревших данных
  static async updateStaleCache() {
    console.log('⟳ Checking for stale cache entries...')
    
    const stale = await AnimeModel.findStale(CACHE_TTL)
    
    if (stale.length === 0) {
      console.log('✓ No stale entries found')
      return
    }
    
    console.log(`⟳ Found ${stale.length} stale entries, updating...`)
    
    let updated = 0
    for (const anime of stale) {
      try {
        const fresh = await this.fetchAndEnrichById(anime.id)
        if (fresh) {
          await AnimeModel.upsert(fresh)
          updated++
        }
        
        // Задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Failed to update ${anime.title}:`, error)
      }
    }
    
    console.log(`✓ Updated ${updated}/${stale.length} stale entries`)
  }
  
  // Получить статистику кэша
  static async getStats() {
    return await AnimeModel.getStats()
  }
}

export default AnimeCacheService

