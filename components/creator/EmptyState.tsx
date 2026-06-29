'use client'
import Link from 'next/link'

interface Props {
  icon: React.ReactNode
  title: string
  description: string
  actionText?: string
  actionLink?: string
}

export default function EmptyState({ icon, title, description, actionText, actionLink }: Props) {
  return (
    <div className="text-center py-12 text-gray-400">
      <div className="opacity-50 mb-3">{icon}</div>
      <p className="font-semibold text-white">{title}</p>
      <p className="text-sm">{description}</p>
      {actionText && actionLink && (
        <Link href={actionLink} className="mt-3 inline-block text-purple-400 hover:underline text-sm">
          {actionText} →
        </Link>
      )}
    </div>
  )
}