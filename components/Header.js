'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Play, Film, Tv, Star, User, LogIn, Shield } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout, isAdmin, isModerator } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
                <Search className="w-4 h-4 group-hover:text-crimson-primary transition-colors" />
              </button>

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
            <div className="py-3 animate-fadeInUp">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Искать аниме, фильмы..."
                  className="w-full pl-10 pr-3 py-2 text-sm rounded-lg glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all"
                  autoFocus
                />
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
