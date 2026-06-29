'use client'
import { X } from 'lucide-react'

const SEGMENTS = [
  { name: 'Power Struggle', icon: '⚔️' },
  { name: 'War God', icon: '🗡️' },
  { name: 'Tycoon Life', icon: '💰' },
  { name: 'Workplace', icon: '🏢' },
  { name: 'Time Travel', icon: '⏳' },
  { name: 'Apocalypse', icon: '🌋' },
]

interface Props {
  selectedSegment: string | null
  setSelectedSegment: (segment: string | null) => void
}

export default function SegmentFilter({ selectedSegment, setSelectedSegment }: Props) {
  const handleSegmentClick = (segment: string) => {
    if (selectedSegment === segment) {
      setSelectedSegment(null)
    } else {
      setSelectedSegment(segment)
    }
  }

  return (
    <div className="px-8 py-4">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-gray-400 font-medium">Filter by Segment:</span>
        {SEGMENTS.map(s => (
          <button
            key={s.name}
            onClick={() => handleSegmentClick(s.name)}
            className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
              selectedSegment === s.name
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{s.icon}</span>
            {s.name}
          </button>
        ))}
        {selectedSegment && (
          <button
            onClick={() => setSelectedSegment(null)}
            className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            <X size={16} /> Clear
          </button>
        )}
      </div>
      {selectedSegment && (
        <p className="text-sm text-gray-400 mt-2">
          Showing projects in <span className="text-purple-400 font-semibold">{selectedSegment}</span>
        </p>
      )}
    </div>
  )
}