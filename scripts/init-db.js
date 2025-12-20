#!/usr/bin/env node

/**
 * Инициализация базы данных
 * Создаёт индексы и базовую структуру
 */

import AnimeModel from '../lib/models/Anime.js'
import { getDatabase } from '../lib/mongodb.js'

async function initDatabase() {
  console.log('🔧 Initializing database...')
  console.log('=' .repeat(50))
  
  try {
    // 1. Подключаемся к базе
    console.log('\n📡 Connecting to MongoDB...')
    const db = await getDatabase()
    console.log(`  ✓ Connected to: ${db.databaseName}`)
    
    // 2. Создаём индексы
    console.log('\n📊 Creating indexes...')
    await AnimeModel.createIndexes()
    
    // 3. Проверяем коллекции
    const collections = await db.listCollections().toArray()
    console.log('\n📁 Collections:')
    collections.forEach(col => {
      console.log(`  - ${col.name}`)
    })
    
    console.log('\n✅ Database initialized successfully!')
    console.log('=' .repeat(50))
    
  } catch (error) {
    console.error('\n❌ Initialization failed:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

initDatabase()

