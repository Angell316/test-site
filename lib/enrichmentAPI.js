// Enrichment API - объединяет данные из разных источников
// Kodik (основа) + Jikan (трейлеры, доп изображения) + Shikimori (в будущем)

import { getJikanAnimeById, getJikanAnimePictures, searchJikanAnime } from './jikanAPI.js'

/**
 * Собрать ВСЕ доступные изображения из всех источников
 */
function collectAllImages(kodikAnime, jikanData, jikanPictures) {
  const allImages = []
  
  // 1. Изображения из трейлера (приоритет - высокое качество)
  if (jikanData?.trailer?.images) {
    const trailerImages = jikanData.trailer.images
    if (trailerImages.maximum_image_url) {
      allImages.push({
        url: trailerImages.maximum_image_url,
        type: 'trailer',
        quality: 'maximum',
        width: 1920,
        height: 1080
      })
    }
    if (trailerImages.large_image_url) {
      allImages.push({
        url: trailerImages.large_image_url,
        type: 'trailer',
        quality: 'large'
      })
    }
    if (trailerImages.medium_image_url) {
      allImages.push({
        url: trailerImages.medium_image_url,
        type: 'trailer',
        quality: 'medium'
      })
    }
  }
  
  // 2. Постеры из Jikan (разные размеры)
  if (jikanData?.images) {
    // JPG версии
    if (jikanData.images.jpg) {
      if (jikanData.images.jpg.large_image_url) {
        allImages.push({
          url: jikanData.images.jpg.large_image_url,
          type: 'poster',
          format: 'jpg',
          quality: 'large'
        })
      }
      if (jikanData.images.jpg.image_url) {
        allImages.push({
          url: jikanData.images.jpg.image_url,
          type: 'poster',
          format: 'jpg',
          quality: 'medium'
        })
      }
      if (jikanData.images.jpg.small_image_url) {
        allImages.push({
          url: jikanData.images.jpg.small_image_url,
          type: 'poster',
          format: 'jpg',
          quality: 'small'
        })
      }
    }
    
    // WebP версии
    if (jikanData.images.webp) {
      if (jikanData.images.webp.large_image_url) {
        allImages.push({
          url: jikanData.images.webp.large_image_url,
          type: 'poster',
          format: 'webp',
          quality: 'large'
        })
      }
      if (jikanData.images.webp.image_url) {
        allImages.push({
          url: jikanData.images.webp.image_url,
          type: 'poster',
          format: 'webp',
          quality: 'medium'
        })
      }
    }
  }
  
  // 3. Дополнительные изображения из Jikan
  if (jikanPictures && jikanPictures.length > 0) {
    jikanPictures.forEach((pic, index) => {
      if (pic.large_image_url) {
        allImages.push({
          url: pic.large_image_url,
          type: 'screenshot',
          source: 'jikan',
          quality: 'large',
          index: index
        })
      }
      if (pic.image_url) {
        allImages.push({
          url: pic.image_url,
          type: 'screenshot',
          source: 'jikan',
          quality: 'medium',
          index: index
        })
      }
    })
  }
  
  // 4. Скриншоты из Kodik
  if (kodikAnime.screenshots && Array.isArray(kodikAnime.screenshots)) {
    kodikAnime.screenshots.forEach((url, index) => {
      allImages.push({
        url: url,
        type: 'screenshot',
        source: 'kodik',
        index: index
      })
    })
  }
  
  // 5. Основной постер из Kodik (material_data)
  if (kodikAnime.image) {
    allImages.push({
      url: kodikAnime.image,
      type: 'poster',
      source: 'kodik',
      quality: 'high'
    })
  }
  
  // Удаляем дубликаты по URL
  const uniqueImages = Array.from(
    new Map(allImages.map(img => [img.url, img])).values()
  )
  
  return uniqueImages
}

/**
 * Обогатить данные аниме из Kodik дополнительной информацией из Jikan
 */
export async function enrichAnimeData(kodikAnime) {
  if (!kodikAnime) return null
  
  try {
    let jikanData = null
    let jikanPictures = []
    
    // Пытаемся найти аниме в Jikan
    if (kodikAnime.shikimori_id) {
      // MAL ID часто совпадает с Shikimori ID
      jikanData = await getJikanAnimeById(kodikAnime.shikimori_id)
      if (jikanData) {
        jikanPictures = await getJikanAnimePictures(kodikAnime.shikimori_id)
      }
    }
    
    // Если не нашли по ID, пытаемся поиском по названию
    if (!jikanData && kodikAnime.titleEn) {
      const searchResults = await searchJikanAnime(kodikAnime.titleEn)
      if (searchResults.length > 0) {
        const bestMatch = searchResults[0]
        jikanData = await getJikanAnimeById(bestMatch.mal_id)
        if (jikanData) {
          jikanPictures = await getJikanAnimePictures(bestMatch.mal_id)
        }
      }
    }
    
    // Собираем ВСЕ изображения из всех источников
    const allImages = collectAllImages(kodikAnime, jikanData, jikanPictures)
    
    // Выбираем лучшие изображения для разных целей
    const trailerImages = allImages.filter(img => img.type === 'trailer')
    const posterImages = allImages.filter(img => img.type === 'poster')
    const screenshots = allImages.filter(img => img.type === 'screenshot')
    
    // Объединяем данные
    return {
      ...kodikAnime,
      
      // Трейлер из Jikan (приоритет)
      trailer: jikanData?.trailer || kodikAnime.trailer,
      
      // Лучшее изображение трейлера
      trailerImage: trailerImages[0]?.url || null,
      
      // ВСЕ изображения трейлера
      trailerImages: trailerImages,
      
      // ВСЕ постеры
      posters: posterImages,
      
      // ВСЕ скриншоты
      screenshots: screenshots,
      
      // ВСЕ изображения (объединённые)
      allImages: allImages,
      
      // Фоновое изображение для баннера (лучшее качество)
      bannerImage: trailerImages[0]?.url || // Трейлер maximum
                   posterImages.find(p => p.quality === 'large')?.url || // Большой постер
                   kodikAnime.image, // Fallback
      
      // Основной постер (лучший)
      mainPoster: posterImages.find(p => p.quality === 'large')?.url ||
                  posterImages.find(p => p.quality === 'medium')?.url ||
                  kodikAnime.image,
      
      // Расширенное описание
      synopsis: jikanData?.synopsis || kodikAnime.description,
      background: jikanData?.background,
      
      // Дополнительные названия
      title_synonyms: jikanData?.title_synonyms || [],
      
      // Рейтинги и статистика из разных источников
      ratings: {
        kodik: kodikAnime.rating,
        shikimori: kodikAnime.rating,
        mal: jikanData?.score,
        mal_scored_by: jikanData?.scored_by
      },
      
      // Статистика
      mal_rank: jikanData?.rank,
      mal_popularity: jikanData?.popularity,
      mal_members: jikanData?.members,
      mal_favorites: jikanData?.favorites,
      
      // Темы и демография
      themes: jikanData?.themes || [],
      demographics: jikanData?.demographics || [],
      
      // Связи
      relations: jikanData?.relations || [],
      
      // Метаданные обогащения
      enriched: true,
      enrichment_sources: ['kodik', jikanData ? 'jikan' : null].filter(Boolean),
      enrichment_date: new Date().toISOString(),
      total_images: allImages.length
    }
  } catch (error) {
    console.error('Failed to enrich anime data:', error)
    // В случае ошибки возвращаем исходные данные
    return kodikAnime
  }
}

/**
 * Обогатить массив аниме
 */
export async function enrichAnimeList(animeList, limit = 10) {
  if (!animeList || animeList.length === 0) return []
  
  try {
    // Обогащаем только первые N аниме (чтобы не перегружать API)
    const itemsToEnrich = animeList.slice(0, limit)
    const remainingItems = animeList.slice(limit)
    
    console.log(`Enriching ${itemsToEnrich.length} anime with data from multiple sources...`)
    
    // Обогащаем параллельно с задержкой
    const enriched = []
    for (const anime of itemsToEnrich) {
      const enrichedAnime = await enrichAnimeData(anime)
      enriched.push(enrichedAnime)
      console.log(`✓ Enriched: ${enrichedAnime.title} (${enrichedAnime.total_images || 0} images)`)
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    return [...enriched, ...remainingItems]
  } catch (error) {
    console.error('Failed to enrich anime list:', error)
    return animeList
  }
}

/**
 * Получить аниме для баннера (с обогащением)
 */
export async function getBannerAnime(count = 5) {
  try {
    // Импортируем Kodik API динамически чтобы избежать циклических зависимостей
    const { getPopularAnime, getOngoingAnime } = await import('./kodikAPI.js')
    
    // Получаем популярные и онгоинги
    const [popular, ongoing] = await Promise.all([
      getPopularAnime(10),
      getOngoingAnime(10)
    ])
    
    // Объединяем и берём уникальные
    const combined = [...ongoing, ...popular]
    const unique = Array.from(
      new Map(combined.map(anime => [anime.id, anime])).values()
    )
    
    // Берём первые count аниме и обогащаем их
    const selectedAnime = unique.slice(0, count)
    const enrichedAnime = await enrichAnimeList(selectedAnime, count)
    
    return enrichedAnime
  } catch (error) {
    console.error('Failed to get banner anime:', error)
    return []
  }
}

export default {
  enrichAnimeData,
  enrichAnimeList,
  getBannerAnime
}

