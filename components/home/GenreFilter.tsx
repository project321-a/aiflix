'use client'

const GENRES = ['All', 'Action', 'Romance', 'Drama', 'Thriller', 'Sci-Fi', 'Historical', 'Fantasy', 'Crime', 'Documentary']

interface Props {
  selectedGenre: string
  setSelectedGenre: (genre: string) => void
}

export default function GenreFilter({ selectedGenre, setSelectedGenre }: Props) {
  return (
    <div className="px-8 py-6">
      <h2 className="text-xl font-bold mb-4">🎭 Browse By Genre</h2>
      <div className="flex flex-wrap gap-2">
        {GENRES.map(g => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              selectedGenre === g
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}