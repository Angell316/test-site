'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export default function NextEpisodeTimer({ anime }) {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    // Проверяем, является ли аниме онгоингом
    if (anime.status !== 'Выходит' && anime.status !== 'ongoing') {
      return
    }

    // Рассчитываем время следующей серии
    const calculateNextEpisode = () => {
      const now = new Date()
      const updatedAt = new Date(anime.updatedAt || anime.createdAt)
      
      // Определяем день недели выхода
      const dayOfWeek = updatedAt.getDay()
      const hour = updatedAt.getHours()
      
      // Находим следующий такой же день недели
      const nextDate = new Date(now)
      const daysUntilNext = (dayOfWeek + 7 - now.getDay()) % 7 || 7
      nextDate.setDate(now.getDate() + daysUntilNext)
      nextDate.setHours(hour, 0, 0, 0)
      
      // Если время уже прошло, берём следующую неделю
      if (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 7)
      }
      
      return nextDate
    }

    const nextEpisodeDate = calculateNextEpisode()

    // Обновляем таймер каждую секунду
    const timer = setInterval(() => {
      const now = new Date()
      const difference = nextEpisodeDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft(null)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [anime])

  if (!timeLeft) {
    return null
  }

  // Форматируем время в компактный вид
  const formatTime = () => {
    const parts = []
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}д`)
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours}ч`)
    if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes}м`)
    if (timeLeft.seconds > 0) parts.push(`${timeLeft.seconds}с`)
    return parts.join(' ')
  }

  return (
    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-crimson-primary/10 border border-crimson-primary/20">
      <Clock className="w-4 h-4 text-crimson-primary" />
      <span className="text-gray-300 text-sm">{formatTime()}</span>
    </div>
  )
}

