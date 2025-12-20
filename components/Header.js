'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Play, Film, Tv, Star, User, LogIn, Shield, Bell, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'
import { getAllAnime } from '@/app/data/animeData'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const { user, logout, isAdmin, isModerator } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Search functionality
  useEffect(() => {
    async function search() {
      if (searchQuery.trim().length > 1) {
        try {
          const allAnime = await getAllAnime()
          const filtered = allAnime.filter(anime =>
            anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (anime.titleEn && anime.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (anime.genre && anime.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())))
          ).slice(0, 6)
          setSearchResults(filtered)
        } catch (error) {
          console.error('Search failed:', error)
          setSearchResults([])
        }
      } else {
        setSearchResults([])
      }
    }
    
    search()
  }, [searchQuery])

  // Mock notifications for demo
  const notifications = [
    { id: 1, title: 'Атака Титанов', message: 'Вышла 12 серия!', time: '5 мин назад', new: true },
    { id: 2, title: 'Наруто', message: 'Новый эпизод доступен', time: '1 час назад', new: true },
    { id: 3, title: 'Моя геройская академия', message: 'Сезон завершён', time: '2 часа назад', new: false },
  ]

  const navLinks = [
    { href: '/', label: 'Главная', icon: Play },
    { href: '/anime', label: 'Аниме', icon: Tv },
    { href: '/movies', label: 'Фильмы', icon: Film },
    { href: '/top', label: 'Топ', icon: Star },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-900 bg-opacity-95 backdrop-blur-xl border-b border-white border-opacity-5 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-custom px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-crimson-primary rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-crimson-primary to-crimson-dark p-2 rounded-lg">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
              <span className="text-xl font-display font-bold gradient-text">
                AnimeVerse
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5 transition-all duration-200 group"
                  >
                    <Icon className="w-4 h-4 group-hover:text-crimson-primary transition-colors" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-200 group"
                aria-label="Поиск"
              >
                <Search className="w-5 h-5 group-hover:text-crimson-primary transition-colors" />
              </button>

              {/* Notifications (only for logged in users) */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-200 group"
                    aria-label="Уведомления"
                  >
                    <Bell className="w-5 h-5 group-hover:text-crimson-primary transition-colors" />
                    {notifications.some(n => n.new) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-crimson-primary rounded-full animate-pulse"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 glass-effect rounded-xl p-3 shadow-2xl animate-fadeInUp max-h-96 overflow-y-auto">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-white">Уведомления</h3>
                        <button className="text-xs text-crimson-primary hover:text-crimson-light">
                          Прочитать все
                        </button>
                      </div>
                      <div className="space-y-2">
                        {notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-all cursor-pointer ${
                              notif.new ? 'bg-crimson-primary bg-opacity-5' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="text-sm font-semibold text-white">{notif.title}</h4>
                              {notif.new && (
                                <span className="w-2 h-2 bg-crimson-primary rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mb-1">{notif.message}</p>
                            <span className="text-xs text-gray-500">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Menu or Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-crimson-primary bg-opacity-20 flex items-center justify-center text-sm">
                      {user.avatar || <User className="w-4 h-4 text-crimson-primary" />}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-white">{user.name}</span>
                    {(isAdmin || isModerator) && (
                      <Shield className="w-3 h-3 text-yellow-400" />
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 glass-effect rounded-lg p-1 shadow-lg animate-fadeInUp">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-white text-sm"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Профиль</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-white text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="w-4 h-4 text-yellow-400" />
                          <span>Админ-панель</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-crimson-primary text-sm"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Выйти</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-crimson-primary text-white font-semibold hover:bg-crimson-light transition-all text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:block">Войти</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                aria-label="Меню"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="py-4 animate-fadeInUp">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Искать аниме, фильмы, жанры..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all"
                  autoFocus
                />
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass-effect rounded-xl p-2 shadow-2xl max-h-96 overflow-y-auto">
                    {searchResults.map((anime) => (
                      <Link
                        key={anime.id}
                        href={`/anime/${anime.id}`}
                        onClick={() => {
                          setIsSearchOpen(false)
                          setSearchQuery('')
                          setSearchResults([])
                        }}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-all group"
                      >
                        <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-dark-700">
                          <Image
                            src={anime.image}
                            alt={anime.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white group-hover:text-crimson-light transition-colors truncate">
                            {anime.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {anime.year && (
                              <span className="text-xs text-gray-400">{anime.year}</span>
                            )}
                            {anime.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-gray-400">{anime.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-crimson-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                )}
                
                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass-effect rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">Ничего не найдено</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-3 space-y-1 animate-fadeInUp">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg glass-effect hover:bg-white hover:bg-opacity-10 transition-all duration-200 group"
                  >
                    <Icon className="w-4 h-4 group-hover:text-crimson-primary transition-colors" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
