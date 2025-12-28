/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Оптимизация изображений
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  
  // Оптимизация компиляции
  swcMinify: true,
  
  // Экспериментальные функции для производительности
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Настройка ISR
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig

