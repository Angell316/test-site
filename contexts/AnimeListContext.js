'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const AnimeListContext = createContext()

export function AnimeListProvider({ children }) {
  const { user } = useAuth()
  const [lists, setLists] = useState({
    watching: [],
    completed: [],
    planned: [],
    dropped: [],
    favorite: []
  })

  useEffect(() => {
    if (user) {
      const savedLists = localStorage.getItem(`animeverse_lists_${user.id}`)
      if (savedLists) {
        setLists(JSON.parse(savedLists))
      }
    } else {
      setLists({
        watching: [],
        completed: [],
        planned: [],
        dropped: [],
        favorite: []
      })
    }
  }, [user])

  const saveLists = (newLists) => {
    if (user) {
      setLists(newLists)
      localStorage.setItem(`animeverse_lists_${user.id}`, JSON.stringify(newLists))
    }
  }

  const addToList = (animeId, listType) => {
    const newLists = { ...lists }
    
    // Убираем из всех других списков
    Object.keys(newLists).forEach(key => {
      if (key !== 'favorite') {
        newLists[key] = newLists[key].filter(id => id !== animeId)
      }
    })
    
    // Добавляем в нужный список
    if (!newLists[listType].includes(animeId)) {
      newLists[listType] = [...newLists[listType], animeId]
    }
    
    saveLists(newLists)
  }

  const removeFromList = (animeId, listType) => {
    const newLists = { ...lists }
    newLists[listType] = newLists[listType].filter(id => id !== animeId)
    saveLists(newLists)
  }

  const toggleFavorite = (animeId) => {
    const newLists = { ...lists }
    if (newLists.favorite.includes(animeId)) {
      newLists.favorite = newLists.favorite.filter(id => id !== animeId)
    } else {
      newLists.favorite = [...newLists.favorite, animeId]
    }
    saveLists(newLists)
  }

  const getAnimeStatus = (animeId) => {
    for (const [listType, animeIds] of Object.entries(lists)) {
      if (listType !== 'favorite' && animeIds.includes(animeId)) {
        return listType
      }
    }
    return null
  }

  const isFavorite = (animeId) => {
    return lists.favorite.includes(animeId)
  }

  const getListStats = () => {
    return {
      watching: lists.watching.length,
      completed: lists.completed.length,
      planned: lists.planned.length,
      dropped: lists.dropped.length,
      favorite: lists.favorite.length,
      total: lists.watching.length + lists.completed.length + lists.planned.length + lists.dropped.length
    }
  }

  const value = {
    lists,
    addToList,
    removeFromList,
    toggleFavorite,
    getAnimeStatus,
    isFavorite,
    getListStats
  }

  return <AnimeListContext.Provider value={value}>{children}</AnimeListContext.Provider>
}

export function useAnimeLists() {
  const context = useContext(AnimeListContext)
  if (!context) {
    throw new Error('useAnimeLists must be used within AnimeListProvider')
  }
  return context
}

