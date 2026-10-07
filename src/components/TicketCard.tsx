import { MaintenanceTicket } from '@/types/database'
import StatusBadge from '@/components/StatusBadge'

interface TicketCardProps {
  ticket: MaintenanceTicket
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <div className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
            Ticket #{ticket.id}
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-1">{ticket.error_code}</h2>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>

      {/* ข้อมูลเครื่องจักร */}
      {ticket.machines && (
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mb-3">
          📍 <strong>เครื่องจักร:</strong> {ticket.machines.machine_code} - {ticket.machines.name} | <strong>โซน:</strong> {ticket.machines.line_zone}
        </div>
      )}

      {/* รายการอะไหล่ที่เบิกใช้ */}
      {ticket.ticket_spare_parts && ticket.ticket_spare_parts.length > 0 && (
        <div className="border-t pt-3 mt-3">
          <p className="font-semibold text-xs text-gray-700 mb-2">🔧 อะไหล่ที่เบิกใช้:</p>
          <ul className="space-y-1">
            {ticket.ticket_spare_parts.map((item, idx) => {
              const part = item.spare_parts
              const totalCost = item.quantity_used * (part?.unit_price || 0)
              return (
                <li key={idx} className="text-xs text-gray-600 flex justify-between bg-slate-50 px-3 py-1.5 rounded">
                  <span>{part?.name} ({item.quantity_used} {part?.unit})</span>
                  <span className="font-medium text-gray-700">{totalCost.toLocaleString()} บาท</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}