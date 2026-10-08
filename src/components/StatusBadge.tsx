import React from 'react'

interface StatusBadgeProps {
  status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-700'
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-emerald-100 text-emerald-700'
    }
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getBadgeStyle(status)}`}>
      {status}
    </span>
  )
}

export default StatusBadge