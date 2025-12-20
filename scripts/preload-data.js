#!/usr/bin/env node

/**
 * Скрипт предзагрузки данных в MongoDB
 * Загружает и кэширует аниме из Kodik API с обогащением из Jikan
 * 
 * Использование:
 *   node scripts/preload-data.js [количество]
 */

import AnimeModel from '../lib/models/Anime.js'
import AnimeCacheService from '../lib/services/animeCacheService.js'
import { getAnimeList, getPopularAnime, getOngoingAnime, getLatestUpdates } from '../lib/kodikAPI.js'
import { enrichAnimeData } from '../lib/enrichmentAPI.js'

const BATCH_SIZE = 10 // Обогащаем по 10 аниме за раз
const DELAY_BETWEEN_BATCHES = 2000 // 2 секунды между батчами

async function preloadData(targetCount = 200) {
  console.log('🚀 Starting data preload...')
  console.log(`Target: ${targetCount} anime`)
  console.log('=' .repeat(50))
  
  try {
    // 1. Создаём индексы
    console.log('\n📊 Creating database indexes...')
    await AnimeModel.createIndexes()
    
    // 2. Проверяем текущее состояние
    const stats = await AnimeModel.getStats()
    console.log('\n📈 Current database stats:')
    console.log(`  Total anime: ${stats.total}`)
    console.log(`  Enriched: ${stats.enriched}`)
    console.log(`  With trailers: ${stats.withTrailers}`)
    console.log(`  Enrichment rate: ${stats.enrichmentRate}%`)
    
    if (stats.total >= targetCount) {
      console.log(`\n✓ Already have ${stats.total} anime, skipping preload`)
      return
    }
    
    // 3. Загружаем данные из разных источников
    console.log('\n⬇️  Fetching anime from Kodik API...')
    
    const [popular, ongoing, latest] = await Promise.all([
      getPopularAnime(100),
      getOngoingAnime(50),
      getLatestUpdates(50)
    ])
    
    console.log(`  ✓ Popular: ${popular.length}`)
    console.log(`  ✓ Ongoing: ${ongoing.length}`)
    console.log(`  ✓ Latest: ${latest.length}`)
    
    // 4. Объединяем и убираем дубликаты
    const allAnime = [...popular, ...ongoing, ...latest]
    const uniqueAnime = Array.from(
      new Map(allAnime.map(anime => [anime.id, anime])).values()
    )
    
    console.log(`\n📦 Total unique anime: ${uniqueAnime.length}`)
    
    // 5. Определяем, что нужно обогатить
    const toProcess = uniqueAnime.slice(0, targetCount)
    const toEnrich = toProcess.slice(0, Math.min(50, targetCount)) // Обогащаем первые 50
    const rest = toProcess.slice(toEnrich.length)
    
    console.log(`\n🎨 Will enrich: ${toEnrich.length} anime`)
    console.log(`📝 Will save without enrichment: ${rest.length} anime`)
    
    // 6. Обогащаем данные батчами
    console.log('\n⟳ Starting enrichment process...')
    const enriched = []
    
    for (let i = 0; i < toEnrich.length; i += BATCH_SIZE) {
      const batch = toEnrich.slice(i, i + BATCH_SIZE)
      const batchNum = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(toEnrich.length / BATCH_SIZE)
      
      console.log(`\n  Batch ${batchNum}/${totalBatches} (${batch.length} anime)`)
      
      for (const anime of batch) {
        try {
          process.stdout.write(`    ⟳ ${anime.title}... `)
          const enrichedAnime = await enrichAnimeData(anime)
          enriched.push(enrichedAnime)
          console.log(`✓ (${enrichedAnime.total_images || 0} images)`)
          
          // Небольшая задержка между запросами
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          console.log(`✗ Failed: ${error.message}`)
          enriched.push(anime) // Сохраняем без обогащения
        }
      }
      
      // Задержка между батчами
      if (i + BATCH_SIZE < toEnrich.length) {
        console.log(`    ⏸️  Waiting ${DELAY_BETWEEN_BATCHES/1000}s before next batch...`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
      }
    }
    
    // 7. Сохраняем в базу
    console.log('\n💾 Saving to database...')
    
    const allToSave = [...enriched, ...rest]
    const result = await AnimeModel.bulkUpsert(allToSave)
    
    console.log(`  ✓ Saved ${allToSave.length} anime`)
    console.log(`    Modified: ${result.modifiedCount}`)
    console.log(`    Inserted: ${result.upsertedCount}`)
    
    // 8. Финальная статистика
    const finalStats = await AnimeModel.getStats()
    console.log('\n📊 Final database stats:')
    console.log(`  Total anime: ${finalStats.total}`)
    console.log(`  Enriched: ${finalStats.enriched}`)
    console.log(`  With trailers: ${finalStats.withTrailers}`)
    console.log(`  Enrichment rate: ${finalStats.enrichmentRate}%`)
    
    console.log('\n✅ Preload complete!')
    console.log('=' .repeat(50))
    
  } catch (error) {
    console.error('\n❌ Preload failed:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

// Запуск
const targetCount = parseInt(process.argv[2]) || 200
preloadData(targetCount)

