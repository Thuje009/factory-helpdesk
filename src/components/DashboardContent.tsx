'use client'

import { useState } from 'react'
import TicketCard from '@/components/TicketCard'
import DashboardStats from '@/components/DashboardStats'
import { MaintenanceTicket, Machine } from '@/types/database'
import Link from 'next/link' // 1. นำเข้า Link ของ Next.js

interface DashboardContentProps {
  tickets: MaintenanceTicket[]
  machines: Machine[]
}

export default function DashboardContent({ tickets }: DashboardContentProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === 'ALL') return true
    return ticket.status === filterStatus
  })

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header และ ปุ่มกดไปหน้าฟอร์มแจ้งซ่อมใหม่ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              🏭 Smart Factory Maintenance Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ระบบติดตามสถานะการแจ้งซ่อมและเบิกใช้อะไหล่แบบเรียลไทม์
            </p>
          </div>

          {/* 💡 ปุ่มกดไปหน้าฟอร์มแจ้งซ่อมใหม่ ตามที่คุณต้องการ */}
          <Link
            href="/form"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition text-sm gap-2 whitespace-nowrap"
          >
            ➕ แจ้งซ่อมใหม่
          </Link>
        </div>

        {/* กล่องสถิติ */}
        <DashboardStats 
          tickets={tickets} 
          currentFilter={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* รายการตั๋วแจ้งซ่อม (แสดงเต็มความกว้างสวยๆ) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>📋 รายการแจ้งซ่อม</span>
              {filterStatus !== 'ALL' && (
                <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full">
                  กรอง: {filterStatus}
                </span>
              )}
            </h2>
            <span className="text-xs font-medium text-gray-500">
              แสดง {filteredTickets.length} จากทั้งหมด {tickets.length} รายการ
            </span>
          </div>

          {filteredTickets && filteredTickets.length > 0 ? (
            filteredTickets.map((ticket: MaintenanceTicket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          ) : (
            <div className="bg-white p-8 text-center rounded-xl border border-gray-200 text-gray-500">
              ไม่พบรายการแจ้งซ่อมในสถานะนี้
            </div>
          )}
        </div>
      </div>
    </main>
  )
}