// Enrichment API - объединяет данные из разных источников
// Kodik (основа) + Jikan (трейлеры, доп изображения)

import { getJikanAnimeById, getJikanAnimePictures, searchJikanAnime } from './jikanAPI'

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
    
    // Объединяем данные
    return {
      ...kodikAnime,
      
      // Трейлер из Jikan (приоритет)
      trailer: jikanData?.trailer || kodikAnime.trailer,
      trailerImage: jikanData?.trailer?.images?.maximum_image_url || 
                    jikanData?.trailer?.images?.large_image_url ||
                    jikanData?.trailer?.images?.medium_image_url,
      
      // Дополнительные изображения
      additionalImages: [
        // Изображения из Jikan
        ...(jikanPictures || []),
        // Скриншоты из Kodik
        ...(kodikAnime.screenshots || []).map(url => ({ image_url: url }))
      ],
      
      // Фоновое изображение для баннера
      bannerImage: jikanData?.trailer?.images?.maximum_image_url || // Изображение трейлера
                   jikanData?.images?.jpg?.large_image_url || // Большой постер
                   (jikanPictures && jikanPictures[0]?.large_image_url) || // Первое доп изображение
                   kodikAnime.image, // Fallback на основной постер
      
      // Расширенное описание
      synopsis: jikanData?.synopsis || kodikAnime.description,
      background: jikanData?.background,
      
      // Дополнительные названия
      title_synonyms: jikanData?.title_synonyms || [],
      
      // Рейтинги и статистика
      mal_score: jikanData?.score,
      mal_scored_by: jikanData?.scored_by,
      mal_rank: jikanData?.rank,
      mal_popularity: jikanData?.popularity,
      mal_members: jikanData?.members,
      mal_favorites: jikanData?.favorites,
      
      // Темы и демография
      themes: jikanData?.themes || [],
      demographics: jikanData?.demographics || [],
      
      // Связи
      relations: jikanData?.relations || [],
      
      // Источник обогащения
      enriched: true,
      enrichment_sources: ['kodik', jikanData ? 'jikan' : null].filter(Boolean)
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
    
    // Обогащаем параллельно с задержкой
    const enriched = []
    for (const anime of itemsToEnrich) {
      const enrichedAnime = await enrichAnimeData(anime)
      enriched.push(enrichedAnime)
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
    const { getPopularAnime, getOngoingAnime } = await import('./kodikAPI')
    
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

