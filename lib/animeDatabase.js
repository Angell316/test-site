// Утилиты для работы с базой данных аниме
import filmsData from '@/db/films_anime.json'
import serialsData from '@/db/serials_anime-serial.json'
import { trigramSearch, calculateSimilarity } from './trigramSearch'

// Кеширование данных для производительности
let cachedAnimeData = null

/**
 * Получить данные с кешированием (без фильтрации)
 */
function getCachedAnimeData() {
  if (cachedAnimeData) {
    return cachedAnimeData
  }
  
  console.log('🔄 Загрузка аниме данных...')
  const startTime = Date.now()
  
  // Объединяем фильмы и сериалы
  cachedAnimeData = [
    ...filmsData.map(item => ({ ...item, contentType: 'movie' })),
    ...serialsData.map(item => ({ ...item, contentType: 'series' }))
  ]
  
  const endTime = Date.now()
  console.log(`✅ Загружено ${cachedAnimeData.length} записей за ${endTime - startTime}ms`)
  
  return cachedAnimeData
}

// Ленивая инициализация - данные загружаются только при первом обращении
const animeData = getCachedAnimeData()

/**
 * Удалить дубликаты аниме по названию
 * Оставляем аниме с наибольшим рейтингом
 */
function removeDuplicates(animeList) {
  const seenTitles = new Map()
  
  animeList.forEach(anime => {
    const title = anime.material_data?.anime_title || anime.title
    if (!title) return
    
    const existing = seenTitles.get(title)
    const currentRating = anime.material_data?.shikimori_rating || 
                         anime.material_data?.kinopoisk_rating || 
                         anime.material_data?.imdb_rating || 0
    
    if (!existing || currentRating > (existing.rating || 0)) {
      seenTitles.set(title, { anime, rating: currentRating })
    }
  })
  
  return Array.from(seenTitles.values()).map(item => item.anime)
}

/**
 * Получить все аниме из базы данных (без дубликатов)
 */
export function getAllAnime() {
  return removeDuplicates(animeData)
}

/**
 * Получить аниме по ID
 */
export function getAnimeById(id) {
  return animeData.find(anime => anime.id === id)
}

/**
 * Получить случайные аниме
 */
export function getRandomAnime(count = 10) {
  const unique = removeDuplicates(animeData)
  const shuffled = [...unique].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

/**
 * Получить аниме по жанру
 */
export function getAnimeByGenre(genre, limit = 20) {
  const filtered = animeData.filter(anime => 
    anime.material_data?.anime_genres?.some(g => 
      g.toLowerCase().includes(genre.toLowerCase())
    )
  )
  return removeDuplicates(filtered).slice(0, limit)
}

/**
 * Получить топ аниме по рейтингу
 */
export function getTopAnime(limit = 20) {
  const unique = removeDuplicates(animeData)
  return unique
    .filter(anime => anime.material_data?.shikimori_rating)
    .sort((a, b) => {
      const ratingA = a.material_data?.shikimori_rating || 0
      const ratingB = b.material_data?.shikimori_rating || 0
      return ratingB - ratingA
    })
    .slice(0, limit)
}

/**
 * Получить популярные аниме
 */
export function getPopularAnime(limit = 20) {
  const unique = removeDuplicates(animeData)
  return unique
    .filter(anime => anime.material_data?.shikimori_votes)
    .sort((a, b) => {
      const votesA = a.material_data?.shikimori_votes || 0
      const votesB = b.material_data?.shikimori_votes || 0
      return votesB - votesA
    })
    .slice(0, limit)
}

/**
 * Получить новые аниме
 */
export function getRecentAnime(limit = 20) {
  const unique = removeDuplicates(animeData)
  return unique
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at)
      const dateB = new Date(b.updated_at || b.created_at)
      return dateB - dateA
    })
    .slice(0, limit)
}

/**
 * Получить текущие онгоинги
 */
export function getOngoingAnime(limit = 20) {
  const filtered = animeData.filter(anime => 
    anime.material_data?.anime_status === 'ongoing' ||
    anime.material_data?.all_status === 'ongoing'
  )
  
  // Сортируем по дате обновления (последний эпизод)
  const sorted = removeDuplicates(filtered).sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0)
    const dateB = new Date(b.updated_at || b.created_at || 0)
    return dateB - dateA // Новые первыми
  })
  
  return sorted.slice(0, limit).map(normalizeAnime)
}

/**
 * Поиск аниме с использованием триграммного алгоритма
 * Позволяет находить результаты даже при опечатках
 */
export function searchAnime(query, limit = 20) {
  if (!query || !query.trim()) return []
  
  const searchTerm = query.trim()
  
  // Для коротких запросов (1-2 символа) используем простой поиск
  if (searchTerm.length <= 2) {
    const searchTermLower = searchTerm.toLowerCase()
    const filtered = animeData.filter(anime => 
      anime.title?.toLowerCase().includes(searchTermLower) ||
      anime.title_orig?.toLowerCase().includes(searchTermLower) ||
      anime.material_data?.anime_title?.toLowerCase().includes(searchTermLower) ||
      anime.material_data?.title?.toLowerCase().includes(searchTermLower) ||
      anime.material_data?.title_en?.toLowerCase().includes(searchTermLower)
    )
    return removeDuplicates(filtered).slice(0, limit)
  }
  
  // Для длинных запросов используем триграммный поиск
  const getSearchableTexts = (anime) => {
    return [
      anime.title,
      anime.title_orig,
      anime.material_data?.anime_title,
      anime.material_data?.title,
      anime.material_data?.title_en
    ].filter(Boolean)
  }
  
  // Используем низкий порог 0.15 для более гибкого поиска (15% схожести)
  const results = trigramSearch(
    searchTerm,
    animeData,
    getSearchableTexts,
    0.15
  )
  
  return removeDuplicates(results).slice(0, limit)
}

// Кеш для жанров
let cachedGenres = null

/**
 * Получить жанры (с кешированием)
 */
export function getAllGenres() {
  if (cachedGenres) {
    return cachedGenres
  }
  
  const genresSet = new Set()
  animeData.forEach(anime => {
    anime.material_data?.anime_genres?.forEach(genre => {
      genresSet.add(genre)
    })
  })
  
  cachedGenres = Array.from(genresSet).sort()
  return cachedGenres
}

// Кеш для годов
let cachedYears = null

/**
 * Получить все годы выпуска (с кешированием)
 */
export function getAllYears() {
  if (cachedYears) {
    return cachedYears
  }
  
  const yearsSet = new Set()
  animeData.forEach(anime => {
    const year = anime.year || anime.material_data?.year
    if (year) yearsSet.add(year)
  })
  
  cachedYears = Array.from(yearsSet).sort((a, b) => b - a)
  return cachedYears
}

// Кеш для типов
let cachedTypes = null

/**
 * Получить все типы аниме (с кешированием)
 */
export function getAllTypes() {
  if (cachedTypes) {
    return cachedTypes
  }
  
  const typesSet = new Set()
  animeData.forEach(anime => {
    const kind = anime.material_data?.anime_kind
    if (kind) typesSet.add(kind)
  })
  
  cachedTypes = Array.from(typesSet)
  return cachedTypes
}

/**
 * Фильтрация аниме с пагинацией
 */
export function filterAnime({
  query = '',
  genre = '',
  year = '',
  type = '',
  status = '',
  minRating = 0,
  sortBy = 'rating',
  page = 1,
  limit = 24,
  contentType = '' // 'movie', 'series', или '' для всех
}) {
  let filtered = [...animeData]

  // Фильтр по типу контента (фильм или сериал)
  if (contentType) {
    filtered = filtered.filter(anime => anime.contentType === contentType)
  }

  // Поиск по названию с использованием триграммного алгоритма
  if (query) {
    const searchTerm = query.trim()
    
    // Для коротких запросов используем простой поиск
    if (searchTerm.length <= 2) {
      const searchTermLower = searchTerm.toLowerCase()
      filtered = filtered.filter(anime => 
        anime.title?.toLowerCase().includes(searchTermLower) ||
        anime.title_orig?.toLowerCase().includes(searchTermLower) ||
        anime.material_data?.anime_title?.toLowerCase().includes(searchTermLower) ||
        anime.material_data?.title?.toLowerCase().includes(searchTermLower) ||
        anime.material_data?.title_en?.toLowerCase().includes(searchTermLower)
      )
    } else {
      // Для длинных запросов используем триграммный поиск
      const getSearchableTexts = (anime) => {
        return [
          anime.title,
          anime.title_orig,
          anime.material_data?.anime_title,
          anime.material_data?.title,
          anime.material_data?.title_en
        ].filter(Boolean)
      }
      
      // Применяем триграммный поиск с низким порогом 0.15 для большего охвата
      const trigramResults = trigramSearch(
        searchTerm,
        filtered,
        getSearchableTexts,
        0.15
      )
      
      // Сохраняем порядок по релевантности
      filtered = trigramResults
    }
  }

  // Фильтр по жанру
  if (genre) {
    filtered = filtered.filter(anime =>
      anime.material_data?.anime_genres?.some(g =>
        g.toLowerCase() === genre.toLowerCase()
      )
    )
  }

  // Фильтр по году
  if (year) {
    filtered = filtered.filter(anime =>
      (anime.year || anime.material_data?.year) == year
    )
  }

  // Фильтр по типу
  if (type) {
    filtered = filtered.filter(anime =>
      anime.material_data?.anime_kind === type
    )
  }

  // Фильтр по статусу
  if (status) {
    filtered = filtered.filter(anime =>
      anime.material_data?.anime_status === status ||
      anime.material_data?.all_status === status
    )
  }

  // Фильтр по минимальному рейтингу
  if (minRating > 0) {
    filtered = filtered.filter(anime => {
      const rating = anime.material_data?.shikimori_rating ||
                    anime.material_data?.kinopoisk_rating ||
                    anime.material_data?.imdb_rating || 0
      return rating >= minRating
    })
  }

  // Удаляем дубликаты
  filtered = removeDuplicates(filtered)

  // Сортировка
  switch (sortBy) {
    case 'rating':
      filtered.sort((a, b) => {
        const ratingA = a.material_data?.shikimori_rating || 0
        const ratingB = b.material_data?.shikimori_rating || 0
        return ratingB - ratingA
      })
      break
    case 'popularity':
      filtered.sort((a, b) => {
        const votesA = a.material_data?.shikimori_votes || 0
        const votesB = b.material_data?.shikimori_votes || 0
        return votesB - votesA
      })
      break
    case 'year':
      filtered.sort((a, b) => {
        const yearA = a.year || a.material_data?.year || 0
        const yearB = b.year || b.material_data?.year || 0
        return yearB - yearA
      })
      break
    case 'title':
      filtered.sort((a, b) => {
        const titleA = a.material_data?.anime_title || a.title || ''
        const titleB = b.material_data?.anime_title || b.title || ''
        return titleA.localeCompare(titleB, 'ru')
      })
      break
    case 'recent':
      filtered.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at)
        const dateB = new Date(b.updated_at || b.created_at)
        return dateB - dateA
      })
      break
  }

  // Пагинация
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedResults = filtered.slice(startIndex, endIndex)

  return {
    items: paginatedResults.map(normalizeAnime),
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
    hasMore: endIndex < filtered.length
  }
}

/**
 * Очистить название от маркеров сезонов [ТВ-1], [ТВ-2] и т.д.
 */
function cleanTitle(title) {
  if (!title) return ''
  
  // Убираем [ТВ-1], [ТВ-2], [ТВ-3] и т.д.
  let cleaned = title.replace(/\s*\[ТВ-\d+\]\s*$/i, '')
  
  // Убираем [TV-1], [TV-2] и т.д.
  cleaned = cleaned.replace(/\s*\[TV-\d+\]\s*$/i, '')
  
  // Убираем лишние пробелы
  cleaned = cleaned.trim()
  
  return cleaned
}

/**
 * Получить лучшее русское название
 */
function getBestRussianTitle(anime) {
  const material = anime.material_data || {}
  
  // Приоритет: anime_title (без маркеров) > other_titles[0] > title (очищенный)
  const animeTitle = material.anime_title
  const otherTitles = material.other_titles || []
  const mainTitle = anime.title
  
  // Если есть anime_title, используем его
  if (animeTitle && animeTitle !== mainTitle) {
    return cleanTitle(animeTitle)
  }
  
  // Если есть альтернативные русские названия, берём первое
  if (otherTitles.length > 0) {
    const firstOther = otherTitles[0]
    // Проверяем, что это русское название (содержит кириллицу)
    if (firstOther && /[а-яА-ЯёЁ]/.test(firstOther)) {
      return cleanTitle(firstOther)
    }
  }
  
  // Иначе используем основное название, очищенное от маркеров
  return cleanTitle(mainTitle || material.title)
}

/**
 * Проверяет, заканчивается ли название на номер сезона
 */
function endsWithSeasonNumber(title) {
  if (!title) return false
  // Проверяем, заканчивается ли на " 2", " 3", " 4" и т.д.
  return /\s+\d+$/.test(title.trim())
}

/**
 * Получить номер сезона из названия
 */
function getSeasonNumber(title) {
  if (!title) return null
  
  const match = title.match(/\[ТВ-(\d+)\]/i) || title.match(/\[TV-(\d+)\]/i)
  return match ? parseInt(match[1]) : null
}

/**
 * Получить лучшее изображение с fallback
 */
function getBestImage(material) {
  // Приоритет: poster_url (Kinopoisk) > anime_poster_url (Shikimori) > placeholder
  const posterUrl = material.poster_url
  const animePosterUrl = material.anime_poster_url
  
  // Kinopoisk обычно более надёжен
  if (posterUrl && posterUrl.includes('kp.yandex.net')) {
    return posterUrl
  }
  
  // Затем пробуем Shikimori
  if (animePosterUrl) {
    return animePosterUrl
  }
  
  // Если есть poster_url, но не Kinopoisk
  if (posterUrl) {
    return posterUrl
  }
  
  // Fallback на placeholder
  return '/placeholder-anime.svg'
}

/**
 * Фильтровать рабочие скриншоты
 */
function getValidScreenshots(screenshots) {
  if (!screenshots || !Array.isArray(screenshots)) return []
  
  // Фильтруем только рабочие домены
  return screenshots.filter(url => {
    if (!url) return false
    // Пропускаем проблемные домены
    if (url.includes('nyaa.shikimori.one')) return false
    return true
  })
}

/**
 * Нормализовать данные аниме для использования в компонентах
 */
export function normalizeAnime(anime) {
  if (!anime) return null
  
  const material = anime.material_data || {}
  
  // Получаем лучшее название
  const bestTitle = getBestRussianTitle(anime)
  const seasonNumber = getSeasonNumber(anime.title)
  
  // Формируем финальное название с сезоном (если есть и его еще нет в названии)
  let finalTitle = bestTitle
  if (seasonNumber && seasonNumber > 1 && !endsWithSeasonNumber(bestTitle)) {
    finalTitle = `${bestTitle} ${seasonNumber}`
  }
  
  return {
    id: anime.id,
    title: finalTitle,
    titleEn: anime.title_orig || material.title_en,
    titleOriginal: anime.title_orig,
    rating: material.shikimori_rating || material.kinopoisk_rating || material.imdb_rating || 0,
    votes: material.shikimori_votes || material.kinopoisk_votes || material.imdb_votes || 0,
    year: anime.year || material.year,
    episodes: material.episodes_total || material.episodes_aired,
    genre: material.anime_genres || material.genres || [],
    image: getBestImage(material),
    posterUrl: material.poster_url,
    animePosterUrl: material.anime_poster_url,
    screenshots: getValidScreenshots(material.screenshots),
    description: material.description || material.anime_description || `${finalTitle} - ${anime.title_orig}`,
    status: getAnimeStatus(material),
    duration: material.duration,
    kind: material.anime_kind,
    studios: material.anime_studios || [],
    countries: material.countries || [],
    ageRating: material.rating_mpaa,
    minimalAge: material.minimal_age,
    seasonNumber: seasonNumber,
    // Тип контента (фильм или сериал)
    contentType: anime.contentType,
    // Данные для плеера
    playerLink: anime.player_link,
    link: anime.link,
    quality: anime.quality,
    translation: anime.translation,
    translate: anime.translate,
    // Ссылки на внешние ресурсы
    kinopoiskId: anime.kinopoisk_id,
    imdbId: anime.imdb_id,
    shikimoriId: anime.shikimori_id,
    // Дополнительные данные
    type: anime.type,
    lgbt: anime.lgbt,
    camrip: anime.camrip,
    createdAt: anime.created_at,
    updatedAt: anime.updated_at,
  }
}

/**
 * Получить статус аниме на русском
 */
function getAnimeStatus(material) {
  const status = material.anime_status || material.all_status
  
  const statusMap = {
    'ongoing': 'Выходит',
    'released': 'Завершён',
    'anons': 'Анонсирован',
    'announced': 'Анонсирован',
  }
  
  return statusMap[status] || 'Неизвестно'
}

/**
 * Получить нормализованные данные для главной страницы
 */
export function getHomePageData() {
  return {
    featured: getTopAnime(6).map(normalizeAnime),
    popular: getPopularAnime(12).map(normalizeAnime),
    trending: getRecentAnime(12).map(normalizeAnime),
    ongoing: getOngoingAnime(12).map(normalizeAnime),
  }
}

/**
 * Получить аниме фильмы
 */
export function getAnimeMovies(limit = 20) {
  const filtered = animeData.filter(anime => 
    anime.contentType === 'movie' ||
    anime.material_data?.anime_kind === 'movie' ||
    anime.type === 'anime-movie'
  )
  return removeDuplicates(filtered)
    .slice(0, limit)
    .map(normalizeAnime)
}

/**
 * Получить аниме сериалы
 */
export function getAnimeSeries(limit = 20) {
  const filtered = animeData.filter(anime => 
    anime.contentType === 'series' ||
    anime.material_data?.anime_kind === 'tv' ||
    anime.type === 'anime-serial'
  )
  return removeDuplicates(filtered)
    .slice(0, limit)
    .map(normalizeAnime)
}

/**
 * Получить контент по типу
 */
export function getAnimeByContentType(contentType, limit = 20) {
  if (contentType === 'all') {
    return removeDuplicates(animeData)
      .slice(0, limit)
      .map(normalizeAnime)
  }
  
  const filtered = animeData.filter(anime => anime.contentType === contentType)
  return removeDuplicates(filtered)
    .slice(0, limit)
    .map(normalizeAnime)
}

/**
 * Получить похожие аниме
 */
export function getSimilarAnime(animeId, limit = 6) {
  const currentAnime = getAnimeById(animeId)
  if (!currentAnime) return []
  
  const currentGenres = currentAnime.material_data?.anime_genres || []
  
  const filtered = animeData
    .filter(anime => anime.id !== animeId)
    .filter(anime => {
      const genres = anime.material_data?.anime_genres || []
      return genres.some(genre => currentGenres.includes(genre))
    })
  
  return removeDuplicates(filtered)
    .sort(() => 0.5 - Math.random())
    .slice(0, limit)
    .map(normalizeAnime)
}

