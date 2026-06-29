'use client'
import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, User, CreditCard, Bell, Layout, AlertTriangle } from 'lucide-react'

export default function Settings() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading settings...</div>
  }

  return (
    <div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <SettingsIcon size={48} className="mx-auto text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Settings Coming Soon</h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Manage your creator profile, payout preferences, notifications, and studio settings.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="bg-gray-800 rounded-full px-3 py-1 text-xs flex items-center gap-1">
            <User size={12} /> Profile
          </span>
          <span className="bg-gray-800 rounded-full px-3 py-1 text-xs flex items-center gap-1">
            <CreditCard size={12} /> Payout
          </span>
          <span className="bg-gray-800 rounded-full px-3 py-1 text-xs flex items-center gap-1">
            <Bell size={12} /> Notifications
          </span>
          <span className="bg-gray-800 rounded-full px-3 py-1 text-xs flex items-center gap-1">
            <Layout size={12} /> Studio Preferences
          </span>
          <span className="bg-red-500/20 rounded-full px-3 py-1 text-xs flex items-center gap-1 text-red-400">
            <AlertTriangle size={12} /> Danger Zone
          </span>
        </div>
      </div>
    </div>
  )
}