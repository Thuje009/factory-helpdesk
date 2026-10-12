'use client'

import { MaintenanceTicket } from '@/types/database'

interface TicketDetailModalProps {
  ticket: MaintenanceTicket | null
  onClose: () => void
}

export default function TicketDetailModal({ ticket, onClose }: TicketDetailModalProps) {
  if (!ticket) return null

  // Helper ดึงข้อมูลเครื่องจักร
  const machine = Array.isArray(ticket.machines) ? ticket.machines[0] : ticket.machines

  // คำนวณราคารวมอะไหล่ทั้งหมด
  const sparePartsList = ticket.ticket_spare_parts || []
  const totalPrice = sparePartsList.reduce((sum, item) => {
    const part = Array.isArray(item.spare_parts) ? item.spare_parts[0] : item.spare_parts
    const price = part?.unit_price || 0
    return sum + price * (item.quantity_used || 0)
  }, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-150">
        
        {/* Modal Header */}
        <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded font-semibold">
                #{ticket.id} - {ticket.error_code}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
                ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {ticket.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-2">
              {machine?.name} ({machine?.machine_code})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">โซน/สายการผลิต: {machine?.line_zone || '-'}</p>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-white border rounded-lg p-1.5 transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* รายละเอียดอาการเสีย */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              📝 รายละเอียดปัญหา / อาการเสีย
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-800 leading-relaxed">
              {ticket.description || 'ไม่มีการระบุรายละเอียดเพิ่มเติม'}
            </div>
          </div>

          {/* ข้อมูลระยะเวลา Downtime และ Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60">
              <span className="text-xs text-amber-600 font-medium block">⏱️ เวลาหยุดเครื่อง (Downtime)</span>
              <span className="text-lg font-bold text-amber-800 mt-1 block">
                {ticket.downtime_minutes || 0} นาที
              </span>
            </div>
            <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/60">
              <span className="text-xs text-blue-600 font-medium block">🚨 ความสำคัญ (Priority)</span>
              <span className="text-lg font-bold text-blue-800 mt-1 block">
                {ticket.priority || 'NORMAL'}
              </span>
            </div>
          </div>

          {/* ตารางรายการอะไหล่ที่เบิกใช้ */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              ⚙️ รายการอะไหล่ที่เบิกใช้ (Spare Parts)
            </h3>

            {sparePartsList.length > 0 ? (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 text-xs">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">ชื่ออะไหล่</th>
                      <th className="py-2.5 px-4 font-semibold text-center">จำนวน</th>
                      <th className="py-2.5 px-4 font-semibold text-right">ราคา/หน่วย</th>
                      <th className="py-2.5 px-4 font-semibold text-right">รวม (บาท)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sparePartsList.map((item, idx) => {
                      const part = Array.isArray(item.spare_parts) ? item.spare_parts[0] : item.spare_parts
                      const itemTotal = (part?.unit_price || 0) * (item.quantity_used || 0)

                      return (
                        <tr key={idx} className="hover:bg-gray-50/50 transition">
                          <td className="py-3 px-4 font-medium text-gray-800">{part?.name || '-'}</td>
                          <td className="py-3 px-4 text-center text-gray-600">
                            {item.quantity_used} {part?.unit || 'ชิ้น'}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600">
                            {part?.unit_price ? part.unit_price.toLocaleString() : 0} ฿
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-800">
                            {itemTotal.toLocaleString()} ฿
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold text-gray-900 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right">ราคารวมอะไหล่ทั้งหมด:</td>
                      <td className="py-3 px-4 text-right text-indigo-600 text-base">
                        {totalPrice.toLocaleString()} ฿
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 text-center rounded-xl border border-dashed border-gray-300 text-gray-400 text-xs">
                ไม่มีการเบิกใช้อะไหล่สำหรับตั๋วใบนี้
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg transition text-sm"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  )
}