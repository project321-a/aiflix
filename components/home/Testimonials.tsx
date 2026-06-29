'use client'

const testimonials = [
  { 
    name: 'Amara Okafor', 
    role: 'Filmmaker, Lagos', 
    text: 'StreamAIV gave my AI films a global audience. The revenue share model is fair and transparent.' 
  },
  { 
    name: 'Ji-hoon Park', 
    role: 'Creator, Seoul', 
    text: 'I\'ve uploaded 12 series and the platform handles everything. Ad revenue is consistent.' 
  },
  { 
    name: 'Sarah Chen', 
    role: 'Animator, Beijing', 
    text: 'The best platform for AI content creators. Easy upload, great community, fair payouts.' 
  },
]

export default function Testimonials() {
  return (
    <div className="px-8 py-12 bg-gray-900/50">
      <h2 className="text-2xl font-bold text-center mb-8">💬 What Creators Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 italic">"{t.text}"</p>
            <div className="flex text-yellow-400 mt-2">★★★★★</div>
          </div>
        ))}
      </div>
    </div>
  )
}