'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем localStorage при загрузке
    const savedUser = localStorage.getItem('animeverse_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Mock авторизация
    const mockUsers = {
      'user@test.com': { id: 1, email: 'user@test.com', name: 'Пользователь', role: 'user', avatar: null },
      'mod@test.com': { id: 2, email: 'mod@test.com', name: 'Модератор', role: 'moderator', avatar: null },
      'admin@test.com': { id: 3, email: 'admin@test.com', name: 'Администратор', role: 'admin', avatar: null },
    }

    const foundUser = mockUsers[email]
    if (foundUser && password === '123456') {
      const userData = { ...foundUser, registeredAt: '2024-01-01' }
      setUser(userData)
      localStorage.setItem('animeverse_user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    return { success: false, error: 'Неверный email или пароль' }
  }

  const register = (email, name, password) => {
    // Mock регистрация
    const newUser = {
      id: Date.now(),
      email,
      name,
      role: 'user',
      avatar: null,
      registeredAt: new Date().toISOString()
    }
    setUser(newUser)
    localStorage.setItem('animeverse_user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('animeverse_user')
    localStorage.removeItem('animeverse_lists')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('animeverse_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator' || user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

