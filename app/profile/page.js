'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimeCard from '@/components/AnimeCard'
import { useAuth } from '@/contexts/AuthContext'
import { useAnimeLists } from '@/contexts/AnimeListContext'
import { getAllAnime } from '@/app/data/animeData'
import { 
  User, Mail, Calendar, Edit, Save, X, Heart, Eye, CheckCircle, 
  Clock, XCircle, Settings, Shield, Lock, Image as ImageIcon, Trash2
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, updateProfile } = useAuth()
  const { lists, getListStats } = useAnimeLists()
  const [activeTab, setActiveTab] = useState('lists')
  const [activeListTab, setActiveListTab] = useState('watching')
  const [allAnime, setAllAnime] = useState([])
  
  // Settings states
  const [editedName, setEditedName] = useState('')
  const [editedEmail, setEditedEmail] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setEditedName(user.name)
      setEditedEmail(user.email)
      setSelectedAvatar(user.avatar || '')
      setBio(user.bio || '')
    }
  }, [user])

  // Загрузка аниме данных
  useEffect(() => {
    async function loadAnime() {
      try {
        const anime = await getAllAnime()
        setAllAnime(anime)
      } catch (error) {
        console.error('Failed to load anime:', error)
        setAllAnime([])
      }
    }
    loadAnime()
  }, [])

  if (!user) return null

  const stats = getListStats()
  
  // Получаем все аниме включая кастомные
  const customAnime = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('custom_anime') || '[]') 
    : []
  const combinedAnime = [...allAnime, ...customAnime]

  const listTabs = [
    { id: 'watching', label: 'Смотрю', icon: Eye, count: stats.watching, color: 'blue' },
    { id: 'completed', label: 'Просмотрено', icon: CheckCircle, count: stats.completed, color: 'green' },
    { id: 'planned', label: 'Запланировано', icon: Clock, count: stats.planned, color: 'yellow' },
    { id: 'dropped', label: 'Брошено', icon: XCircle, count: stats.dropped, color: 'red' },
    { id: 'favorite', label: 'Избранное', icon: Heart, count: stats.favorite, color: 'crimson' },
  ]

  const avatarPresets = [
    '😀', '😎', '🤓', '😺', '🐱', '🐶', '🐼', '🦊', '🐯', '🦁',
    '🐸', '🐵', '🦄', '🐲', '👽', '🤖', '👻', '💀', '🎃', '🎭'
  ]

  const currentAnimeList = lists[activeListTab]
    .map(id => combinedAnime.find(anime => anime.id === id))
    .filter(Boolean)

  const handleSaveProfile = () => {
    updateProfile({ 
      name: editedName,
      email: editedEmail,
      bio: bio
    })
    alert('Профиль обновлён!')
  }

  const handleSaveAvatar = () => {
    updateProfile({ avatar: selectedAvatar })
    alert('Аватар обновлён!')
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Пароли не совпадают!')
      return
    }
    if (newPassword.length < 6) {
      alert('Пароль должен быть минимум 6 символов!')
      return
    }
    // В реальном приложении здесь была бы проверка oldPassword
    alert('Пароль изменён!')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-yellow-500'
      case 'moderator': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Администратор'
      case 'moderator': return 'Модератор'
      default: return 'Пользователь'
    }
  }

  return (
    <main className="min-h-screen bg-dark-900">
      <Header />

      <div className="pt-20">
        {/* Profile Header */}
        <section className="relative py-16 px-6 lg:px-12 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 border-b border-white border-opacity-5">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className={`w-32 h-32 rounded-2xl ${getRoleColor(user.role)} bg-opacity-20 border-4 ${getRoleColor(user.role)} flex items-center justify-center text-5xl shadow-lg`}>
                  {user.avatar || <User className="w-16 h-16 text-white" />}
                </div>
                {user.role !== 'user' && (
                  <div className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Регистрация: {new Date(user.registeredAt).toLocaleDateString('ru')}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-lg ${getRoleColor(user.role)} text-white font-semibold text-sm`}>
                    {getRoleLabel(user.role)}
                  </div>
                </div>
                {user.bio && (
                  <p className="text-gray-400 max-w-2xl">{user.bio}</p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl glass-effect">
                  <div className="text-3xl font-bold text-crimson-primary">{stats.total}</div>
                  <div className="text-xs text-gray-400 mt-1">Всего</div>
                </div>
                <div className="text-center p-4 rounded-xl glass-effect">
                  <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                  <div className="text-xs text-gray-400 mt-1">Просмотрено</div>
                </div>
                <div className="text-center p-4 rounded-xl glass-effect">
                  <div className="text-3xl font-bold text-yellow-400">{stats.favorite}</div>
                  <div className="text-xs text-gray-400 mt-1">Избранное</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Tabs */}
        <section className="px-6 lg:px-12 py-6 bg-dark-900 border-b border-white border-opacity-5">
          <div className="container-custom">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('lists')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'lists'
                    ? 'bg-crimson-primary text-white shadow-crimson-glow'
                    : 'glass-effect text-gray-400 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Мои списки</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-crimson-primary text-white shadow-crimson-glow'
                    : 'glass-effect text-gray-400 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Настройки</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        {activeTab === 'lists' ? (
          <>
            {/* List Tabs */}
            <section className="px-6 lg:px-12 py-8 bg-dark-900">
              <div className="container-custom">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  {listTabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeListTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveListTab(tab.id)}
                        className={`p-6 rounded-2xl transition-all transform hover:scale-105 ${
                          isActive
                            ? 'bg-gradient-to-br from-crimson-primary to-crimson-dark shadow-crimson-glow'
                            : 'glass-effect hover:bg-white hover:bg-opacity-5'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        <div className={`text-3xl font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {tab.count}
                        </div>
                        <div className={`text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {tab.label}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Anime Grid */}
                {currentAnimeList.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {currentAnimeList.map((anime, index) => (
                      <div key={anime.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
                        <AnimeCard anime={anime} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-block p-8 rounded-2xl glass-effect">
                      {(() => {
                        const Icon = listTabs.find(t => t.id === activeListTab).icon
                        return <Icon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      })()}
                      <h3 className="text-2xl font-semibold text-white mb-2">Список пуст</h3>
                      <p className="text-gray-400 mb-6">Добавьте аниме в этот список</p>
                      <a
                        href="/anime"
                        className="inline-block px-8 py-3 rounded-xl bg-crimson-primary text-white font-semibold hover:bg-crimson-light transition-all"
                      >
                        К каталогу
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="px-6 lg:px-12 py-12 bg-dark-900">
            <div className="container-custom max-w-4xl">
              <div className="space-y-6">
                {/* Profile Settings */}
                <div className="glass-effect rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-3">
                    <User className="w-6 h-6 text-crimson-primary" />
                    <span>Основная информация</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">О себе</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary resize-none"
                        placeholder="Расскажите о себе..."
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-crimson-primary text-white font-semibold hover:bg-crimson-light transition-all"
                    >
                      <Save className="w-5 h-5" />
                      <span>Сохранить изменения</span>
                    </button>
                  </div>
                </div>

                {/* Avatar Settings */}
                <div className="glass-effect rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-3">
                    <ImageIcon className="w-6 h-6 text-crimson-primary" />
                    <span>Аватар</span>
                  </h3>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-4 mb-6">
                    {avatarPresets.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`text-4xl p-4 rounded-xl transition-all hover:scale-110 ${
                          selectedAvatar === avatar
                            ? 'bg-crimson-primary shadow-crimson-glow'
                            : 'glass-effect hover:bg-white hover:bg-opacity-10'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSaveAvatar}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-crimson-primary text-white font-semibold hover:bg-crimson-light transition-all"
                  >
                    <Save className="w-5 h-5" />
                    <span>Сохранить аватар</span>
                  </button>
                </div>

                {/* Security Settings */}
                <div className="glass-effect rounded-2xl p-8">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-crimson-primary" />
                    <span>Безопасность</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Текущий пароль</label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Новый пароль</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Подтвердите пароль</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-effect text-white focus:outline-none focus:ring-2 focus:ring-crimson-primary"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-crimson-primary text-white font-semibold hover:bg-crimson-light transition-all"
                    >
                      <Lock className="w-5 h-5" />
                      <span>Изменить пароль</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}
