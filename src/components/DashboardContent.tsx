'use client'

import { useState } from 'react'
import TicketCard from '@/components/TicketCard'
import DashboardStats from '@/components/DashboardStats'
import { MaintenanceTicket, Machine } from '@/types/database'
import Link from 'next/link'

interface DashboardContentProps {
  tickets: MaintenanceTicket[]
   machines: Machine[]
}

export default function DashboardContent({ tickets }: DashboardContentProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('') // 💡 เพิ่ม State สำหรับการค้นหา

  // ฟังก์ชันกรองตั๋วแบบผสม (ทั้งสถานะ + คำค้นหา)
  const filteredTickets = tickets.filter((ticket) => {
    // 1. กรองตามสถานะ
    const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus

    // 2. ดึงชื่อเครื่องจักรเพื่อเอามาเสิร์ช
    const machine = Array.isArray(ticket.machines) ? ticket.machines[0] : ticket.machines
    const machineName = machine?.name || ''
    const machineCode = machine?.machine_code || ''

    // 3. กรองตามคำค้นหา (ค้นหาจาก Error Code, Description, ชื่อเครื่องจักร, รหัสเครื่องจักร)
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch =
      query === '' ||
      ticket.error_code?.toLowerCase().includes(query) ||
      ticket.description?.toLowerCase().includes(query) ||
      machineName.toLowerCase().includes(query) ||
      machineCode.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              🏭 Smart Factory Maintenance Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ระบบติดตามสถานะการแจ้งซ่อมและเบิกใช้อะไหล่แบบเรียลไทม์
            </p>
          </div>

          <Link
            href="/form"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-md transition text-sm gap-2 whitespace-nowrap"
          >
            ➕ แจ้งซ่อมใหม่
          </Link>
        </div>

        {/* การ์ดสถิติ */}
        <DashboardStats 
          tickets={tickets} 
          currentFilter={filterStatus}
          onFilterChange={setFilterStatus}
        />

        {/* 🔍 ช่องค้นหา + แถบแสดงสถานะตัวกรอง */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาด้วย รหัส Error (เช่น ERR-402), ชื่อเครื่องจักร, หรืออาการเสีย..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 pt-1">
            <div className="flex items-center gap-2">
              <span>ผลการค้นหา:</span>
              <span className="font-semibold text-gray-800">{filteredTickets.length} รายการ</span>
              {(filterStatus !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setFilterStatus('ALL')
                    setSearchQuery('')
                  }}
                  className="text-indigo-600 hover:underline ml-2"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              )}
            </div>
          </div>
        </div>

        {/* รายการตั๋วแจ้งซ่อม */}
        <div className="space-y-4">
          {filteredTickets && filteredTickets.length > 0 ? (
            filteredTickets.map((ticket: MaintenanceTicket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-gray-500 space-y-2">
              <p className="text-2xl">🔎</p>
              <p className="font-medium">ไม่พบรายการแจ้งซ่อมที่ตรงกับการค้นหา</p>
              <p className="text-xs text-gray-400">ลองเปลี่ยนคำค้นหา หรือกดล้างตัวกรอง</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}