#!/usr/bin/env node

/**
 * Показать статистику базы данных
 */

import AnimeModel from '../lib/models/Anime.js'
import { getDatabase } from '../lib/mongodb.js'

async function showStats() {
  console.log('📊 Database Statistics')
  console.log('=' .repeat(50))
  
  try {
    const db = await getDatabase()
    
    // Общая статистика
    const stats = await AnimeModel.getStats()
    
    console.log('\n📈 Anime Collection:')
    console.log(`  Total anime: ${stats.total}`)
    console.log(`  Enriched: ${stats.enriched} (${stats.enrichmentRate}%)`)
    console.log(`  With trailers: ${stats.withTrailers}`)
    
    // Статистика по статусам
    const collection = await AnimeModel.getCollection()
    const statusStats = await collection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray()
    
    if (statusStats.length > 0) {
      console.log('\n📺 By Status:')
      statusStats.forEach(stat => {
        console.log(`  ${stat._id || 'Unknown'}: ${stat.count}`)
      })
    }
    
    // Топ жанры
    const genreStats = await collection.aggregate([
      { $unwind: '$genre' },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray()
    
    if (genreStats.length > 0) {
      console.log('\n🎭 Top 10 Genres:')
      genreStats.forEach(stat => {
        console.log(`  ${stat._id}: ${stat.count}`)
      })
    }
    
    // Средний рейтинг
    const avgRating = await collection.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          maxRating: { $max: '$rating' },
          minRating: { $min: '$rating' }
        }
      }
    ]).toArray()
    
    if (avgRating.length > 0) {
      const r = avgRating[0]
      console.log('\n⭐ Ratings:')
      console.log(`  Average: ${r.avgRating?.toFixed(2) || 'N/A'}`)
      console.log(`  Max: ${r.maxRating || 'N/A'}`)
      console.log(`  Min: ${r.minRating || 'N/A'}`)
    }
    
    // Размер базы
    const dbStats = await db.stats()
    console.log('\n💾 Database Size:')
    console.log(`  Storage: ${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Data: ${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Indexes: ${(dbStats.indexSize / 1024 / 1024).toFixed(2)} MB`)
    
    console.log('\n=' .repeat(50))
    
  } catch (error) {
    console.error('\n❌ Failed to get stats:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

showStats()

