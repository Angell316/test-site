'use client'

import { useState, useEffect } from 'react'
import { Star, Send, Trash2, Shield, ThumbsUp, MessageCircle, ChevronDown, TrendingUp, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function CommentsSection({ animeId }) {
  const { user, isAuthenticated, isModerator } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [replyTo, setReplyTo] = useState(null)
  const [sortBy, setSortBy] = useState('new') // 'new', 'popular'
  const [expandedReplies, setExpandedReplies] = useState(new Set())

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
      likes: 0,
      likedBy: [],
      parentId: replyTo,
      replies: []
    }

    saveComments([comment, ...comments])
    setNewComment('')
    setReplyTo(null)
  }

  const handleDeleteComment = (commentId) => {
    saveComments(comments.filter(c => c.id !== commentId))
  }

  const handleLikeComment = (commentId) => {
    if (!user) return

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        const likedBy = comment.likedBy || []
        const hasLiked = likedBy.includes(user.id)
        
        return {
          ...comment,
          likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
          likedBy: hasLiked 
            ? likedBy.filter(id => id !== user.id)
            : [...likedBy, user.id]
        }
      }
      return comment
    })

    saveComments(updatedComments)
  }

  const toggleReplies = (commentId) => {
    const newExpanded = new Set(expandedReplies)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedReplies(newExpanded)
  }

  const canDeleteComment = (comment) => {
    if (!user) return false
    return user.id === comment.userId || isModerator
  }

  const hasLiked = (comment) => {
    if (!user) return false
    return (comment.likedBy || []).includes(user.id)
  }

  const getSortedComments = () => {
    const topLevelComments = comments.filter(c => !c.parentId)
    
    if (sortBy === 'popular') {
      return topLevelComments.sort((a, b) => b.likes - a.likes)
    }
    return topLevelComments.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const getCommentReplies = (commentId) => {
    return comments
      .filter(c => c.parentId === commentId)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
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

  const CommentItem = ({ comment, isReply = false }) => {
    const replies = getCommentReplies(comment.id)
    const hasReplies = replies.length > 0
    const isExpanded = expandedReplies.has(comment.id)

    return (
      <div className={`${isReply ? 'ml-12' : ''}`}>
        <div className="p-4 rounded-xl bg-dark-900/50 border border-white/5 hover:border-white/10 transition-all">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson-primary to-crimson-dark flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">
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
                  {new Date(comment.date).toLocaleDateString('ru', { 
                    day: 'numeric', 
                    month: 'short', 
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            {canDeleteComment(comment) && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all group"
              >
                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
            )}
          </div>

          {/* Reply indicator */}
          {comment.parentId && (
            <div className="mb-2 ml-[52px]">
              <span className="text-xs text-gray-500">↳ Ответ на комментарий</span>
            </div>
          )}

          {/* Comment text */}
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap ml-[52px] mb-3">
            {comment.text}
          </p>

          {/* Actions */}
          <div className="flex items-center space-x-4 ml-[52px]">
            <button
              onClick={() => handleLikeComment(comment.id)}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all group ${
                hasLiked(comment)
                  ? 'bg-crimson-primary/20 text-crimson-primary'
                  : 'hover:bg-white/5 text-gray-400'
              } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <ThumbsUp className={`w-4 h-4 transition-all ${hasLiked(comment) ? 'fill-crimson-primary' : 'group-hover:scale-110'}`} />
              <span className="text-sm font-medium">{comment.likes || 0}</span>
            </button>

            {!isReply && isAuthenticated && (
              <button
                onClick={() => setReplyTo(comment.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-400 transition-all group"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Ответить</span>
              </button>
            )}

            {hasReplies && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-400 transition-all group"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{replies.length} {replies.length === 1 ? 'ответ' : 'ответов'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyTo === comment.id && (
            <form onSubmit={handleSubmitComment} className="mt-4 ml-[52px]">
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Ответить ${comment.userName}...`}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-dark-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-crimson-primary transition-all resize-none"
                  rows="2"
                  autoFocus
                />
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null)
                      setNewComment('')
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 transition-all"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-crimson-primary to-crimson-dark text-white text-sm hover:shadow-lg hover:shadow-crimson-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ответить
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Replies */}
        {hasReplies && isExpanded && (
          <div className="mt-3 space-y-3">
            {replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const sortedComments = getSortedComments()

  return (
    <div className="space-y-6">
      {/* Rating Section */}
      {isAuthenticated && (
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-800/40 border border-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span>Оцените аниме</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                onClick={() => saveRating(rating)}
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-all hover:scale-125 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 transition-all duration-200 ${
                    rating <= (hoverRating || userRating)
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg drop-shadow-yellow-400/50'
                      : 'text-gray-600 hover:text-gray-500'
                  }`}
                />
              </button>
            ))}
            {userRating > 0 && (
              <span className="ml-4 text-2xl font-bold text-white bg-gradient-to-r from-crimson-primary to-crimson-dark bg-clip-text text-transparent">
                {userRating}/10
              </span>
            )}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-dark-800/80 to-dark-800/40 border border-white/10 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
              Комментарии
            </h3>
            <span className="px-3 py-1.5 rounded-lg bg-crimson-primary/20 border border-crimson-primary/30 text-crimson-primary text-sm font-bold">
              {comments.filter(c => !c.parentId).length}
            </span>
          </div>
          
          {/* Sort buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSortBy('new')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'new'
                  ? 'bg-crimson-primary text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Новые</span>
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'popular'
                  ? 'bg-crimson-primary text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Популярные</span>
            </button>
          </div>
        </div>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          !replyTo && (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="relative">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson-primary to-crimson-dark flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Поделитесь своим мнением об этом аниме..."
                    className="flex-1 px-4 py-3 rounded-xl bg-dark-900/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-crimson-primary focus:ring-2 focus:ring-crimson-primary/20 transition-all resize-none"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-medium hover:shadow-lg hover:shadow-crimson-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Отправить</span>
                  </button>
                </div>
              </div>
            </form>
          )
        ) : (
          <div className="mb-6 p-6 rounded-xl bg-dark-900/50 border border-white/10 text-center">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-lg font-medium">Войдите, чтобы оставить комментарий</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Комментариев пока нет</p>
              <p className="text-gray-500 text-sm mt-1">Будьте первым, кто оставит комментарий!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

