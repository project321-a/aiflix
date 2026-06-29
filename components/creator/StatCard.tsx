'use client'
import { LucideIcon } from 'lucide-react'

interface Props {
  icon: React.ReactNode
  label: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  subText?: string
  color?: string
}

export default function StatsCard({ 
  icon, 
  label, 
  value, 
  change, 
  changeType = 'neutral',
  subText,
  color = 'text-purple-400'
}: Props) {
  const changeColor = 
    changeType === 'up' ? 'text-green-400' :
    changeType === 'down' ? 'text-red-400' :
    'text-gray-400'

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className={`${color} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
      {change && (
        <div className={`text-xs ${changeColor} mt-1`}>
          {change} {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''}
        </div>
      )}
      {subText && (
        <div className="text-xs text-gray-500 mt-1">{subText}</div>
      )}
    </div>
  )
}