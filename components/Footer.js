'use client'

import Link from 'next/link'
import { Play, Github, Twitter, Instagram, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'О нас', href: '/about' },
      { label: 'Контакты', href: '/contacts' },
      { label: 'Реклама', href: '/ads' },
      { label: 'Вакансии', href: '/jobs' },
    ],
    content: [
      { label: 'Аниме', href: '/anime' },
      { label: 'Фильмы', href: '/movies' },
      { label: 'Топ аниме', href: '/top' },
      { label: 'Расписание', href: '/schedule' },
    ],
    help: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Правила', href: '/rules' },
      { label: 'Конфиденциальность', href: '/privacy' },
      { label: 'Пользовательское соглашение', href: '/terms' },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="bg-dark-800 border-t border-white border-opacity-5">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-crimson-primary rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-crimson-primary to-crimson-dark p-2.5 rounded-lg">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <span className="text-2xl font-display font-bold gradient-text">
                AnimeVerse
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Лучшая платформа для просмотра аниме и аниме-фильмов.
              Наслаждайтесь высоким качеством и удобным интерфейсом.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2.5 rounded-lg glass-effect hover:bg-crimson-primary hover:bg-opacity-20 transition-all duration-200 group"
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-crimson-primary transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Компания</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-crimson-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Контент</h3>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-crimson-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Помощь</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-crimson-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white border-opacity-5 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} AnimeVerse. Все права защищены.
          </p>
          <p className="text-gray-400 text-sm flex items-center space-x-1">
            <span>Сделано с</span>
            <Heart className="w-4 h-4 text-crimson-primary fill-crimson-primary animate-pulse" />
            <span>для любителей аниме</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

