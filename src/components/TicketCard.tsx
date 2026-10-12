'use client'
import { MaintenanceTicket } from '@/types/database'
import StatusBadge from '@/components/StatusBadge'
import { useState } from 'react'
import { updateTicketStatus } from '@/app/actions'
import TicketDetailModal from '@/components/TicketDetailModal' // 💡 Import Modal

interface TicketCardProps {
  ticket: MaintenanceTicket
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false) // 💡 State เปิด/ปิด Modal

  const machine = Array.isArray(ticket.machines) ? ticket.machines[0] : ticket.machines

  async function handleStatusChange(nextStatus: string) {
    setLoading(true)
    try {
      await updateTicketStatus(ticket.id, nextStatus)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (

<>
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3 hover:border-gray-300 transition">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
              #{ticket.id} - {ticket.error_code}
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-1">
              {machine?.name} ({machine?.machine_code})
            </h3>
          </div>
          
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
            ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
            'bg-emerald-100 text-emerald-700'
          }`}>
            {ticket.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>

        {/* ปุ่มแถบด้านล่าง */}
        <div className="border-t pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* ปุ่มเปิด Modal ดูรายละเอียดเชิงลึก */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline"
          >
            🔍 ดูรายละเอียด & อะไหล่
          </button>

          {/* ปุ่มเปลี่ยนสถานะ */}
          <div className="flex gap-1.5 ml-auto">
            {ticket.status !== 'OPEN' && (
              <button
                disabled={loading}
                onClick={() => handleStatusChange('OPEN')}
                className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-2.5 py-1 rounded border border-amber-200 transition"
              >
                🔄 เปิดใหม่ (Open)
              </button>
            )}

            {ticket.status !== 'IN_PROGRESS' && (
              <button
                disabled={loading}
                onClick={() => handleStatusChange('IN_PROGRESS')}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 transition"
              >
                🛠️ กำลังซ่อม (In Progress)
              </button>
            )}

            {ticket.status !== 'RESOLVED' && (
              <button
                disabled={loading}
                onClick={() => handleStatusChange('RESOLVED')}
                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200 transition"
              >
                ✅ ซ่อมเสร็จแล้ว (Resolved)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Render Modal เมื่อกดคลิก */}
      {isModalOpen && (
        <TicketDetailModal ticket={ticket} onClose={() => setIsModalOpen(false)} />
      )}
    </>
    // <div className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white">
    //   <div className="flex justify-between items-start mb-3">
    //     <div>
    //       <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
    //         Ticket #{ticket.id}
    //       </span>
    //       <h2 className="text-xl font-bold text-gray-900 mt-1">{ticket.error_code}</h2>
    //     </div>
    //     <StatusBadge status={ticket.status} />
    //   </div>

    //   <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>

    //   {/* ข้อมูลเครื่องจักร */}
    //   {ticket.machines && (
    //     <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mb-3">
    //       📍 <strong>เครื่องจักร:</strong> {ticket.machines.machine_code} - {ticket.machines.name} | <strong>โซน:</strong> {ticket.machines.line_zone}
    //     </div>
    //   )}

    //   รายการอะไหล่ที่เบิกใช้
    //   {ticket.ticket_spare_parts && ticket.ticket_spare_parts.length > 0 && (
    //     <div className="border-t pt-3 mt-3">
    //       <p className="font-semibold text-xs text-gray-700 mb-2">🔧 อะไหล่ที่เบิกใช้:</p>
    //       <ul className="space-y-1">
    //         {ticket.ticket_spare_parts.map((item, idx) => {
    //           const part = item.spare_parts
    //           const totalCost = item.quantity_used * (part?.unit_price || 0)
    //           return (
    //             <li key={idx} className="text-xs text-gray-600 flex justify-between bg-slate-50 px-3 py-1.5 rounded">
    //               <span>{part?.name} ({item.quantity_used} {part?.unit})</span>
    //               <span className="font-medium text-gray-700">{totalCost.toLocaleString()} บาท</span>
    //             </li>
    //           )
    //         })}
    //       </ul>
    //     </div>
    //   )}
    // </div>
  )
}

export default TicketCard



