'use client'

import AnimeCacheService from '@/lib/services/animeCacheService'

// CLIENT-SIDE: Используем API роуты для доступа к БД
// (MongoDB доступна только на сервере)

const API_BASE = '/api/anime'

// Получить все аниме
export const getAllAnime = async () => {
  try {
    const response = await fetch(`${API_BASE}?limit=100`)
    if (!response.ok) throw new Error('Failed to fetch anime')
    const data = await response.json()
    return data.anime || []
  } catch (error) {
    console.error('Failed to fetch all anime:', error)
    return []
  }
}

// Получить популярные аниме
export const getPopularAnime = async (limit = 50) => {
  try {
    const response = await fetch(`${API_BASE}/popular?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch popular anime')
    const data = await response.json()
    return data.anime || []
  } catch (error) {
    console.error('Failed to fetch popular anime:', error)
    return []
  }
}

// Получить онгоинги
export const getOngoingAnime = async (limit = 50) => {
  try {
    const response = await fetch(`${API_BASE}/ongoing?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch ongoing anime')
    const data = await response.json()
    return data.anime || []
  } catch (error) {
    console.error('Failed to fetch ongoing anime:', error)
    return []
  }
}

// Получить топ аниме (по рейтингу)
export const getTopRatedAnime = async (limit = 50) => {
  try {
    const response = await fetch(`${API_BASE}/top-rated?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch top rated anime')
    const data = await response.json()
    return data.anime || []
  } catch (error) {
    console.error('Failed to fetch top rated anime:', error)
    return []
  }
}

// Поиск аниме
export const searchAnime = async (query, limit = 50) => {
  try {
    if (!query || query.trim().length < 2) return []
    
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to search anime')
    const data = await response.json()
    return data.anime || []
  } catch (error) {
    console.error('Failed to search anime:', error)
    return []
  }
}

// Получить аниме по ID
export async function getAnimeById(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch anime')
    }
    const data = await response.json()
    return data.anime || null
  } catch (error) {
    console.error('Failed to fetch anime by ID:', error)
    return null
  }
}

// Функции для работы с кастомными аниме (localStorage)
function getCustomAnime() {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('custom_anime')
  return data ? JSON.parse(data) : []
}

export function saveAnime(anime) {
  if (typeof window === 'undefined') return
  
  const customAnime = getCustomAnime()
  const newAnime = {
    ...anime,
    id: `custom_${Date.now()}`,
    isCustom: true,
    source: 'custom'
  }
  
  customAnime.push(newAnime)
  localStorage.setItem('custom_anime', JSON.stringify(customAnime))
  return newAnime
}

export function deleteAnime(animeId) {
  if (typeof window === 'undefined') return
  
  const customAnime = getCustomAnime()
  const filtered = customAnime.filter(anime => anime.id !== animeId)
  localStorage.setItem('custom_anime', JSON.stringify(filtered))
}

// Инициализация при загрузке приложения
export async function initializeAnimeData() {
  try {
    // Просто проверяем что API работает
    const response = await fetch(`${API_BASE}/stats`)
    if (response.ok) {
      const stats = await response.json()
      console.log('✓ Anime API ready:', stats)
    }
  } catch (error) {
    console.error('Failed to initialize anime data:', error)
  }
}
