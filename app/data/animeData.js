// Функция для получения всех аниме (включая кастомные)
export const getAllAnime = () => {
  const customAnime = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('custom_anime') || '[]')
    : []
  
  return [...featuredAnime, ...popularAnime, ...customAnime]
}

// Mock data для демонстрации
export const featuredAnime = [
  {
    id: 1,
    title: "Атака титанов",
    titleEn: "Attack on Titan",
    rating: 9.2,
    year: 2023,
    episodes: 87,
    genre: ["Экшен", "Драма", "Фэнтези"],
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
    description: "Человечество на грани вымирания из-за гигантских гуманоидов - титанов.",
    status: "Завершён"
  },
  {
    id: 2,
    title: "Магическая битва",
    titleEn: "Jujutsu Kaisen",
    rating: 8.9,
    year: 2023,
    episodes: 47,
    genre: ["Экшен", "Сверхъестественное", "Драма"],
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
    description: "Мир магии и проклятых духов, где школьники учатся их изгонять.",
    status: "Выходит"
  },
  {
    id: 3,
    title: "Клинок, рассекающий демонов",
    titleEn: "Demon Slayer",
    rating: 9.0,
    year: 2023,
    episodes: 63,
    genre: ["Экшен", "Приключения", "Драма"],
    image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&q=80",
    description: "История юноши, который стал охотником на демонов после трагедии в семье.",
    status: "Выходит"
  },
  {
    id: 4,
    title: "Моя геройская академия",
    titleEn: "My Hero Academia",
    rating: 8.7,
    year: 2023,
    episodes: 138,
    genre: ["Экшен", "Комедия", "Супергерои"],
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80",
    description: "В мире, где почти все люди обладают суперспособностями.",
    status: "Выходит"
  },
  {
    id: 5,
    title: "Ванпанчмен",
    titleEn: "One Punch Man",
    rating: 8.8,
    year: 2023,
    episodes: 24,
    genre: ["Экшен", "Комедия", "Пародия"],
    image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=800&q=80",
    description: "Герой, который может победить любого противника одним ударом.",
    status: "Анонсирован 3 сезон"
  },
  {
    id: 6,
    title: "Человек-бензопила",
    titleEn: "Chainsaw Man",
    rating: 8.9,
    year: 2023,
    episodes: 12,
    genre: ["Экшен", "Ужасы", "Сверхъестественное"],
    image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=800&q=80",
    description: "Охотник на дьяволов, который может превращаться в бензопилу.",
    status: "Завершён"
  }
]

export const popularAnime = [
  {
    id: 7,
    title: "Токийские мстители",
    titleEn: "Tokyo Revengers",
    rating: 8.5,
    year: 2023,
    episodes: 50,
    genre: ["Экшен", "Драма", "Сверхъестественное"],
    image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80",
    description: "Путешествие во времени для изменения трагического прошлого.",
    status: "Выходит"
  },
  {
    id: 8,
    title: "Сага о Винланде",
    titleEn: "Vinland Saga",
    rating: 9.1,
    year: 2023,
    episodes: 48,
    genre: ["Экшен", "Приключения", "Драма"],
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&q=80",
    description: "Эпическая сага о викингах и поиске легендарной земли.",
    status: "Выходит"
  },
  {
    id: 9,
    title: "Блич: Тысячелетняя кровавая война",
    titleEn: "Bleach TYBW",
    rating: 9.0,
    year: 2023,
    episodes: 26,
    genre: ["Экшен", "Приключения", "Сверхъестественное"],
    image: "https://images.unsplash.com/photo-1606316890421-572005b7de93?w=800&q=80",
    description: "Финальная арка легендарного аниме о проводниках душ.",
    status: "Выходит"
  },
  {
    id: 10,
    title: "Адская школа",
    titleEn: "Hell's Paradise",
    rating: 8.6,
    year: 2023,
    episodes: 13,
    genre: ["Экшен", "Приключения", "Фэнтези"],
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80",
    description: "Смертники отправляются на таинственный остров за эликсиром бессмертия.",
    status: "Завершён"
  },
  {
    id: 11,
    title: "Синий замок",
    titleEn: "Blue Lock",
    rating: 8.4,
    year: 2023,
    episodes: 24,
    genre: ["Спорт", "Драма"],
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    description: "300 лучших нападающих Японии борются за место в сборной.",
    status: "Завершён"
  },
  {
    id: 12,
    title: "Шпион x Семья",
    titleEn: "Spy x Family",
    rating: 8.8,
    year: 2023,
    episodes: 25,
    genre: ["Экшен", "Комедия", "Приключения"],
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    description: "Шпион, убийца и телепат создают фиктивную семью.",
    status: "Выходит"
  }
]

export const animeMovies = [
  {
    id: 101,
    title: "Ходячий замок",
    titleEn: "Howl's Moving Castle",
    rating: 9.3,
    year: 2004,
    duration: "119 мин",
    genre: ["Фэнтези", "Приключения", "Романтика"],
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800&q=80",
    description: "Девушка, превращённая в старуху, находит приют в движущемся замке.",
    studio: "Studio Ghibli"
  },
  {
    id: 102,
    title: "Твоё имя",
    titleEn: "Your Name",
    rating: 9.2,
    year: 2016,
    duration: "106 мин",
    genre: ["Романтика", "Драма", "Сверхъестественное"],
    image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&q=80",
    description: "Двое подростков из разных миров начинают меняться телами.",
    studio: "CoMix Wave Films"
  },
  {
    id: 103,
    title: "Форма голоса",
    titleEn: "A Silent Voice",
    rating: 9.1,
    year: 2016,
    duration: "130 мин",
    genre: ["Драма", "Романтика", "Школа"],
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    description: "История о раскаянии, прощении и втором шансе.",
    studio: "Kyoto Animation"
  },
  {
    id: 104,
    title: "Унесённые призраками",
    titleEn: "Spirited Away",
    rating: 9.4,
    year: 2001,
    duration: "125 мин",
    genre: ["Фэнтези", "Приключения", "Семейный"],
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    description: "Девочка попадает в мир духов и должна спасти своих родителей.",
    studio: "Studio Ghibli"
  }
]

export const genres = [
  "Экшен",
  "Приключения",
  "Комедия",
  "Драма",
  "Романтика",
  "Фэнтези",
  "Сверхъестественное",
  "Ужасы",
  "Психологическое",
  "Спорт",
  "Школа",
  "Супергерои"
]
