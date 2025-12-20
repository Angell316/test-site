'use client'

import { useState, useEffect } from 'react'
import { Star, Send, Trash2, Flag, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function CommentsSection({ animeId }) {
  const { user, isAuthenticated, isModerator } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    // Загружаем комментарии из localStorage
    const savedComments = localStorage.getItem(`anime_comments_${animeId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }

    // Загружаем рейтинг пользователя
    if (user) {
      const savedRatings = localStorage.getItem(`anime_ratings_${animeId}`)
      if (savedRatings) {
        const ratings = JSON.parse(savedRatings)
        const userRatingData = ratings.find(r => r.userId === user.id)
        if (userRatingData) {
          setUserRating(userRatingData.rating)
        }
      }
    }
  }, [animeId, user])

  const saveComments = (newComments) => {
    setComments(newComments)
    localStorage.setItem(`anime_comments_${animeId}`, JSON.stringify(newComments))
  }

  const saveRating = (rating) => {
    if (!user) return

    const savedRatings = localStorage.getItem(`anime_ratings_${animeId}`)
    let ratings = savedRatings ? JSON.parse(savedRatings) : []
    
    const existingRatingIndex = ratings.findIndex(r => r.userId === user.id)
    if (existingRatingIndex >= 0) {
      ratings[existingRatingIndex].rating = rating
    } else {
      ratings.push({ userId: user.id, rating, date: new Date().toISOString() })
    }
    
    localStorage.setItem(`anime_ratings_${animeId}`, JSON.stringify(ratings))
    setUserRating(rating)
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    const comment = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      text: newComment,
      date: new Date().toISOString(),
      likes: 0
    }

    saveComments([comment, ...comments])
    setNewComment('')
  }

  const handleDeleteComment = (commentId) => {
    saveComments(comments.filter(c => c.id !== commentId))
  }

  const canDeleteComment = (comment) => {
    if (!user) return false
    return user.id === comment.userId || isModerator
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-yellow-400'
      case 'moderator':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Rating Section */}
      {isAuthenticated && (
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Ваша оценка</h3>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                onClick={() => saveRating(rating)}
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    rating <= (hoverRating || userRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
            {userRating > 0 && (
              <span className="ml-4 text-2xl font-bold text-white">{userRating}/10</span>
            )}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="glass-effect rounded-2xl p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Комментарии <span className="text-gray-400">({comments.length})</span>
        </h3>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Напишите ваш комментарий..."
                className="w-full px-4 py-3 pr-12 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all resize-none"
                rows="4"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="absolute bottom-4 right-4 p-2 rounded-lg bg-crimson-primary text-white hover:bg-crimson-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-6 rounded-xl glass-effect text-center">
            <p className="text-gray-400 mb-4">Войдите, чтобы оставить комментарий</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-xl glass-effect hover:bg-white hover:bg-opacity-5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson-primary to-crimson-dark flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {comment.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{comment.userName}</span>
                        {comment.userRole !== 'user' && (
                          <Shield className={`w-4 h-4 ${getRoleColor(comment.userRole)}`} />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleString('ru')}
                      </span>
                    </div>
                  </div>
                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-all group"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                    </button>
                  )}
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Комментариев пока нет. Будьте первым!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

