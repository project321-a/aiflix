'use client'

export default function StatusBadge({ status }: { status: string }) {
  const styles = {
    ready: 'bg-green-500/20 text-green-400',
    processing: 'bg-yellow-500/20 text-yellow-400',
    draft: 'bg-gray-500/20 text-gray-400',
    failed: 'bg-red-500/20 text-red-400',
  }

  const labels = {
    ready: 'Ready',
    processing: 'Processing',
    draft: 'Draft',
    failed: 'Failed',
  }

  const className = styles[status as keyof typeof styles] || styles.draft
  const label = labels[status as keyof typeof labels] || status

  return (
    <span className={`px-2 py-0.5 rounded text-xs ${className}`}>
      {label}
    </span>
  )
}