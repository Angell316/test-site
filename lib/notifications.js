// Notification System for tracking anime updates

export class NotificationManager {
  static STORAGE_KEY = 'anime-notifications'

  /**
   * Get all notifications
   */
  static getNotifications() {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  /**
   * Save notifications
   */
  static saveNotifications(notifications) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications))
  }

  /**
   * Add a new notification
   */
  static addNotification(notification) {
    const notifications = this.getNotifications()
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }
    notifications.unshift(newNotification)
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50)
    }
    
    this.saveNotifications(notifications)
    return newNotification
  }

  /**
   * Mark notification as read
   */
  static markAsRead(notificationId) {
    const notifications = this.getNotifications()
    const notification = notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications(notifications)
    }
  }

  /**
   * Mark all as read
   */
  static markAllAsRead() {
    const notifications = this.getNotifications()
    notifications.forEach(n => n.read = true)
    this.saveNotifications(notifications)
  }

  /**
   * Delete notification
   */
  static deleteNotification(notificationId) {
    const notifications = this.getNotifications()
    const filtered = notifications.filter(n => n.id !== notificationId)
    this.saveNotifications(filtered)
  }

  /**
   * Clear all notifications
   */
  static clearAll() {
    this.saveNotifications([])
  }

  /**
   * Get unread count
   */
  static getUnreadCount() {
    return this.getNotifications().filter(n => !n.read).length
  }

  /**
   * Create notification for new episode
   */
  static notifyNewEpisode(anime, episodeNumber) {
    return this.addNotification({
      type: 'new_episode',
      animeId: anime.id,
      animeTitle: anime.title,
      animeImage: anime.image,
      message: `Вышла ${episodeNumber} серия!`,
      data: { episodeNumber }
    })
  }

  /**
   * Create notification for new anime in watchlist
   */
  static notifyWatchlistUpdate(anime) {
    return this.addNotification({
      type: 'watchlist_update',
      animeId: anime.id,
      animeTitle: anime.title,
      animeImage: anime.image,
      message: 'Обновление в вашем списке'
    })
  }

  /**
   * Create notification for anime completion
   */
  static notifyAnimeCompleted(anime) {
    return this.addNotification({
      type: 'anime_completed',
      animeId: anime.id,
      animeTitle: anime.title,
      animeImage: anime.image,
      message: 'Аниме завершено!'
    })
  }

  /**
   * Create notification for new comment/reply
   */
  static notifyNewComment(anime, commenterName) {
    return this.addNotification({
      type: 'new_comment',
      animeId: anime.id,
      animeTitle: anime.title,
      animeImage: anime.image,
      message: `${commenterName} прокомментировал(а)`
    })
  }
}

/**
 * Watch History Manager
 */
export class WatchHistoryManager {
  static STORAGE_KEY = 'anime-watch-history'

  /**
   * Get watch history
   */
  static getHistory() {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(this.STORAGE_KEY)
    return data ? JSON.parse(data) : []
  }

  /**
   * Save history
   */
  static saveHistory(history) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history))
  }

  /**
   * Add anime to watch history
   */
  static addToHistory(anime, episode = 1, progress = 0) {
    const history = this.getHistory()
    const existingIndex = history.findIndex(item => item.animeId === anime.id)
    
    const historyItem = {
      animeId: anime.id,
      animeTitle: anime.title,
      animeImage: anime.image,
      episode: episode,
      progress: progress, // in seconds or percentage
      timestamp: new Date().toISOString(),
      totalEpisodes: anime.episodes
    }

    if (existingIndex >= 0) {
      // Update existing entry and move to top
      history.splice(existingIndex, 1)
    }
    
    history.unshift(historyItem)

    // Keep only last 100 items
    if (history.length > 100) {
      history.splice(100)
    }

    this.saveHistory(history)
    return historyItem
  }

  /**
   * Get anime from history
   */
  static getAnimeProgress(animeId) {
    const history = this.getHistory()
    return history.find(item => item.animeId === animeId)
  }

  /**
   * Remove from history
   */
  static removeFromHistory(animeId) {
    const history = this.getHistory()
    const filtered = history.filter(item => item.animeId !== animeId)
    this.saveHistory(filtered)
  }

  /**
   * Clear all history
   */
  static clearHistory() {
    this.saveHistory([])
  }

  /**
   * Get recently watched (last 10)
   */
  static getRecentlyWatched(limit = 10) {
    return this.getHistory().slice(0, limit)
  }

  /**
   * Get continue watching (with progress < 100%)
   */
  static getContinueWatching() {
    return this.getHistory().filter(item => {
      // If progress exists and is less than total episodes
      return item.episode < item.totalEpisodes
    }).slice(0, 10)
  }
}

// Example usage:
// import { NotificationManager, WatchHistoryManager } from '@/lib/notifications'
//
// // Notifications
// NotificationManager.notifyNewEpisode(anime, 12)
// const unread = NotificationManager.getUnreadCount()
// const allNotifications = NotificationManager.getNotifications()
//
// // Watch History
// WatchHistoryManager.addToHistory(anime, 5, 45.5)
// const continueWatching = WatchHistoryManager.getContinueWatching()
// const recentlyWatched = WatchHistoryManager.getRecentlyWatched()

