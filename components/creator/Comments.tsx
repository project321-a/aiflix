'use client'
import { useState, useEffect } from 'react'
import { MessageSquare, CheckCircle, Clock, AlertCircle, Pin, Trash2 } from 'lucide-react'

export default function Comments() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading comments...</div>
  }

  return (
    <div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <MessageSquare size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Comments Coming Soon</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Manage comments on your videos — reply, pin, mark as spam, and moderate discussions.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="bg-gray-800 rounded-full px-3 py-1 text-xs">Unread</span>
          <span className="bg-gray-800 rounded-full px-3 py-1 text-xs">Needs Reply</span>
          <span className="bg-gray-800 rounded-full px-3 py-1 text-xs">Pinned</span>
          <span className="bg-gray-800 rounded-full px-3 py-1 text-xs">Spam</span>
        </div>
      </div>
    </div>
  )
}