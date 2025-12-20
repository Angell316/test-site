'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import { useAuth } from '@/contexts/AuthContext'
import { getAllAnime } from '@/app/data/animeData'
import { Plus, Save, Image as ImageIcon, Trash2, Shield, Users, MessageSquare, Edit, X } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('add-anime')
  const [customAnime, setCustomAnime] = useState([])
  const [allComments, setAllComments] = useState([])
  
  // Anime form state
  const [animeData, setAnimeData] = useState({
    title: '',
    titleEn: '',
    rating: '',
    year: '',
    episodes: '',
    genre: [],
    image: '',
    description: '',
    status: 'Выходит'
  })

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin, router])

  useEffect(() => {
    // Загружаем кастомные аниме
    const saved = localStorage.getItem('custom_anime')
    if (saved) {
      setCustomAnime(JSON.parse(saved))
    }

    // Загружаем все комментарии
    loadAllComments()
  }, [])

  const loadAllComments = () => {
    const comments = []
    const allAnime = getAllAnime()
    
    allAnime.forEach(anime => {
      const animeComments = localStorage.getItem(`anime_comments_${anime.id}`)
      if (animeComments) {
        const parsed = JSON.parse(animeComments)
        parsed.forEach(comment => {
          comments.push({
            ...comment,
            animeId: anime.id,
            animeTitle: anime.title
          })
        })
      }
    })
    
    setAllComments(comments.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }

  if (!user || !isAdmin) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAnimeData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenreChange = (genre) => {
    setAnimeData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newAnime = {
      ...animeData,
      id: Date.now(),
      rating: parseFloat(animeData.rating) || 0,
      year: parseInt(animeData.year) || new Date().getFullYear(),
      episodes: parseInt(animeData.episodes) || 1
    }
    
    const updated = [...customAnime, newAnime]
    localStorage.setItem('custom_anime', JSON.stringify(updated))
    setCustomAnime(updated)
    
    // Очищаем форму
    setAnimeData({
      title: '',
      titleEn: '',
      rating: '',
      year: '',
      episodes: '',
      genre: [],
      image: '',
      description: '',
      status: 'Выходит'
    })
    
    alert('Аниме успешно добавлено! Перезагрузите страницу чтобы увидеть его в каталоге.')
  }

  const handleDeleteAnime = (id) => {
    if (confirm('Удалить это аниме?')) {
      const updated = customAnime.filter(a => a.id !== id)
      localStorage.setItem('custom_anime', JSON.stringify(updated))
      setCustomAnime(updated)
    }
  }

  const handleDeleteComment = (commentId, animeId) => {
    if (confirm('Удалить этот комментарий?')) {
      const comments = JSON.parse(localStorage.getItem(`anime_comments_${animeId}`) || '[]')
      const updated = comments.filter(c => c.id !== commentId)
      localStorage.setItem(`anime_comments_${animeId}`, JSON.stringify(updated))
      loadAllComments()
    }
  }

  const genres = [
    'Экшен', 'Приключения', 'Комедия', 'Драма', 'Романтика',
    'Фэнтези', 'Сверхъестественное', 'Ужасы', 'Психологическое',
    'Спорт', 'Школа', 'Супергерои'
  ]

  const tabs = [
    { id: 'add-anime', label: 'Добавить аниме', icon: Plus },
    { id: 'manage-anime', label: 'Управление аниме', icon: Edit },
    { id: 'moderation', label: 'Модерация', icon: MessageSquare },
  ]

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />

      <section className="pt-32 pb-16 px-6 lg:px-12">
        <div className="container-custom">
          {/* Admin Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-white">
                Админ-панель
              </h1>
              <p className="text-gray-400 mt-1">
                Управление контентом и пользователями
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-crimson-primary text-white shadow-crimson-glow'
                      : 'glass-effect text-gray-400 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Content */}
          {activeTab === 'add-anime' && (
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Добавить новое аниме</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Название (RU) *</label>
                    <input
                      type="text"
                      name="title"
                      value={animeData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      placeholder="Атака титанов"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Название (EN)</label>
                    <input
                      type="text"
                      name="titleEn"
                      value={animeData.titleEn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      placeholder="Attack on Titan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Рейтинг (0-10) *</label>
                    <input
                      type="number"
                      name="rating"
                      value={animeData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.1"
                      className="w-full px-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      placeholder="9.2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Год *</label>
                    <input
                      type="number"
                      name="year"
                      value={animeData.year}
                      onChange={handleInputChange}
                      min="1900"
                      max="2099"
                      className="w-full px-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      placeholder="2024"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Количество эпизодов *</label>
                    <input
                      type="number"
                      name="episodes"
                      value={animeData.episodes}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      placeholder="24"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Статус *</label>
                    <select
                      name="status"
                      value={animeData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      required
                    >
                      <option value="Выходит">Выходит</option>
                      <option value="Завершён">Завершён</option>
                      <option value="Анонсирован">Анонсирован</option>
                      <option value="Приостановлен">Приостановлен</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">URL изображения *</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="image"
                      value={animeData.image}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Жанры * (выберите несколько)</label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleGenreChange(genre)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          animeData.genre.includes(genre)
                            ? 'bg-crimson-primary text-white'
                            : 'glass-effect text-gray-300 hover:bg-white hover:bg-opacity-10'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Описание *</label>
                  <textarea
                    name="description"
                    value={animeData.description}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary resize-none"
                    placeholder="Краткое описание аниме..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-semibold text-lg shadow-crimson-glow hover:shadow-crimson-glow-lg transition-all duration-300 hover:scale-105"
                >
                  <Save className="w-6 h-6" />
                  <span>Добавить аниме</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'manage-anime' && (
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Добавленные аниме ({customAnime.length})
              </h2>
              
              {customAnime.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {customAnime.map((anime) => (
                    <div key={anime.id} className="relative group">
                      <AnimeCard anime={anime} />
                      <button
                        onClick={() => handleDeleteAnime(anime.id)}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-red-500 bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Нет добавленных аниме</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="glass-effect rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Модерация комментариев ({allComments.length})
              </h2>
              
              {allComments.length > 0 ? (
                <div className="space-y-4">
                  {allComments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-xl glass-effect">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson-primary to-crimson-dark flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {comment.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{comment.userName}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(comment.date).toLocaleString('ru')}
                            </div>
                            <div className="text-xs text-crimson-primary mt-1">
                              Аниме: {comment.animeTitle}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id, comment.animeId)}
                          className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-all group"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                        </button>
                      </div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Нет комментариев</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
