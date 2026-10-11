import { MaintenanceTicket } from '@/types/database'

interface DashboardStatsProps {
  tickets: MaintenanceTicket[]
  currentFilter: string
  onFilterChange: (status: string) => void
}

export default function DashboardStats({ tickets, currentFilter, onFilterChange }: DashboardStatsProps) {
  const total = tickets.length
  const openCount = tickets.filter((t) => t.status === 'OPEN').length
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED').length

  // Helper สำหรับทำขอบ Highlight การ์ดที่ถูกเลือก
  const cardStyle = (status: string) => 
    `cursor-pointer transition-all p-5 rounded-xl border shadow-sm flex items-center justify-between bg-white ${
      currentFilter === status 
        ? 'ring-2 ring-indigo-600 border-indigo-600 shadow-md scale-[1.02]' 
        : 'border-gray-200 hover:border-gray-300'
    }`

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* การ์ดทั้งหมด (ALL) */}
      <div onClick={() => onFilterChange('ALL')} className={cardStyle('ALL')}>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">ตั๋วแจ้งซ่อมทั้งหมด</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">📋</div>
      </div>

      {/* การ์ด OPEN */}
      <div onClick={() => onFilterChange('OPEN')} className={cardStyle('OPEN')}>
        <div>
          <p className="text-xs font-medium text-amber-600 uppercase">รอรับเรื่อง (Open)</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{openCount}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-xl">⏳</div>
      </div>

      {/* การ์ด IN_PROGRESS */}
      <div onClick={() => onFilterChange('IN_PROGRESS')} className={cardStyle('IN_PROGRESS')}>
        <div>
          <p className="text-xs font-medium text-blue-600 uppercase">กำลังซ่อม (In Progress)</p>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{inProgressCount}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">🛠️</div>
      </div>

      {/* การ์ด RESOLVED */}
      <div onClick={() => onFilterChange('RESOLVED')} className={cardStyle('RESOLVED')}>
        <div>
          <p className="text-xs font-medium text-emerald-600 uppercase">ซ่อมเสร็จแล้ว (Resolved)</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{resolvedCount}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-xl">✅</div>
      </div>
    </div>
  )
}