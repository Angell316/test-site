#!/usr/bin/env node

/**
 * Фоновый процесс для автоматического обновления устаревших данных
 * Запускается как отдельный процесс и работает в фоне
 * 
 * Использование:
 *   node scripts/background-updater.js
 */

import AnimeCacheService from '../lib/services/animeCacheService.js'

const UPDATE_INTERVAL = 60 * 60 * 1000 // 1 час
const MAX_RUNTIME = 24 * 60 * 60 * 1000 // 24 часа, потом перезапуск

let updateCount = 0
let errorCount = 0
const startTime = Date.now()

async function updateCycle() {
  console.log('\n⟳ Starting background update cycle...')
  console.log(`  Time: ${new Date().toLocaleString()}`)
  console.log(`  Updates completed: ${updateCount}`)
  console.log(`  Errors: ${errorCount}`)
  console.log(`  Runtime: ${((Date.now() - startTime) / 1000 / 60).toFixed(0)} minutes`)
  
  try {
    // Обновляем устаревшие данные
    await AnimeCacheService.updateStaleCache()
    updateCount++
    
    // Показываем статистику
    const stats = await AnimeCacheService.getStats()
    console.log('\n📊 Current stats:')
    console.log(`  Total: ${stats.total}`)
    console.log(`  Enriched: ${stats.enriched} (${stats.enrichmentRate}%)`)
    console.log(`  With trailers: ${stats.withTrailers}`)
    
  } catch (error) {
    console.error('❌ Update cycle failed:', error)
    errorCount++
    
    // Если слишком много ошибок подряд, останавливаемся
    if (errorCount >= 5) {
      console.error('❌ Too many errors, stopping background updater')
      process.exit(1)
    }
  }
  
  // Проверяем время работы
  if (Date.now() - startTime > MAX_RUNTIME) {
    console.log('\n✓ Max runtime reached, restarting...')
    process.exit(0)
  }
  
  console.log(`\n⏰ Next update in ${UPDATE_INTERVAL / 1000 / 60} minutes`)
}

async function start() {
  console.log('🚀 Background updater started')
  console.log('=' .repeat(50))
  console.log(`  Update interval: ${UPDATE_INTERVAL / 1000 / 60} minutes`)
  console.log(`  Max runtime: ${MAX_RUNTIME / 1000 / 60 / 60} hours`)
  console.log('=' .repeat(50))
  
  // Первое обновление сразу
  await updateCycle()
  
  // Затем по расписанию
  setInterval(updateCycle, UPDATE_INTERVAL)
}

// Обработка сигналов для graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Received SIGINT, shutting down gracefully...')
  console.log(`  Updates completed: ${updateCount}`)
  console.log(`  Errors: ${errorCount}`)
  console.log(`  Total runtime: ${((Date.now() - startTime) / 1000 / 60).toFixed(0)} minutes`)
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\n👋 Received SIGTERM, shutting down gracefully...')
  process.exit(0)
})

start().catch(error => {
  console.error('❌ Failed to start background updater:', error)
  process.exit(1)
})

