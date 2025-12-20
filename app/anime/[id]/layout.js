import { featuredAnime, popularAnime } from '@/app/data/animeData'

export async function generateStaticParams() {
  const allAnime = [...featuredAnime, ...popularAnime]
  return allAnime.map((anime) => ({
    id: anime.id.toString(),
  }))
}

export default function AnimeDetailLayout({ children }) {
  return children
}

