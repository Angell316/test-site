'use client'

import { useState } from 'react'
import { X, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { login, register } = useAuth()

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'login') {
      const result = login(email, password)
      if (result.success) {
        onClose()
      } else {
        setError(result.error)
      }
    } else {
      if (!name.trim()) {
        setError('Введите имя')
        return
      }
      const result = register(email, name, password)
      if (result.success) {
        onClose()
      } else {
        setError('Ошибка регистрации')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900 bg-opacity-90 backdrop-blur-sm">
      <div className="relative w-full max-w-md glass-effect rounded-2xl p-8 animate-fadeInUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          <p className="text-gray-400">
            {mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        {/* Demo Accounts */}
        {mode === 'login' && (
          <div className="mb-6 p-4 rounded-xl bg-dark-700 border border-dark-600">
            <p className="text-sm text-gray-400 mb-2">Тестовые аккаунты (пароль: 123456):</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• user@test.com - Пользователь</p>
              <p>• mod@test.com - Модератор</p>
              <p>• admin@test.com - Администратор</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Имя
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all"
                  placeholder="Ваше имя"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl glass-effect text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-crimson-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-crimson-primary to-crimson-dark text-white font-semibold shadow-crimson-glow hover:shadow-crimson-glow-lg transition-all duration-300 hover:scale-105"
          >
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
            }}
            className="text-gray-400 hover:text-crimson-primary transition-colors"
          >
            {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  )
}

