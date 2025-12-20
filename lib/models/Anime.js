// Anime Model для MongoDB
import { getCollection } from '../mongodb'

const COLLECTION_NAME = 'anime'

// Схема для валидации (опционально, MongoDB Schema)
export const AnimeSchema = {
  id: String,
  title: String,
  titleEn: String,
  description: String,
  image: String,
  
  // Enriched data
  bannerImage: String,
  mainPoster: String,
  trailerImage: String,
  trailerImages: Array,
  posters: Array,
  screenshots: Array,
  allImages: Array,
  
  // Trailer
  trailer: Object,
  
  // Ratings
  rating: Number,
  ratings: Object,
  mal_score: Number,
  mal_rank: Number,
  mal_popularity: Number,
  
  // Meta
  year: Number,
  episodes: Number,
  status: String,
  genre: Array,
  
  // Extended info
  synopsis: String,
  background: String,
  title_synonyms: Array,
  themes: Array,
  demographics: Array,
  
  // Kodik specific
  shikimori_id: String,
  kinopoisk_id: String,
  
  // Cache metadata
  enriched: Boolean,
  enrichment_sources: Array,
  enrichment_date: Date,
  total_images: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastFetchedAt: Date,
}

class AnimeModel {
  // Получить коллекцию
  static async getCollection() {
    return await getCollection(COLLECTION_NAME)
  }
  
  // Найти аниме по ID
  static async findById(id) {
    const collection = await this.getCollection()
    return await collection.findOne({ id: String(id) })
  }
  
  // Найти по Shikimori ID
  static async findByShikimoriId(shikimoriId) {
    const collection = await this.getCollection()
    return await collection.findOne({ shikimori_id: String(shikimoriId) })
  }
  
  // Получить все аниме
  static async findAll(options = {}) {
    const collection = await this.getCollection()
    const { limit = 100, skip = 0, sort = { updatedAt: -1 } } = options
    
    return await collection
      .find({})
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray()
  }
  
  // Поиск по названию
  static async search(query, options = {}) {
    const collection = await this.getCollection()
    const { limit = 50 } = options
    
    return await collection
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { titleEn: { $regex: query, $options: 'i' } }
        ]
      })
      .limit(limit)
      .toArray()
  }
  
  // Фильтрация по жанру
  static async findByGenre(genre, options = {}) {
    const collection = await this.getCollection()
    const { limit = 50 } = options
    
    return await collection
      .find({ genre: genre })
      .limit(limit)
      .toArray()
  }
  
  // Получить популярные (по рейтингу)
  static async findPopular(limit = 50) {
    const collection = await this.getCollection()
    
    return await collection
      .find({})
      .sort({ rating: -1 })
      .limit(limit)
      .toArray()
  }
  
  // Получить онгоинги
  static async findOngoing(limit = 50) {
    const collection = await this.getCollection()
    
    return await collection
      .find({ status: { $in: ['ongoing', 'Ongoing', 'Онгоинг'] } })
      .sort({ rating: -1 })
      .limit(limit)
      .toArray()
  }
  
  // Создать или обновить аниме
  static async upsert(animeData) {
    const collection = await this.getCollection()
    
    const now = new Date()
    const dataToSave = {
      ...animeData,
      updatedAt: now,
      lastFetchedAt: now,
    }
    
    // Если нет createdAt, добавляем
    if (!animeData.createdAt) {
      dataToSave.createdAt = now
    }
    
    const result = await collection.updateOne(
      { id: String(animeData.id) },
      { $set: dataToSave },
      { upsert: true }
    )
    
    return result
  }
  
  // Массовое сохранение
  static async bulkUpsert(animeList) {
    const collection = await this.getCollection()
    const now = new Date()
    
    const operations = animeList.map(anime => ({
      updateOne: {
        filter: { id: String(anime.id) },
        update: {
          $set: {
            ...anime,
            updatedAt: now,
            lastFetchedAt: now,
          },
          $setOnInsert: {
            createdAt: now
          }
        },
        upsert: true
      }
    }))
    
    if (operations.length === 0) return { modifiedCount: 0, upsertedCount: 0 }
    
    const result = await collection.bulkWrite(operations)
    return result
  }
  
  // Удалить аниме
  static async delete(id) {
    const collection = await this.getCollection()
    return await collection.deleteOne({ id: String(id) })
  }
  
  // Проверить, нужно ли обновить кэш
  static async needsUpdate(id, cacheTTL = 24 * 60 * 60 * 1000) {
    const anime = await this.findById(id)
    if (!anime) return true
    
    const now = new Date()
    const lastFetch = anime.lastFetchedAt ? new Date(anime.lastFetchedAt) : null
    
    if (!lastFetch) return true
    
    return (now - lastFetch) > cacheTTL
  }
  
  // Получить устаревшие аниме (для фонового обновления)
  static async findStale(cacheTTL = 24 * 60 * 60 * 1000) {
    const collection = await this.getCollection()
    const threshold = new Date(Date.now() - cacheTTL)
    
    return await collection
      .find({
        $or: [
          { lastFetchedAt: { $lt: threshold } },
          { lastFetchedAt: { $exists: false } }
        ]
      })
      .limit(100)
      .toArray()
  }
  
  // Получить статистику
  static async getStats() {
    const collection = await this.getCollection()
    
    const [total, enriched, withTrailers] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ enriched: true }),
      collection.countDocuments({ 'trailer.url': { $exists: true } })
    ])
    
    return {
      total,
      enriched,
      withTrailers,
      enrichmentRate: total > 0 ? ((enriched / total) * 100).toFixed(2) : 0
    }
  }
  
  // Создать индексы
  static async createIndexes() {
    const collection = await this.getCollection()
    
    await collection.createIndexes([
      { key: { id: 1 }, unique: true },
      { key: { shikimori_id: 1 } },
      { key: { title: 'text', titleEn: 'text' } },
      { key: { genre: 1 } },
      { key: { rating: -1 } },
      { key: { status: 1 } },
      { key: { lastFetchedAt: 1 } },
      { key: { updatedAt: -1 } }
    ])
    
    console.log('✓ Anime indexes created')
  }
}

export default AnimeModel

