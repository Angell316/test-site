# 🚀 API Integration Guide

## Обзор

Проект AnimeVerse поддерживает интеграцию с внешними API для получения данных об аниме. Подготовлены два основных провайдера:

### 1. **Jikan API** (MyAnimeList)
- ✅ Бесплатный
- ✅ Не требует авторизации
- ✅ REST API
- 📦 База данных: MyAnimeList

### 2. **AniList API**
- ✅ Бесплатный
- ✅ Не требует авторизации для чтения
- ✅ GraphQL API
- 📦 База данных: AniList

---

## 🔧 Использование

### Базовое использование

```javascript
import { AnimeAPI } from '@/lib/animeAPI'

// Поиск аниме
const results = await AnimeAPI.search('Naruto')

// Получить по ID
const anime = await AnimeAPI.getById(123)

// Получить топ/тренды
const trending = await AnimeAPI.getTrending()
```

### Смена провайдера

```javascript
import { AnimeAPI } from '@/lib/animeAPI'

// По умолчанию: Jikan
AnimeAPI.setProvider('jikan')

// Переключиться на AniList
AnimeAPI.setProvider('anilist')
```

### Прямое использование провайдеров

```javascript
import { JikanAPI, AniListAPI } from '@/lib/animeAPI'

// Jikan API
const jikanResults = await JikanAPI.searchAnime('Naruto')
const topAiring = await JikanAPI.getTopAnime('airing')
const seasonal = await JikanAPI.getSeasonalAnime(2024, 'winter')

// AniList API
const anilistResults = await AniListAPI.searchAnime('Naruto')
const trending = await AniListAPI.getTrendingAnime()
const anime = await AniListAPI.getAnimeById(20)
```

---

## 📋 API Routes (Next.js)

### Созданные эндпоинты

#### `GET /api/anime`
Получить список всех аниме

#### `POST /api/anime`
Создать новое аниме

**Body:**
```json
{
  "title": "Название",
  "titleEn": "English Title",
  "image": "https://...",
  "rating": "8.5",
  "year": 2024,
  "episodes": 24,
  "genre": ["Экшен", "Приключения"],
  "description": "Описание..."
}
```

#### `GET /api/anime/[id]`
Получить аниме по ID

#### `PUT /api/anime/[id]`
Обновить аниме

#### `DELETE /api/anime/[id]`
Удалить аниме

---

## 🔌 Интеграция с базой данных

### Подключение MongoDB

1. Установите зависимости (уже в package.json):
```bash
npm install mongodb mongoose
```

2. Настройте переменные окружения в `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/animeverse?retryWrites=true&w=majority
```

3. Создайте файл `lib/mongodb.js`:
```javascript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
```

4. Создайте модели в `models/Anime.js`:
```javascript
import mongoose from 'mongoose'

const AnimeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleEn: String,
  image: { type: String, required: true },
  rating: String,
  year: Number,
  episodes: Number,
  duration: String,
  status: String,
  genre: [String],
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.Anime || mongoose.model('Anime', AnimeSchema)
```

5. Обновите API routes для использования базы данных:
```javascript
import dbConnect from '@/lib/mongodb'
import Anime from '@/models/Anime'

export async function GET() {
  await dbConnect()
  const anime = await Anime.find({}).sort({ createdAt: -1 })
  return NextResponse.json(anime)
}
```

---

## 📊 Формат данных

### Структура объекта Anime

```javascript
{
  id: "unique-id",           // Уникальный ID
  malId: 123,                // MyAnimeList ID (если из Jikan)
  anilistId: 456,            // AniList ID (если из AniList)
  title: "Название",         // Основное название
  titleEn: "English Title",  // Английское название
  image: "https://...",      // URL изображения
  rating: "8.5",             // Рейтинг
  year: 2024,                // Год выхода
  episodes: 24,              // Количество эпизодов
  duration: "24 мин",        // Длительность эпизода
  status: "Онгоинг",         // Статус: Онгоинг, Завершён, Анонс
  genre: ["Экшен", "..."],   // Жанры
  description: "...",        // Описание
  source: "jikan"            // Источник: jikan, anilist, local
}
```

---

## 🔄 Синхронизация данных

### Импорт из внешних API

Создайте скрипт для импорта:

```javascript
// scripts/import-from-jikan.js
import { JikanAPI } from '../lib/animeAPI'
import { saveAnime } from '../app/data/animeData'

async function importTopAnime() {
  const topAnime = await JikanAPI.getTopAnime('bypopularity', 1)
  
  topAnime.forEach(anime => {
    saveAnime(anime)
  })
  
  console.log(`Импортировано ${topAnime.length} аниме`)
}

importTopAnime()
```

### Автоматическое обновление

Настройте cron job или используйте Next.js API routes:

```javascript
// app/api/sync/route.js
import { JikanAPI } from '@/lib/animeAPI'

export async function GET() {
  // Запускайте периодически для обновления данных
  const newAnime = await JikanAPI.getTopAnime('airing')
  
  // Сохраните в базу данных
  // ...
  
  return NextResponse.json({ synced: newAnime.length })
}
```

---

## 📱 Примеры использования в компонентах

### Компонент поиска с API

```javascript
'use client'

import { useState } from 'react'
import { AnimeAPI } from '@/lib/animeAPI'

export default function SearchComponent() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (query) => {
    setLoading(true)
    const data = await AnimeAPI.search(query)
    setResults(data)
    setLoading(false)
  }

  return (
    <div>
      <input 
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Поиск..."
      />
      {loading ? 'Загрузка...' : results.map(anime => (
        <div key={anime.id}>{anime.title}</div>
      ))}
    </div>
  )
}
```

---

## 🎯 Рекомендации

1. **Rate Limiting**: Jikan API имеет лимиты. Используйте кэширование!
2. **Кэширование**: Сохраняйте результаты API в localStorage или базе данных
3. **Fallback**: Если один API недоступен, используйте другой
4. **Оптимизация изображений**: Используйте Next.js Image Optimization

---

## 🐛 Обработка ошибок

```javascript
try {
  const anime = await AnimeAPI.search('Naruto')
} catch (error) {
  console.error('API Error:', error)
  // Используйте локальные данные как fallback
}
```

---

## 📚 Полезные ссылки

- [Jikan API Documentation](https://docs.api.jikan.moe/)
- [AniList API Documentation](https://anilist.gitbook.io/anilist-apiv2-docs/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Готово! API интеграция полностью настроена и готова к использованию! 🚀**

